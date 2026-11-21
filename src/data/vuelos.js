export const CIUDADES = [
  { codigo: 'CTG', nombre: 'Cartagena' },
  { codigo: 'BOG', nombre: 'Bogotá' },
  { codigo: 'MDE', nombre: 'Medellín' },
  { codigo: 'BAQ', nombre: 'Barranquilla' },
  { codigo: 'SMR', nombre: 'Santa Marta' },
  { codigo: 'CLO', nombre: 'Cali' },
]

export const VUELOS = [
  { id: 'v1', origen: 'CTG', destino: 'BOG', avion: 'Airbus A320', hora: '08:30', precio: 380000 },
  { id: 'v2', origen: 'BOG', destino: 'CTG', avion: 'Boeing 737-800', hora: '10:40', precio: 380000 },
  { id: 'v3', origen: 'CTG', destino: 'MDE', avion: 'Airbus A320', hora: '07:15', precio: 320000 },
  { id: 'v4', origen: 'MDE', destino: 'BOG', avion: 'ATR 72', hora: '09:05', precio: 260000 },
  { id: 'v5', origen: 'BOG', destino: 'MDE', avion: 'Boeing 737-800', hora: '13:10', precio: 340000 },
  { id: 'v6', origen: 'MDE', destino: 'CTG', avion: 'Airbus A320', hora: '12:30', precio: 320000 },
  // F3: dos vuelos más en Bogotá → Cartagena para que "Ordenar por" se pueda ver
  // (en el catálogo original cada ruta tenía un solo vuelo). Las demás rutas no cambian.
  { id: 'v7', origen: 'BOG', destino: 'CTG', avion: 'Airbus A320', hora: '19:30', precio: 450000 },
  { id: 'v8', origen: 'BOG', destino: 'CTG', avion: 'Embraer 190', hora: '07:00', precio: 400000 },
  { id: 'v9', origen: 'BAQ', destino: 'BOG', avion: 'Airbus A320', hora: '06:45', precio: 310000 },
  { id: 'v10', origen: 'BOG', destino: 'BAQ', avion: 'Airbus A320', hora: '16:20', precio: 310000 },
  { id: 'v11', origen: 'CLO', destino: 'BOG', avion: 'ATR 72', hora: '11:10', precio: 230000 },
  { id: 'v12', origen: 'BOG', destino: 'CLO', avion: 'Boeing 737-800', hora: '14:35', precio: 250000 },
  { id: 'v13', origen: 'SMR', destino: 'BOG', avion: 'Embraer 190', hora: '09:50', precio: 330000 },
]

// F1: clases de vuelo. El factor multiplica el precio del vuelo.
export const CLASES = [
  { id: 'economica', nombre: 'Económica', factor: 1 },
  { id: 'ejecutiva', nombre: 'Ejecutiva', factor: 1.6 },
  { id: 'primera', nombre: 'Primera', factor: 2.4 },
]
