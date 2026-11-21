import { useState } from 'react'
import { CLASES } from '../data/vuelos.js'
import { formatoPrecio } from '../utils/formato.js'

// F1 — Formulario de reserva.
// Su estado (nombre, pasajeros, clase) es LOCAL: solo este componente lo necesita.
// App solo recibe la reserva terminada a través de onReservar.
function FormularioReserva({ vuelo, nombreOrigen, nombreDestino, onReservar }) {
  const [nombre, setNombre] = useState('')
  const [pasajeros, setPasajeros] = useState(1)
  const [clase, setClase] = useState('economica')

  // Estado DERIVADO: se calcula en cada render, no es un useState
  const claseElegida = CLASES.find((c) => c.id === clase)
  const total = Math.round(vuelo.precio * pasajeros * claseElegida.factor)
  const nombreValido = nombre.trim() !== ''

  const manejarEnvio = (e) => {
    e.preventDefault() // un <form> recarga la página al enviarse; esto lo evita
    if (!nombreValido) return

    onReservar({
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      vueloId: vuelo.id,
      ruta: `${nombreOrigen} → ${nombreDestino}`,
      avion: vuelo.avion,
      hora: vuelo.hora,
      pasajeros,
      clase: claseElegida.nombre,
      total, // aquí SÍ se guarda: es la "foto" del precio en el momento de reservar
      fecha: new Date().toLocaleDateString('es-CO'),
    })
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <h2>
        🎟️ Reservar {vuelo.avion} · {vuelo.hora}
      </h2>

      {/* F3 — Detalle del vuelo elegido */}
      <p className="detalle">
        Vuelo {vuelo.id} · {nombreOrigen} → {nombreDestino} · {formatoPrecio(vuelo.precio)} por
        pasajero
      </p>

      <label className="campo">
        Nombre del pasajero
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Ana García"
        />
      </label>

      <div className="contador">
        <span>👥 Pasajeros</span>
        <button
          type="button"
          onClick={() => setPasajeros(pasajeros - 1)}
          disabled={pasajeros <= 1}
          aria-label="Quitar pasajero"
        >
          −
        </button>
        <strong>{pasajeros}</strong>
        <button
          type="button"
          onClick={() => setPasajeros(pasajeros + 1)}
          aria-label="Agregar pasajero"
        >
          +
        </button>
      </div>

      <div className="clases">
        {CLASES.map((c) => (
          <label key={c.id}>
            <input
              type="radio"
              name="clase"
              value={c.id}
              checked={clase === c.id}
              onChange={() => setClase(c.id)}
            />
            {c.nombre} <small>×{c.factor}</small>
          </label>
        ))}
      </div>

      <div className="total">
        <span>
          💰 Total: <b>{formatoPrecio(total)}</b>
        </span>
        <button type="submit" className="reservar" disabled={!nombreValido}>
          ✅ Reservar
        </button>
      </div>
    </form>
  )
}

export default FormularioReserva
