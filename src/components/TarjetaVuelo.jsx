import { formatoPrecio } from '../utils/formato.js'

// Props nuevas: seleccionada (para resaltarse) y onSeleccionar (para avisar a App).
// La tarjeta NO guarda qué vuelo está elegido: solo muestra y reporta.
function TarjetaVuelo({ vuelo, seleccionada, onSeleccionar }) {
  return (
    <li
      className={seleccionada ? 'tarjeta seleccionada' : 'tarjeta'}
      onClick={() => onSeleccionar?.(vuelo)}
    >
      <strong>🛩️ {vuelo.avion}</strong>
      <span>🕐 {vuelo.hora}</span>
      <b>{formatoPrecio(vuelo.precio)}</b>
      <button type="button">{seleccionada ? '✔ Elegido' : 'Ver'}</button>
    </li>
  )
}

export default TarjetaVuelo
