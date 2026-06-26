/* ============================================================
   DrivePrep+ — storageUsuario
   Helper central para aislar datos por usuario en localStorage.

   Por qué existe:
   Antes de esto, claves como 'driveprep_historial' eran globales:
   cualquier usuario que iniciara sesión en el mismo navegador veía
   los datos del usuario anterior. Esta capa agrega el id del
   usuario a cada clave para que cada cuenta tenga su propio espacio.

   TODO Fase 4: cuando exista backend real, todo esto se reemplaza
   por llamadas a la API con el userId viniendo del JWT — el cliente
   ya no debe ser la fuente de verdad de los datos del usuario.
   ============================================================ */

const SUFIJO_SEPARADOR = '::u';

/* ── Construye la clave con namespace de usuario ──
   Si no hay userId (nadie logueado), devuelve la clave base sin
   modificar — útil para datos verdaderamente globales como la
   lista de cuentas registradas o la sesión activa. */
export function claveUsuario(claveBase, userId) {
  if (!userId) return claveBase;
  return `${claveBase}${SUFIJO_SEPARADOR}${userId}`;
}

/* ── Lectura segura con clave de usuario ── */
export function leerJSON(claveBase, userId, valorDefecto) {
  try {
    const raw = localStorage.getItem(claveUsuario(claveBase, userId));
    return raw ? JSON.parse(raw) : valorDefecto;
  } catch {
    return valorDefecto;
  }
}

/* ── Escritura segura con clave de usuario ── */
export function guardarJSON(claveBase, userId, valor) {
  try {
    localStorage.setItem(claveUsuario(claveBase, userId), JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

/* ── Elimina una clave específica de un usuario ── */
export function eliminarClave(claveBase, userId) {
  try {
    localStorage.removeItem(claveUsuario(claveBase, userId));
  } catch { /* ignore */ }
}

/* ── Lista de todas las claves base que tienen datos por usuario ──
   Se usa para migración y para limpiar todo el namespace de una
   cuenta (por ejemplo, si se implementa "eliminar mi cuenta"). */
export const CLAVES_POR_USUARIO = [
  'driveprep_ajustes_idioma',
  'driveprep_ajustes_tema',
  'driveprep_uso_semanal',
  'driveprep_historial',
  'driveprep_practica_historial',
  'driveprep_practica_progreso',
  'driveprep_perfil_extra',
  'driveprep_ajustes',
];

/* ── Migra datos antiguos sin namespace al usuario actual ──
   Solo se ejecuta una vez por usuario: si detecta data "huérfana"
   (de antes de implementar el aislamiento) y el usuario todavía no
   tiene su propio namespace, copia esos datos a su cuenta.
   Esto evita que, al activar esta mejora, alguien pierda el
   progreso de pruebas que ya tenía guardado. */
export function migrarDatosHuérfanos(userId) {
  if (!userId) return;

  const banderaMigracion = claveUsuario('driveprep_migracion_hecha', userId);
  if (localStorage.getItem(banderaMigracion)) return; // ya migrado antes

  CLAVES_POR_USUARIO.forEach((claveBase) => {
    const valorViejo = localStorage.getItem(claveBase);
    const claveNueva = claveUsuario(claveBase, userId);
    const yaTieneNueva = localStorage.getItem(claveNueva);

    if (valorViejo && !yaTieneNueva) {
      localStorage.setItem(claveNueva, valorViejo);
    }
  });

  localStorage.setItem(banderaMigracion, '1');
}

/* ── Limpia todo el namespace de un usuario (uso futuro) ── */
export function limpiarNamespaceUsuario(userId) {
  if (!userId) return;
  CLAVES_POR_USUARIO.forEach((claveBase) => eliminarClave(claveBase, userId));
  localStorage.removeItem(claveUsuario('driveprep_migracion_hecha', userId));
}
