// F3 — Control "Ordenar por". Select controlado: el valor (orden) vive en App.
const OPCIONES_ORDEN = [
  { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
  { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
  { valor: 'hora', texto: 'Hora de salida' },
  { valor: 'avion', texto: 'Avión (A–Z)' },
]

function SelectorOrden({ orden, onOrden }) {
  return (
    <label className="campo orden">
      Ordenar por
      <select value={orden} onChange={(e) => onOrden(e.target.value)}>
        {OPCIONES_ORDEN.map((op) => (
          <option key={op.valor} value={op.valor}>
            {op.texto}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SelectorOrden
