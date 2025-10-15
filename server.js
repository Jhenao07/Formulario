import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// const allQuestions = [
//   { id: 1, text: 'En que año se fundo Nuvant' },
//   { id: 2, text: '¿Cuál es la misión principal de la empresa (en dos palabras)?' },
//   { id: 3, text: '¿Cuál es el nombre del actual gerente o director general?' },
//   { id: 4, text: '¿En qué ciudad se encuentra ubicada la sede principal?' },
//   { id: 5, text: '¿Cuántas sucursales o sedes tiene actualmente la empresa (En antioquia)?' },
//   { id: 6, text: '¿Cuál es el color principal del logo institucional?' },
//   { id: 7, text: '¿Cuál es el NIT o número de identificación de la empresa?' },
//   { id: 8, text: '¿Qué número telefónico usa la empresa para atención al cliente?' },
//   { id: 9, text: '¿Qué empresa o entidad presta el servicio de vigilancia o seguridad?' },
//   { id: 10, text: '¿Qué documento se requiere para ingresar como visitante a la empresa?' },
//   { id: 11, text: '¿Qué empresa o entidad presta el servicio de orden y aseon?' },
//   { id: 12, text: 'Cuántos días habiles de vacaciones tiene derecho un empleado al año' },
// ]

// app.get('/api/auth/questions', (req, res) => {
//   const shuffled = allQuestions.sort(() => 0.5 - Math.random());
//   const selected = shuffled.slice(0, 3);
//   res.json(selected);
// });

const correctAnswers = {
  answer1: '1967',
  answer2: 'analista de ti',
  answer3: '9999999999',
};


// app.post('/api/auth/validate-questions', (req, res) => {
//   const { answers } = req.body;
//   const correct = {
//     1: '1967',
//     2: 'generar bienestar',
//     3: 'mauricio',
//     4: 'sabaneta',
//     5: '4',
//     6: 'naranja',
//     7: '890906119',
//     8: '3588686',
//     9: 'atlas',
//     10: 'cedula',
//     11: 'sodexo',
//     12: '15',
//   };

  app.post('/api/auth/validate-token', (req, res) => {
  const { token } = req.body;
  res.json({ success: token === '123456' });
});

// let valid = true;
//   Object.entries(answers).forEach(([id, answer]) => {
//     if (!answer || answer.toLowerCase() !== correct[id]) {
//       valid = false;
//     }
//   });
//   res.json({ success: valid });
// });

// app.listen(3000, () => console.log('✅ Backend en http://localhost:3000'));

app.post('/api/auth/validate-questions', (req, res) => {
  const { answers } = req.body;

  if (
    answers.answer1?.toLowerCase() === correctAnswers.answer1 &&
    answers.answer2?.toLowerCase() === correctAnswers.answer2 &&
    answers.answer3?.toLowerCase() === correctAnswers.answer3
  ) {
    return res.json({ success: true });
  }

  return res.json({ success: false });
});

app.listen(3000, () => console.log('✅ Backend corriendo en http://localhost:3000'));
