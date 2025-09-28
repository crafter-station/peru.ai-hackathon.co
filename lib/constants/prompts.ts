export const RANDOM_PROMPTS = [
  // 🥘 Comida Peruana (extended & more creative)
  "Una alpaca foodie haciendo fila en una feria gastronómica de Mistura con un plato de ají de gallina en la mano",
  "Una alpaca influencer grabando un video de TikTok sobre cómo preparar lomo saltado paso a paso",
  "Una alpaca barista sirviendo café peruano en un café tech de Miraflores con código en la pizarra",
  "Una alpaca viajera comiendo picarones frente a Machu Picchu con una laptop abierta",
  "Una alpaca gourmet cocinando un menú fusión Perú-Japón con makis de quinua y ceviche nikkei",
  "Una alpaca food truck vendiendo empanadas peruanas en un evento de startups",
  
  // 💻 Programación & Tech (más ingeniosos)
  "Una alpaca desarrolladora liderando un hackathon en Cusco con pantallas llenas de código",
  "Una alpaca IA entrenando modelos de machine learning con datos de alpacas en los Andes",
  "Una alpaca junior developer aprendiendo Git mientras toma mate de coca",
  "Una alpaca presentando un pitch de su app fintech en un demo day en Lima",
  "Una alpaca programando una dApp de alpacas NFT en la blockchain mientras observa llamas por la ventana",
  "Una alpaca diseñadora UX creando wireframes en Figma con estilo minimalista andino",
  "Una alpaca ingeniera automatizando pipelines de datos en la nube sobre un fondo de montañas peruanas",
  "Una alpaca CTO con gafas de realidad aumentada revisando logs en tiempo real",
  "Una alpaca backend implementando APIs REST en Node.js desde una coworking en Barranco",
  "Una alpaca experta en ciberseguridad rastreando amenazas desde un SOC futurista en Lima",

  // 🦙 Cultura & Tecnología combinadas
  "Una alpaca futurista construyendo un robot alpaca con inteligencia artificial en un laboratorio de Arequipa",
  "Una alpaca presentando en una conferencia de tecnología sobre cómo los Andes inspiraron la computación cuántica",
  "Una alpaca viajando en un dron autónomo sobre el Valle Sagrado mientras depura código en su tablet",
  "Una alpaca exploradora usando realidad virtual para visitar ruinas incas mientras programa un videojuego educativo",
  "Una alpaca nómada digital trabajando en remoto desde una choza andina con Starlink y múltiples monitores",
];

export const getRandomPrompt = (): string => {
  const randomIndex = Math.floor(Math.random() * RANDOM_PROMPTS.length);
  return RANDOM_PROMPTS[randomIndex];
};
