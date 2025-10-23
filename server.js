import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const validToken = '123456';

const questions = [
{ id: 1, text: 'En que año se fundo Nuvant', answer: "1957" },
  { id: 2, text: '¿Cuál es la misión principal de la empresa (en dos palabras)?', answer: "generar bienestar" },
  { id: 3, text: '¿Cuál es el nombre del actual gerente o director general?', answer: "mauricio" },
  { id: 4, text: '¿En qué ciudad se encuentra ubicada la sede principal?', answer: "sabaneta" },
  { id: 5, text: '¿Cuántas sucursales o sedes tiene actualmente la empresa (En antioquia)?', answer: "4" },
  { id: 6, text: '¿Cuál es el color principal del logo institucional?', answer: "naranja"},
  { id: 7, text: '¿Cuál es el NIT o número de identificación de la empresa?', answer: "890906119" },
  { id: 8, text: '¿Qué número telefónico usa la empresa para atención al cliente?', answer: "3788686" },
  { id: 9, text: '¿Qué empresa o entidad presta el servicio de vigilancia o seguridad?', answer: "atlas" },
  { id: 10, text: '¿Qué documento se requiere para ingresar como visitante a la empresa?', answer: "cedula" },
  { id: 11, text: '¿Qué empresa o entidad presta el servicio de orden y aseo?', answer: "sodexo" },
  { id: 12, text: 'Cuántos días habiles de vacaciones tiene derecho un empleado al año', answer: "15" },
];

// 🔹 Validar token
app.post('/api/auth/validate-token', (req, res) => {
  const { email, password, token } = req.body;
  res.json({ success: token === validToken });

   if (email === 'tecnologia@nuvantglobal.com' && password === 'Prueba111' && token === '123456') {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// 🔹 Obtener preguntas
app.get('/api/auth/questions', (req, res) => {
  res.json(questions);
});

// 🔹 Validar respuestas
app.post('/api/auth/validate-questions', (req, res) => {
  const { answers } = req.body;
  let allCorrect = true;

  for (const id in answers) {
    const question = questions.find(q => q.id === Number(id)); 
    if (!question || !question.answer) {
      allCorrect = false;
      break;
    }

    if (question.answer.trim().toLowerCase() !== answers[id].trim().toLowerCase()) {
      allCorrect = false;
      break;
    }
  }

  res.json({ success: allCorrect });
});

app.listen(3000, () => console.log('✅ Backend corriendo en http://localhost:3000'));
