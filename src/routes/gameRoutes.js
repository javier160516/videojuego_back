import express from 'express';
import { getProblemas, guardarImagen, registrarPregunta } from '../controllers/GameController.js';
import upload from '../middleware/uploadImage.js';

const router = express.Router();

router.get('/panel', getProblemas);
router.post('/registrar-ejercicio', registrarPregunta);
router.post('/guardarImagen-ejercicio/:id', upload.array('options'), guardarImagen);

export default router;