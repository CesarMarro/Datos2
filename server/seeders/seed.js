// seed.js

const connectDB = require('../config/database');
const Tag = require('../models/Tags');
const Dare = require('../models/Dares');
// Importa otros modelos si es necesario

const seedData = async () => {
  try {
    await connectDB();

    // Limpia las colecciones existentes
    await Tag.deleteMany();
    await Dare.deleteMany();
    // Borra otras colecciones si es necesario

    // Insertar Tags
    const tagsData = [
      { tagName: 'Físico' },
      { tagName: 'Diversión' },
      { tagName: 'Creativo' },
      { tagName: 'Social' },
      { tagName: 'Desafío' },
      { tagName: 'Intelectual' },
      { tagName: 'Habilidades' },
      { tagName: 'Comunidad' },
      { tagName: 'Determinación' },
      { tagName: 'Aventura' },
      { tagName: 'Hogar' },
      { tagName: 'Salud' },
      { tagName: 'Cultural' },
    ];

    const tags = await Tag.insertMany(tagsData);

    // Mapear tags para fácil acceso
    const tagMap = {};
    tags.forEach((tag) => {
      tagMap[tag.tagName] = tag._id;
    });

    // Insertar Dares y asociar Tags
    const daresData = [
      {
        dare: 'Cocina una comida de una cocina extranjera',
        description:
          'Sube una foto de la comida que cocinaste con la receta visible.',
        points: 30,
        timeLimit: 3,
        tags: [tagMap['Creativo'], tagMap['Social']],
      },
      {
        dare: 'Recrea una escena de una película popular',
        description:
          'Sube una foto de tu recreación de una escena de una película conocida.',
        points: 35,
        timeLimit: 6,
        tags: [tagMap['Creativo'], tagMap['Diversión']],
      },
      {
        dare: 'Crea una obra de arte inspirada en una pintura famosa',
        description:
          'Sube una foto de tu obra de arte inspirada en una pintura famosa.',
        points: 50,
        timeLimit: 7,
        tags: [tagMap['Creativo'], tagMap['Intelectual']],
      },
      {
        dare: 'Organiza un picnic temático',
        description:
          'Sube una foto del montaje del picnic con el tema visible.',
        points: 30,
        timeLimit: 4,
        tags: [tagMap['Social'], tagMap['Diversión']],
      },
      {
        dare: 'Organiza tu estante de libros por género o categoría',
        description: 'Sube una foto de tu estante de libros organizado.',
        points: 20,
        timeLimit: 3,
        tags: [tagMap['Creativo']],
      },
      {
        dare: 'Completa un proyecto de decoración DIY para el hogar',
        description:
          'Sube una foto del proyecto terminado y la foto del antes.',
        points: 45,
        timeLimit: 7,
        tags: [tagMap['Hogar'], tagMap['Creativo']],
      },
      {
        dare: 'Construye un modelo o manualidad usando materiales de casa',
        description:
          'Sube fotos del modelo o manualidad completado con los materiales usados.',
        points: 50,
        timeLimit: 7,
        tags: [tagMap['Creativo'], tagMap['Habilidades']],
      },
      {
        dare: 'Toma una foto creativa en un entorno natural único',
        description:
          'Sube una foto tomada en un entorno natural único como un parque o jardín.',
        points: 30,
        timeLimit: 5,
        tags: [tagMap['Creativo'], tagMap['Aventura']],
      },
      {
        dare: 'Participa en un evento comunitario local',
        description:
          'Sube una foto de ti en el evento comunitario con detalles visibles.',
        points: 40,
        timeLimit: 7,
        tags: [tagMap['Social'], tagMap['Comunidad']],
      },
      {
        dare: 'Muestra una nueva habilidad o pasatiempo',
        description:
          'Sube una foto de algo que hayas creado o una habilidad que hayas dominado.',
        points: 45,
        timeLimit: 10,
        tags: [tagMap['Creativo'], tagMap['Diversión']],
      },
      {
        dare: 'Decora una habitación para un tema específico',
        description:
          'Sube fotos de la habitación decorada para un tema específico como "Tropical" o "Vintage."',
        points: 50,
        timeLimit: 7,
        tags: [tagMap['Creativo'], tagMap['Desafío']],
      },
      {
        dare: 'Crea un collage de fotos con un tema estacional',
        description:
          'Sube una foto de tu collage con un tema que represente una estación específica.',
        points: 40,
        timeLimit: 6,
        tags: [tagMap['Diversión'], tagMap['Creativo']],
      },
      {
        dare: 'Participa en un día de disfraces temático',
        description: 'Sube una foto de ti en un disfraz temático.',
        points: 30,
        timeLimit: 4,
        tags: [tagMap['Creativo'], tagMap['Hogar']],
      },
      {
        dare: 'Prepara y muestra una presentación creativa de desayuno',
        description:
          'Sube una foto de tu presentación de desayuno con una presentación creativa.',
        points: 25,
        timeLimit: 3,
        tags: [tagMap['Creativo'], tagMap['Diversión']],
      },
      {
        dare: 'Toma una foto con un monumento conocido',
        description: 'Sube una foto de ti con un monumento reconocible.',
        points: 20,
        timeLimit: 4,
        tags: [tagMap['Físico'], tagMap['Desafío']],
      },
      {
        dare: 'Organiza una colecta de ropa para caridad con un objetivo específico',
        description:
          'Sube una foto de los artículos recolectados y la organización de la colecta.',
        points: 60,
        timeLimit: 7,
        tags: [tagMap['Hogar'], tagMap['Creativo']],
      },
      {
        dare: 'Crea una exhibición temática de fotos (por ejemplo, "Blanco y Negro")',
        description:
          'Sube una foto de tu exhibición temática con imágenes en blanco y negro.',
        points: 40,
        timeLimit: 6,
        tags: [tagMap['Aventura'], tagMap['Creativo']],
      },
      {
        dare: 'Construye y fotografía una característica única para el jardín',
        description:
          'Sube una foto de una característica del jardín que hayas construido tú mismo.',
        points: 50,
        timeLimit: 7,
        tags: [tagMap['Creativo'], tagMap['Diversión']],
      },
      {
        dare: 'Crea y comparte una receta creativa',
        description: 'Sube una foto de tu receta única y el plato final.',
        points: 30,
        timeLimit: 4,
        tags: [tagMap['Físico'], tagMap['Desafío']],
      },
      {
        dare: 'Diseña y fotografía una decoración única para una festividad',
        description:
          'Sube una foto de una decoración festiva que diseñaste y hiciste.',
        points: 35,
        timeLimit: 5,
        tags: [tagMap['Hogar'], tagMap['Creativo']],
      },
      {
        dare: 'Completa un maratón de 42 kilómetros',
        description:
          'Sube una foto en la línea de meta con el número de corredor visible y el tiempo registrado.',
        points: 90,
        timeLimit: 14,
        tags: [tagMap['Determinación'], tagMap['Físico']],
      },
      {
        dare: 'Construye una pieza de mobiliario compleja (por ejemplo, una estantería a medida)',
        description:
          'Sube fotos del proceso de construcción y del mueble terminado en su lugar.',
        points: 80,
        timeLimit: 21,
        tags: [tagMap['Hogar'], tagMap['Creativo']],
      },
      {
        dare: 'Realiza una inmersión en aguas profundas (más de 30 metros) con equipo completo',
        description:
          'Sube una foto de la inmersión con el equipo visible y la profundidad registrada.',
        points: 90,
        timeLimit: 30,
        tags: [tagMap['Aventura'], tagMap['Desafío']],
      },
      {
        dare: 'Completa un curso de certificación avanzada en una habilidad técnica (por ejemplo, programación, diseño gráfico)',
        description:
          'Sube una foto del certificado de finalización del curso con prueba de la formación.',
        points: 85,
        timeLimit: 30,
        tags: [tagMap['Intelectual'], tagMap['Habilidades']],
      },
      {
        dare: 'Organiza y participa en una campaña de recaudación de fondos para una causa específica (más de $2000 recaudados)',
        description:
          'Sube fotos del evento de recaudación de fondos y un informe de la cantidad total recaudada.',
        points: 90,
        timeLimit: 45,
        tags: [tagMap['Comunidad'], tagMap['Desafío']],
      },
    ];

    const insertedDares = await Dare.insertMany(daresData);

    // Actualizar los tags con los dares asociados
    for (const dare of insertedDares) {
      for (const tagId of dare.tags) {
        await Tag.findByIdAndUpdate(tagId, { $push: { dares: dare._id } });
      }
    }

    console.log('Datos insertados correctamente');
    process.exit();
  } catch (err) {
    console.error('Error insertando datos:', err);
    process.exit(1);
  }
};

seedData();
