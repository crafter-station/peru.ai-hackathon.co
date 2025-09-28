export const RANDOM_PROMPTS = [
  // Tema Comida Peruana
  "Una alpaca comiendo lomo saltado con palitos en un restaurante de Lima",
  "Una alpaca chef preparando ceviche fresco con limón en la costa del Pacífico",
  "Una alpaca feliz comiendo chaufa con una gran sonrisa en el Chinatown de Lima",
  "Una alpaca elegante disfrutando anticuchos en un mercado callejero",
  "Una alpaca sofisticada saboreando causa limeña con palta y camarones",
  "Una familia de alpacas compartiendo papa rellena en una cocina acogedora",
  "Una alpaca curiosa probando ají de gallina en un restaurante tradicional",
  
  // Tema Programación/Tech  
  "Una alpaca nerd programando en Python con lentes y múltiples monitores",
  "Una alpaca hacker con capucha, escribiendo código en un teclado mecánico",
  "Una alpaca tech depurando código mientras toma café a las 3 AM",
  "Una alpaca arquitecto de software dibujando diagramas en una pizarra",
  "Una alpaca fundadora de startup presentando su proyecto de IA",
  "Una alpaca DevOps gestionando servidores en un centro de datos",
  "Una alpaca full-stack desarrollando sitios web responsivos",
  "Una alpaca científico de datos analizando gráficos y modelos de ML",
  "Una alpaca de ciberseguridad protegiendo redes con escudos",
  "Una alpaca desarrolladora de videojuegos creando pixel art",
];

export const getRandomPrompt = (): string => {
  const randomIndex = Math.floor(Math.random() * RANDOM_PROMPTS.length);
  return RANDOM_PROMPTS[randomIndex];
};
