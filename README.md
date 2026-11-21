# ✈️ AeroCol — Reserva tu vuelo

App de práctica del módulo **Desarrollo Front-End** (React + Vite). Parte del Tutorial 2 de la semana 14 (varios componentes).

---

## Proyecto Final

### 1. Qué hace la app

AeroCol permite **buscar un vuelo** entre dos ciudades de Colombia, **ordenar** los resultados por precio, hora o avión, **elegir uno** y **reservarlo** indicando nombre, número de pasajeros y clase, con el total calculado al instante. Las reservas se guardan en `localStorage`, así que **siguen ahí aunque se recargue la página**, y se pueden eliminar.

**Flujo:** buscar vuelo → elegirlo → reservarlo → ver mis reservas.

### Árbol de componentes

```
App  (estado: origen, destino, orden, seleccionado, reservas)
├── Header
├── SelectorRuta ─── SelectCiudad (origen) · SelectCiudad (destino)
├── 🔄 Intercambiar (botón)
├── SelectorOrden                          🔴 F3
├── ListaVuelos ──── TarjetaVuelo ×N       🟢 seleccionable · 🔴 resaltada
├── FormularioReserva (solo si hay vuelo)  🟢 F1  (estado local: nombre, pasajeros, clase)
├── MisReservas                            🟡 F2
└── Footer
```

El análisis completo y el árbol con todas las props están en [`docs/fase1-analisis.md`](docs/fase1-analisis.md).

### Qué se agregó sobre la base de la semana 14

| Archivo | Cambio |
|---------|--------|
| `components/FormularioReserva.jsx` | 🆕 F1 |
| `components/MisReservas.jsx` | 🆕 F2 |
| `components/SelectorOrden.jsx` | 🆕 F3 |
| `utils/formato.js` | 🆕 `formatoPrecio` (antes estaba dentro de `TarjetaVuelo`) |
| `utils/reservasStorage.js` | 🆕 F2: cargar/guardar en `localStorage` |
| `utils/ordenarVuelos.js` | 🆕 F3: ordenar una copia |
| `App.jsx` | estados `orden`, `seleccionado`, `reservas` + manejadores |
| `ListaVuelos.jsx`, `TarjetaVuelo.jsx` | props nuevas `seleccionadoId` / `seleccionada` y `onSeleccionar` |
| `data/vuelos.js` | `CLASES` + vuelos `v7` y `v8` (ver decisiones) |
| `App.css` | estilos nuevos al final del archivo |
| `Header`, `Footer`, `SelectorRuta`, `SelectCiudad` | sin cambios |

---

### 2. Respuestas ✍️

#### 🟢 F1 — Formulario de reserva

**1. ¿Dónde viven los estados del formulario y por qué?**
`nombre`, `pasajeros` y `clase` viven **dentro de `FormularioReserva`**, porque nadie más los necesita mientras el usuario escribe. `App` solo necesita el **resultado final** (la reserva), que recibe cuando el formulario llama `onReservar(reserva)`. Mantener el estado lo más cerca de donde se usa evita props innecesarias. Además, a `FormularioReserva` le paso `key={seleccionado.id}`: cuando el usuario elige otro vuelo, React crea un formulario nuevo y los campos se reinician solos.

**2. ¿Por qué el total no es un `useState` más?**
Porque se puede **calcular** con datos que ya existen: `total = precio × pasajeros × factor`. Si fuera estado, tendría que acordarme de actualizarlo cada vez que cambian los pasajeros **o** la clase; si se me olvida en un lugar, queda desincronizado. Calculado en el render, siempre es correcto. Ejemplo: `260.000 × 2 × 1.6 = $ 832.000`. El factor se busca con `CLASES.find((c) => c.id === clase)`.

> Nota: en la **reserva ya hecha** sí guardo `total`, porque ahí es un dato histórico (lo que se pagó en ese momento), no un valor que deba recalcularse.

**3. ¿Qué prop le agregaste a `TarjetaVuelo` y para qué?**
- `onSeleccionar` (función): la tarjeta la llama con su vuelo al hacer clic, y así le **avisa** a `App` cuál fue elegida. La tarjeta no puede cambiar el estado de `App` directamente: *los datos suben, las funciones bajan*.
- `seleccionada` (booleano): para pintarse resaltada (F3).

#### 🟡 F2 — Mis reservas

**1. ¿Por qué no mutar el array directamente con `push`?**
React decide si vuelve a dibujar comparando la **referencia** del estado anterior con la nueva. `push` modifica el mismo array, así que la referencia no cambia y React puede no enterarse: la lista no se actualiza. Por eso siempre entrego un **array nuevo**: `[...reservas, nueva]` para agregar y `reservas.filter((r) => r.id !== id)` para eliminar.

**2. ¿Qué le pasa a tus reservas si recargas la página sin `localStorage`? 🙃**
Se pierden. El estado de React vive en la memoria de la pestaña; al recargar, la app arranca desde cero y `useState` vuelve a su valor inicial (`[]`). Con `localStorage` las reservas se guardan como texto en el navegador y se leen al iniciar con `useState(cargarReservas)`. Es una función inicializadora: React la ejecuta **solo una vez**, al montar.

