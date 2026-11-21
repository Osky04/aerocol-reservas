import { formatoPrecio } from '../utils/formato.js'

// F2 — Mis reservas. Recibe datos (reservas) y una función (onEliminar).
// No modifica nada por sí mismo: solo muestra y avisa a App.
function MisReservas({ reservas, onEliminar }) {
  return (
    <section className="reservas">
      <h2>🎫 Mis reservas ({reservas.length})</h2>

      {reservas.length === 0 ? (
        <p className="vacio">Aún no tienes reservas 👀</p>
      ) : (
        <ul>
          {reservas.map((r) => (
            <li key={r.id} className="reserva">
              <div>
                <p>
                  <strong>{r.nombre}</strong> · {r.pasajeros} pasajero{r.pasajeros !== 1 ? 's' : ''}{' '}
                  · {r.clase}
                </p>
                <p>
                  Vuelo {r.vueloId} · {r.ruta} · <b>{formatoPrecio(r.total)}</b>
                </p>
                <small>📅 Reservado el {r.fecha}</small>
              </div>
              <button
                type="button"
                onClick={() => onEliminar(r.id)}
                aria-label={`Eliminar reserva de ${r.nombre}`}
                title="Eliminar reserva"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default MisReservas
