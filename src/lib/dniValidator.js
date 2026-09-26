// Validación del dígito de control de DNI/NIE españoles.
// La misma lógica vive también (en TypeScript) dentro de la Edge Function
// "registrar" — si cambias el algoritmo aquí, actualízalo también allí.
const LETRAS = 'TRWAGMYFPDXBNJZSQVHLCKE';

export function validarDniNie(valor) {
  const v = String(valor).toUpperCase().trim().replace(/[^0-9A-Z]/g, '');

  const dniMatch = v.match(/^(\d{8})([A-Z])$/);
  const nieMatch = v.match(/^([XYZ])(\d{7})([A-Z])$/);

  let numero;
  let letra;

  if (dniMatch) {
    numero = parseInt(dniMatch[1], 10);
    letra = dniMatch[2];
  } else if (nieMatch) {
    const mapa = { X: '0', Y: '1', Z: '2' };
    numero = parseInt(mapa[nieMatch[1]] + nieMatch[2], 10);
    letra = nieMatch[3];
  } else {
    return { valido: false, motivo: 'Formato no reconocido (8 dígitos + letra, o X/Y/Z + 7 dígitos + letra)' };
  }

  if (LETRAS[numero % 23] !== letra) {
    return { valido: false, motivo: 'El dígito de control no coincide' };
  }

  return { valido: true, normalizado: v };
}

// Móviles españoles: +34 6XX/7XX XXX XXX
export function validarTelefonoEspanol(valor) {
  return /^\+34[6-9]\d{8}$/.test(String(valor).trim());
}
