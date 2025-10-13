import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Datos simulados en backend
const validToken = '123456';
const correctAnswers = {
  answer1: '1967',
  answer2: 'analista de ti',
  answer3: '9999999999',
};

// ✅ Validar token MFA
app.post('/api/auth/validate-token', (req, res) => {
  const { token } = req.body;
  if (token === validToken) {
    return res.json({ success: true });
  }
  return res.json({ success: false });
});

// ✅ Validar preguntas
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
