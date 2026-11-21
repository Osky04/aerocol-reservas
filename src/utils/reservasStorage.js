// F2 — Persistencia de reservas en localStorage.
// localStorage solo guarda TEXTO → JSON.stringify al guardar, JSON.parse al leer.
const CLAVE = 'aerocol-reservas'

export function cargarReservas() {
  try {
    const guardadas = localStorage.getItem(CLAVE)
    return guardadas ? JSON.parse(guardadas) : [] // primera vez: no hay nada → []
  } catch {
    return [] // si el JSON guardado está dañado, empezamos vacío en vez de romper la app
  }
}

export function guardarReservas(reservas) {
  localStorage.setItem(CLAVE, JSON.stringify(reservas))
}
