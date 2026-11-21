// Antes vivía dentro de TarjetaVuelo.jsx. La saqué aquí porque ahora también
// la usan FormularioReserva y MisReservas (así no se repite el código).
export function formatoPrecio(precio) {
  return `$ ${precio.toLocaleString('es-CO')}`
}
