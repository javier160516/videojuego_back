import express from 'express';
import { registrarPregunta, guardarImagen } from '../controllers/gameController.js';
import upload from '../middleware/uploadImage.js';

const router = express.Router();

// router.get('/panel', getProblemas);
router.post('/registrar-ejercicio', registrarPregunta);
router.post('/guardarImagen-ejercicio/:id', upload.array('options'), guardarImagen);

export default router;