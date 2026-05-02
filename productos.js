// ============================================================
// PRODUCTOS DE LUCA SPORT
//
// Para agregar un producto nuevo:
//   1. Copia el bloque de un producto existente (desde la { hasta la },)
//   2. Pegalo al final de la lista, antes del ];
//   3. Cambia los valores
//   4. Guarda el archivo
//
// No toques nada fuera de este archivo para agregar productos.
// ============================================================

const PRODUCTOS = [
  {
    // Numero unico. Siempre usa el siguiente en la secuencia (1, 2, 3...)
    id: 1,

    // Marca en minusculas. Opciones: "reebook" | "olympikus" | "topper" | "atomik"
    marca: "reebook",

    // Nombre del modelo tal como aparece en la tarjeta
    nombre: "Energen Run 3",

    // Descripcion corta que aparece debajo del nombre
    descripcion: "Modelo comodo para uso diario, caminatas activas y entrenamiento suave.",

    // Precio en numeros enteros, sin puntos ni signo $ (ej: 80000, no $80.000)
    precio: 80000,

    // Deporte en minusculas. Opciones: "running" | "futbol" | "tenis" | "training" | "accesorios"
    deporte: "running",

    // Etiqueta chica que aparece junto a la marca (caracteristica del producto)
    tag: "Amortiguacion diaria",

    // Texto del badge oscuro que aparece sobre la imagen (ej: "Running", "Ultimas unidades")
    badge: "Running",

    // Rutas de las imagenes del producto. Al menos 1. Deben estar en la carpeta img/
    imagenes: [
      "img/producto1,1.jpeg",
      "img/producto1,2.jpeg",
      "img/producto1,3.jpeg",
    ],

    // Talles disponibles. Pueden ser enteros (40) o con medio numero (40.5)
    talles: [38.5, 39.5, 40, 41, 41.5, 42, 43, 45, 45.5],

    // Nota adicional junto a "Talles disponibles". Dejar "" si no se necesita.
    // Ejemplo: "(1 unidad c/u)"
    tallesNota: "",
  },

  {
    id: 2,
    marca: "reebook",
    nombre: "Energen Lite JP",
    descripcion: "Una opcion agil y versatil para quienes buscan comodidad sin exceso de peso.",
    precio: 65000,
    deporte: "running",
    tag: "Liviana",
    badge: "Running",
    imagenes: [
      "img/producto2,1.jpeg",
      "img/producto2,2.jpeg",
    ],
    talles: [35, 36, 37, 39, 40, 41, 42, 43, 44],
    tallesNota: "",
  },

  {
    id: 3,
    marca: "olympikus",
    nombre: "Plaza Running",
    descripcion: "Diseno noble y estable para quienes priorizan comodidad y apoyo parejo.",
    precio: 80000,
    deporte: "running",
    tag: "Uso diario",
    badge: "Respuesta suave",
    imagenes: [
      "img/producto3,1.jpeg",
      "img/producto3,2.jpeg",
    ],
    talles: [36, 37, 38, 39, 40, 41],
    tallesNota: "",
  },

  {
    id: 4,
    marca: "topper",
    nombre: "Wind 5 Running",
    descripcion: "Una silueta deportiva, firme y rendidora para ritmo cotidiano.",
    precio: 79000,
    deporte: "running",
    tag: "Rendimiento urbano",
    badge: "Precio fuerte",
    imagenes: [
      "img/producto4,1.jpeg",
      "img/producto4,2.jpeg",
      "img/producto4,3.jpeg",
    ],
    talles: [38, 39, 40, 41, 42, 43, 44, 45],
    tallesNota: "",
  },

  {
    id: 5,
    marca: "topper",
    nombre: "Suva",
    descripcion: "Excelente opcion para arrancar con un modelo funcional y rendidor.",
    precio: 60000,
    deporte: "running",
    tag: "Precio accesible",
    badge: "Entrada ideal",
    imagenes: [
      "img/producto5,1.jpeg",
    ],
    talles: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
    tallesNota: "",
  },

  {
    id: 6,
    marca: "atomik",
    nombre: "Fairfaxx",
    descripcion: "Modelo liviano con pocas unidades disponibles en cada talle.",
    precio: 65000,
    deporte: "running",
    tag: "Stock limitado",
    badge: "Ultimas unidades",
    imagenes: [
      "img/producto6,1.jpeg",
      "img/producto6,2.jpeg",
      "img/producto6,3.jpeg",
      "img/producto6,4.jpeg",
    ],
    talles: [35, 36, 39, 41, 42, 43, 44, 45],
    tallesNota: "(1 unidad c/u)",
  },
];
