export const wasteTypes = [
  'Plástico',
  'Papel',
  'Vidro',
  'Metal',
  'Eletrônicos',
  'Óleo de cozinha'
]

export const collectionPoints = [
  {
    id: 1,
    name: 'Ecoponto Residuum Centro Manaus',
    address: 'Av. Eduardo Ribeiro - Centro, Manaus - AM',
    latitude: -3.1326,
    longitude: -60.0232,
    status: 'ativo',
    wasteTypes: ['Plástico', 'Papel', 'Metal'],
    distanceKm: 1.4,
    openingHours: 'Segunda a sábado, 08h às 18h'
  },
  {
    id: 2,
    name: 'Ponto Verde Adrianópolis',
    address: 'Av. Mário Ypiranga - Adrianópolis, Manaus - AM',
    latitude: -3.1048,
    longitude: -60.0114,
    status: 'ativo',
    wasteTypes: ['Vidro', 'Metal', 'Óleo de cozinha'],
    distanceKm: 2.8,
    openingHours: 'Segunda a sexta, 09h às 17h'
  },
  {
    id: 3,
    name: 'Coleta Seletiva Parque 10',
    address: 'Av. Tancredo Neves - Parque 10 de Novembro, Manaus - AM',
    latitude: -3.0737,
    longitude: -60.0124,
    status: 'ativo',
    wasteTypes: ['Papel', 'Plástico', 'Eletrônicos'],
    distanceKm: 4.2,
    openingHours: 'Todos os dias, 10h às 19h'
  },
 {
  id: 4,
  name: 'Ecoponto Ponta Negra',
  address: 'Av. Coronel Teixeira - Ponta Negra, Manaus - AM',
  latitude: -3.0619,
  longitude: -60.0928,
  status: 'ativo',
  wasteTypes: ['Vidro', 'Papel', 'Plástico'],
  distanceKm: 8.7,
  openingHours: 'Segunda a sábado, 08h às 16h'
},
  {
    id: 5,
    name: 'Ponto Temporariamente Inativo',
    address: 'Av. Torquato Tapajós - Manaus - AM',
    latitude: -3.0382,
    longitude: -60.0344,
    status: 'inativo',
    wasteTypes: ['Eletrônicos', 'Metal'],
    distanceKm: 6.5,
    openingHours: 'Indisponível no momento'
  }
]