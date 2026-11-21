import { useState } from 'react'
import './App.css'
import { CIUDADES, VUELOS } from './data/vuelos.js'
import Header from './components/Header.jsx'
import SelectorRuta from './components/SelectorRuta.jsx'
import ListaVuelos from './components/ListaVuelos.jsx'
import FormularioReserva from './components/FormularioReserva.jsx'
import Footer from './components/Footer.jsx'

function nombreCiudad(codigo) {
  return CIUDADES.find((c) => c.codigo === codigo)?.nombre ?? codigo
}

function App() {
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [seleccionado, setSeleccionado] = useState(null) // F1: vuelo elegido
  const [reservas, setReservas] = useState([]) // F1: por ahora solo en memoria (F2 las muestra y guarda)

  const ciudadesDestino = CIUDADES.filter((c) => c.codigo !== origen)
  const vuelosEncontrados =
    origen !== '' && destino !== ''
      ? VUELOS.filter((v) => v.origen === origen && v.destino === destino)
      : []

  const manejarOrigen = (codigo) => {
    setOrigen(codigo)
    if (codigo === destino) setDestino('')
  }

  const intercambiar = () => {
    setOrigen(destino)
    setDestino(origen)
  }

  // F1: la reserva llega terminada desde FormularioReserva
  const agregarReserva = (nueva) => {
    setReservas([...reservas, nueva])
    setSeleccionado(null) // cerramos el formulario después de reservar
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
          onDestino={setDestino}
        />

        <button type="button" onClick={intercambiar} disabled={!origen || !destino}>
          🔄 Intercambiar
        </button>
      </section>

      {!origen || !destino ? (
        <p className="mensaje">Elige origen y destino para buscar vuelos 🛫</p>
      ) : vuelosEncontrados.length === 0 ? (
        <p className="mensaje">No hay vuelos para esa ruta 🙃</p>
      ) : (
        <ListaVuelos
          vuelos={vuelosEncontrados}
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

      <Footer anio={2026} />
    </main>
  )
}

export default App
