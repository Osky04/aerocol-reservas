import { useState } from 'react'
import './App.css'
import { CIUDADES, VUELOS } from './data/vuelos.js'
import Header from './components/Header.jsx'
import SelectorRuta from './components/SelectorRuta.jsx'
import SelectorOrden from './components/SelectorOrden.jsx'
import ListaVuelos from './components/ListaVuelos.jsx'
import FormularioReserva from './components/FormularioReserva.jsx'
import MisReservas from './components/MisReservas.jsx'
import Footer from './components/Footer.jsx'
import { cargarReservas, guardarReservas } from './utils/reservasStorage.js'
import { ordenarVuelos } from './utils/ordenarVuelos.js'

function nombreCiudad(codigo) {
  return CIUDADES.find((c) => c.codigo === codigo)?.nombre ?? codigo
}

function App() {
  // ----- Estado (lo que la app debe recordar) -----
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [orden, setOrden] = useState('precio-asc') // F3
  const [seleccionado, setSeleccionado] = useState(null) // F1/F3: vuelo elegido
  const [reservas, setReservas] = useState(cargarReservas) // F2: función inicializadora (sin paréntesis)

  // ----- Estado DERIVADO (se calcula en cada render) -----
  const ciudadesDestino = CIUDADES.filter((c) => c.codigo !== origen)
  const vuelosEncontrados =
    origen !== '' && destino !== ''
      ? VUELOS.filter((v) => v.origen === origen && v.destino === destino)
      : []
  const vuelosOrdenados = ordenarVuelos(vuelosEncontrados, orden) // F3: copia ordenada

  // ----- Ruta: al cambiarla, limpiamos el vuelo seleccionado (F3) -----
  const manejarOrigen = (codigo) => {
    setOrigen(codigo)
    if (codigo === destino) setDestino('')
    setSeleccionado(null)
  }

  const manejarDestino = (codigo) => {
    setDestino(codigo)
    setSeleccionado(null)
  }

  const intercambiar = () => {
    setOrigen(destino)
    setDestino(origen)
    setSeleccionado(null)
  }

  // ----- F2: reservas (siempre un array NUEVO + guardar en localStorage) -----
  const actualizarReservas = (nuevasReservas) => {
    setReservas(nuevasReservas)
    guardarReservas(nuevasReservas)
  }

  const agregarReserva = (nueva) => {
    actualizarReservas([...reservas, nueva])
    setSeleccionado(null) // cerramos el formulario después de reservar
  }

  const eliminarReserva = (id) => {
    actualizarReservas(reservas.filter((r) => r.id !== id))
  }

  return (
    <main>
      <Header aerolinea="AeroCol" eslogan="Tu vuelo en un clic" />

      <section className="selector">
        <h2>✈️ Busca tu vuelo</h2>

        <SelectorRuta
          origen={origen}
          destino={destino}
          ciudades={CIUDADES}
          ciudadesDestino={ciudadesDestino}
          onOrigen={manejarOrigen}
          onDestino={manejarDestino}
        />

        <button type="button" onClick={intercambiar} disabled={!origen || !destino}>
          🔄 Intercambiar
        </button>

        <SelectorOrden orden={orden} onOrden={setOrden} />
      </section>

      {!origen || !destino ? (
        <p className="mensaje">Elige origen y destino para buscar vuelos 🛫</p>
      ) : vuelosEncontrados.length === 0 ? (
        <p className="mensaje">No hay vuelos para esa ruta 🙃</p>
      ) : (
        <ListaVuelos
          vuelos={vuelosOrdenados}
          nombreOrigen={nombreCiudad(origen)}
          nombreDestino={nombreCiudad(destino)}
          seleccionadoId={seleccionado?.id}
          onSeleccionar={setSeleccionado}
        />
      )}

      {/* F1: el formulario solo existe si hay un vuelo elegido.
          key={seleccionado.id} hace que se reinicie al elegir otro vuelo. */}
      {seleccionado && (
        <FormularioReserva
          key={seleccionado.id}
          vuelo={seleccionado}
          nombreOrigen={nombreCiudad(origen)}
          nombreDestino={nombreCiudad(destino)}
          onReservar={agregarReserva}
        />
      )}

      <MisReservas reservas={reservas} onEliminar={eliminarReserva} />

      <Footer anio={2026} />
    </main>
  )
}

export default App
