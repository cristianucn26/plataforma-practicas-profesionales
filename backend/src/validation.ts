export function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
export function validStudent(input: { nombres?: string; apellidos?: string; correo?: string; semestre?: number }): string[] {
  const errors: string[] = [];
  if (!input.nombres?.trim()) errors.push('Los nombres son obligatorios.');
  if (!input.apellidos?.trim()) errors.push('Los apellidos son obligatorios.');
  if (!input.correo || !validEmail(input.correo)) errors.push('El correo institucional no es válido.');
  if (!Number.isInteger(input.semestre) || Number(input.semestre) < 1 || Number(input.semestre) > 12) errors.push('El semestre debe estar entre 1 y 12.');
  return errors;
}
export function validOffer(input: { titulo?: string; descripcion?: string; cupos?: number; fecha_cierre?: string }): string[] {
  const errors: string[] = [];
  if (!input.titulo?.trim()) errors.push('El título es obligatorio.');
  if (!input.descripcion?.trim()) errors.push('La descripción es obligatoria.');
  if (!Number.isInteger(input.cupos) || Number(input.cupos) < 1) errors.push('Los cupos deben ser un entero mayor que cero.');
  if (!input.fecha_cierre || Number.isNaN(Date.parse(input.fecha_cierre))) errors.push('La fecha de cierre no es válida.');
  return errors;
}
