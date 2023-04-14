import express from 'express';
import { deleteQuestion, getProblemas, registrarPregunta } from '../controllers/GameController.js';
// import upload from '../middleware/uploadImage.js';

const router = express.Router();

router.get('/panel', getProblemas);
router.post('/registrar-ejercicio', registrarPregunta);
// router.post('/guardarImagen-ejercicio/:id', upload.array('options'), guardarImagen);
router.delete('/eliminar-ejercicio/:id', deleteQuestion);

export default router;