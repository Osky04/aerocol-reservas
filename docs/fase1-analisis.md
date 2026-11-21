# Fase 1 — Análisis de AeroCol (antes de programar)

## 1️⃣ Respuestas

### 1. ¿Dónde viven hoy los estados `origen` y `destino`? ¿Por qué ahí y no en `SelectCiudad`?

Viven en **`App`**: `const [origen, setOrigen] = useState('')` y `const [destino, setDestino] = useState('')`.

Hay varias partes que necesitan esos datos al mismo tiempo:

- `SelectorRuta` → `SelectCiudad` los necesitan para **mostrar** qué ciudad está elegida (`value`).
- `App` los usa para **calcular** `ciudadesDestino` (el destino no lista el origen) y `vuelosEncontrados` (filtro del catálogo).
- `ListaVuelos` recibe los nombres de las ciudades para su título.
- El botón 🔄 Intercambiar y `manejarOrigen` necesitan leer **ambos** valores a la vez.

Si cada `SelectCiudad` guardara su propio valor, `App` no podría enterarse del cambio, porque en React los datos solo bajan de padre a hijo. Por eso el estado sube al **ancestro común** (*lifting state up*). Además, `SelectCiudad` se usa dos veces: si tuviera estado, cada copia tendría el suyo y el origen no podría limpiar el destino. `SelectCiudad` es un componente "tonto": recibe `value` y avisa con `onCambio`.

### 2. `ListaVuelos` recibe `vuelos`, `nombreOrigen`, `nombreDestino`… ¿qué más necesitará para que una tarjeta sea seleccionable?

Dos props nuevas, que `ListaVuelos` reenvía a cada `TarjetaVuelo`:

| Prop | Tipo | Para qué |
|------|------|----------|
| `onSeleccionar` | función | La tarjeta la llama con su vuelo al recibir un clic → **la función baja, el dato sube**. |
| `seleccionadoId` | string | Para saber qué tarjeta pintar **resaltada**: `seleccionada={v.id === seleccionadoId}`. |

### 3. ¿Qué datos necesita guardar una reserva?

```js
{
  id: 'c1f9…',             // crypto.randomUUID() → único; sirve de key y para eliminar
  nombre: 'Ana García',
  vueloId: 'v4',
  ruta: 'Medellín → Bogotá',
  avion: 'ATR 72',
  hora: '09:05',
  pasajeros: 2,
  clase: 'Ejecutiva',
  total: 832000,            // se guarda: es la "foto" del precio en el momento de reservar
  fecha: '21/11/2026'
}
```

Guardo también `ruta`, `avion` y `hora` para que "Mis reservas" se pueda mostrar sin volver a buscar el vuelo en `VUELOS`.

### 4. ¿Dónde debe vivir el estado de las reservas y por qué?

En **`App`**, por dos razones:

1. Lo **agrega** `FormularioReserva` y lo **muestra y elimina** `MisReservas`. Son hermanos, así que el ancestro común es `App`.
2. La **persistencia** (`localStorage`) queda en un solo lugar: cada vez que `App` cambia las reservas, también las guarda.

## 2️⃣ Árbol de componentes futuro (con props)

```
App
│  estado:   origen, destino, orden🔴, seleccionado🟢🔴, reservas🟡
│  derivado: ciudadesDestino, vuelosEncontrados, vuelosOrdenados🔴
│
├── <Header aerolinea eslogan />
│
├── <section className="selector">
│     ├── <SelectorRuta origen destino ciudades ciudadesDestino onOrigen onDestino>
│     │     ├── <SelectCiudad label="Origen"  value ciudades onCambio>
│     │     └── <SelectCiudad label="Destino" value ciudades onCambio>
│     ├── <button onClick={intercambiar}>🔄 Intercambiar
│     └── <SelectorOrden orden onOrden>                                    🔴 nuevo
│
├── <ListaVuelos vuelos(ordenados) nombreOrigen nombreDestino
│                seleccionadoId onSeleccionar>                             🟢🔴 props nuevas
│     └── <TarjetaVuelo vuelo seleccionada onSeleccionar> ×N               🟢🔴 props nuevas
│
├── {seleccionado && <FormularioReserva key vuelo nombreOrigen
│                                       nombreDestino onReservar>}         🟢 nuevo
│        estado local: nombre, pasajeros, clase · derivado: total
│
├── <MisReservas reservas onEliminar>                                      🟡 nuevo
│
└── <Footer anio />
```

**Lo que no cambia:** `Header`, `Footer`, `SelectorRuta` y `SelectCiudad` se quedan exactamente como en la semana 14.

**Utilidades (funciones, no componentes):**

- `utils/formato.js` → `formatoPrecio` (sale de `TarjetaVuelo` porque ahora la usan 3 componentes)
- `utils/reservasStorage.js` → `cargarReservas`, `guardarReservas` 🟡
- `utils/ordenarVuelos.js` → `ordenarVuelos` 🔴
