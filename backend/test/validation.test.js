import test from 'node:test';
import assert from 'node:assert/strict';
import { validEmail, validStudent, validOffer } from '../src/validation.ts';

test('CP-01: acepta un correo con formato válido', () => {
  assert.equal(validEmail('estudiante@ucn.edu.co'), true);
});
test('CP-02: rechaza estudiante sin nombres y con semestre fuera de rango', () => {
  const errors = validStudent({ nombres: '', apellidos: 'Pérez', correo: 'persona@ucn.edu.co', semestre: 15 });
  assert.equal(errors.length, 2);
});
test('CP-03: rechaza una oferta sin título y con cupos cero', () => {
  const errors = validOffer({ titulo: '', descripcion: 'Descripción', cupos: 0, fecha_cierre: '2027-12-31' });
  assert.equal(errors.length, 2);
});
test('CP-04: acepta una oferta con datos válidos', () => {
  assert.deepEqual(validOffer({ titulo: 'Practicante QA', descripcion: 'Apoyo en pruebas', cupos: 2, fecha_cierre: '2027-12-31' }), []);
});
