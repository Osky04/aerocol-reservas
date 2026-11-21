// F3 — Devuelve una COPIA ordenada. Nunca modifica el array que recibe,
// porque .sort() muta el array sobre el que se llama.
export function ordenarVuelos(vuelos, orden) {
  return [...vuelos].sort((a, b) => {
    if (orden === 'precio-desc') return b.precio - a.precio
    if (orden === 'hora') return a.hora.localeCompare(b.hora)
    if (orden === 'avion') return a.avion.localeCompare(b.avion)
    return a.precio - b.precio // 'precio-asc' (opción por defecto)
  })
}
