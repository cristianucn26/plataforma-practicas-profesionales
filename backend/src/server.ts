import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import { validStudent, validOffer, validEmail } from './validation.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }); }
  catch { res.status(503).json({ status: 'error', database: 'disconnected' }); }
});

app.get('/api/estudiantes', async (_req, res) => {
  try {
    const q = await pool.query(`SELECT e.id_estudiante,e.nombres,e.apellidos,e.correo_institucional,e.semestre,p.nombre AS programa
      FROM estudiante e JOIN programa p ON p.id_programa=e.id_programa ORDER BY e.id_estudiante DESC`);
    res.json(q.rows);
  } catch { res.status(500).json({ error: 'No fue posible consultar estudiantes.' }); }
});
app.post('/api/estudiantes', async (req, res) => {
  const errors = validStudent(req.body);
  if (errors.length) return res.status(400).json({ errors });
  try {
    const program = await pool.query('SELECT id_programa FROM programa ORDER BY id_programa LIMIT 1');
    if (!program.rowCount) return res.status(400).json({ error: 'Primero registre un programa académico.' });
    const q = await pool.query(`INSERT INTO estudiante(id_programa,nombres,apellidos,correo_institucional,semestre)
      VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [program.rows[0].id_programa,req.body.nombres.trim(),req.body.apellidos.trim(),req.body.correo.trim().toLowerCase(),req.body.semestre]);
    res.status(201).json(q.rows[0]);
  } catch (e: any) {
    if (e.code === '23505') return res.status(409).json({ error: 'Ya existe un estudiante con ese correo.' });
    res.status(500).json({ error: 'No fue posible registrar el estudiante.' });
  }
});
app.get('/api/empresas', async (_req, res) => {
  try { const q=await pool.query('SELECT * FROM empresa ORDER BY id_empresa DESC'); res.json(q.rows); }
  catch { res.status(500).json({error:'No fue posible consultar empresas.'}); }
});
app.post('/api/empresas', async (req,res) => {
  const { razon_social, nit, correo_contacto }=req.body;
  if (!razon_social?.trim() || !nit?.trim() || !validEmail(correo_contacto || '')) return res.status(400).json({error:'Razón social, NIT y correo válido son obligatorios.'});
  try { const q=await pool.query('INSERT INTO empresa(razon_social,nit,correo_contacto) VALUES($1,$2,$3) RETURNING *',[razon_social.trim(),nit.trim(),correo_contacto.trim().toLowerCase()]); res.status(201).json(q.rows[0]); }
  catch(e:any){ if(e.code==='23505') return res.status(409).json({error:'El NIT ya está registrado.'}); res.status(500).json({error:'No fue posible registrar la empresa.'}); }
});
app.get('/api/ofertas', async (_req,res) => {
  try { const q=await pool.query(`SELECT o.*,e.razon_social FROM oferta o JOIN empresa e ON e.id_empresa=o.id_empresa ORDER BY o.id_oferta DESC`); res.json(q.rows); }
  catch { res.status(500).json({error:'No fue posible consultar ofertas.'}); }
});
app.post('/api/ofertas', async (req,res) => {
  const errors=validOffer(req.body);
  if(errors.length) return res.status(400).json({errors});
  try {
    const q=await pool.query(`INSERT INTO oferta(id_empresa,titulo,descripcion,cupos,modalidad,fecha_cierre)
      VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.body.id_empresa,req.body.titulo.trim(),req.body.descripcion.trim(),req.body.cupos,req.body.modalidad || 'Presencial',req.body.fecha_cierre]);
    res.status(201).json(q.rows[0]);
  } catch { res.status(500).json({error:'No fue posible publicar la oferta. Verifique la empresa seleccionada.'}); }
});
app.get('/api/postulaciones', async (_req,res) => {
  try { const q=await pool.query(`SELECT p.id_postulacion,p.fecha,p.estado,
    e.nombres || ' ' || e.apellidos AS estudiante,o.titulo AS oferta
    FROM postulacion p JOIN estudiante e ON e.id_estudiante=p.id_estudiante
    JOIN oferta o ON o.id_oferta=p.id_oferta ORDER BY p.fecha DESC`); res.json(q.rows); }
  catch { res.status(500).json({error:'No fue posible consultar postulaciones.'}); }
});
app.post('/api/postulaciones', async (req,res) => {
  const {id_estudiante,id_oferta}=req.body;
  if(!Number.isInteger(Number(id_estudiante)) || !Number.isInteger(Number(id_oferta))) return res.status(400).json({error:'Seleccione un estudiante y una oferta válidos.'});
  try {
    const q=await pool.query('INSERT INTO postulacion(id_estudiante,id_oferta) VALUES($1,$2) RETURNING *',[id_estudiante,id_oferta]);
    res.status(201).json(q.rows[0]);
  } catch(e:any) {
    if(e.code==='23505') return res.status(409).json({error:'El estudiante ya se postuló a esta oferta.'});
    if(e.code==='23503') return res.status(400).json({error:'El estudiante o la oferta no existen.'});
    res.status(500).json({error:'No fue posible registrar la postulación.'});
  }
});
const port=Number(process.env.PORT || 3001);
app.listen(port,()=>console.log(`API de prácticas disponible en http://localhost:${port}`));