Como `localStorage` solo guarda **strings**, uso `JSON.stringify` al guardar y `JSON.parse` al leer. Si no hay nada guardado devuelvo `[]`, y si el texto está dañado un `try/catch` también devuelve `[]` para que la app no se rompa.

**3. ¿Dónde pones la lógica de guardar y por qué?**
En `App`, en una sola función `actualizarReservas(nuevas)` que hace `setReservas(nuevas)` **y** `guardarReservas(nuevas)`. Tanto agregar como eliminar pasan por ella, así que es imposible que el estado y `localStorage` queden distintos. Guardo **solo cuando las reservas cambian** (al reservar o eliminar), no en cada render. La lectura y escritura en sí están separadas en `utils/reservasStorage.js` para que `App` no se llene de detalles de `JSON`.

#### 🔴 F3 — Catálogo inteligente

**1. ¿Por qué hay que ordenar una copia del array y no el original?**
Porque `.sort()` **modifica** el array sobre el que se llama. Si ordenara `VUELOS` o `vuelosEncontrados` directamente, cambiaría los datos originales. Con `[...vuelos].sort(...)` el spread crea una copia y ordeno esa. Para números uso `a.precio - b.precio` (al revés para mayor a menor) y para texto `localeCompare`, que respeta el orden alfabético y las tildes.

**2. ¿Qué pasó con el orden al cambiar de ruta? ¿Se mantiene?**
Sí, se mantiene. El estado `orden` vive en `App` y no depende de la ruta. La lista ordenada es **estado derivado**: en cada render se calcula `ordenarVuelos(vuelosEncontrados, orden)`. Al cambiar de ruta cambia `vuelosEncontrados`, pero el criterio sigue igual. Lo que sí limpio al cambiar de ruta (en `manejarOrigen`, `manejarDestino` e `intercambiar`) es `seleccionado`, para que el formulario no muestre un vuelo que ya no está en la lista.

**3. ¿Cómo le avisa la tarjeta a `App` que fue seleccionada?**
`App` tiene `const [seleccionado, setSeleccionado] = useState(null)` y pasa `setSeleccionado` a `ListaVuelos` como `onSeleccionar`, que a su vez se lo pasa a cada `TarjetaVuelo`. Al hacer clic, la tarjeta ejecuta `onSeleccionar(vuelo)`, `App` guarda ese vuelo y se vuelve a dibujar. La tarjeta con ese `id` recibe `seleccionada={true}` (clase CSS `tarjeta seleccionada`) y aparece el formulario con el detalle.

---

### 3. Cómo correr la app

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
```

Verificación:

```bash
npm run lint     # sin errores
npm run build    # sin errores
```

### ✅ Checklist de verificación (Fase 3)

- [x] Buscar ruta sigue funcionando (Medellín → Bogotá muestra 1 vuelo)
- [x] El destino nunca lista el origen elegido
- [x] 🔄 Intercambiar y el aviso "No hay vuelos para esa ruta" siguen funcionando
- [x] F1: cambiar pasajeros o clase actualiza el total al instante (`260.000 × 2 × 1.6 = 832.000`)
- [x] F1: sin nombre, el botón Reservar está deshabilitado
- [x] F2: al reservar, aparece en Mis reservas con su fecha
- [x] F2: al recargar la página, las reservas siguen
- [x] F2: 🗑️ elimina la reserva correcta; sin reservas se ve el estado vacío
- [x] F3: cada opción de "Ordenar por" reordena la lista (probar en Bogotá → Cartagena, 3 vuelos)
- [x] Cambiar de ruta no rompe el orden y limpia la selección
- [x] `npm run lint` y `npm run build` sin errores

---

### 4. Decisión de diseño más importante

**Mantener el estado del formulario dentro de `FormularioReserva` (y no en `App`) y reiniciarlo con `key`.**

La alternativa era subir `nombre`, `pasajeros` y `clase` a `App`. La descarté porque `App` ya maneja cinco estados y ningún otro componente necesita esos datos mientras se escriben; subirlos habría significado más props y más código en `App` sin ningún beneficio. El costo de dejarlos locales era un problema: al cambiar de vuelo, el formulario conservaba los valores del vuelo anterior. Lo resolví pasando `key={seleccionado.id}`: cuando cambia la `key`, React descarta el componente y crea uno nuevo con el estado inicial. Así el formulario es **independiente** (solo entrega la reserva terminada con `onReservar`) y siempre empieza limpio.

**Otra decisión: agregar dos vuelos al catálogo.** En los datos de la semana 14 cada ruta tiene un solo vuelo, así que "Ordenar por" no mostraría ningún cambio. Agregué `v7` y `v8` en Bogotá → Cartagena (que ya tenía `v2`), con precios y horas pensados para que cada una de las 4 opciones dé un orden distinto. No toqué los 6 vuelos originales: Medellín → Bogotá sigue mostrando 1 vuelo.
