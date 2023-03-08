import express from 'express';
import upload from '../middleware/uploadImage.js';
import { registrarPregunta, guardarImagen, getProblemas } from '../controllers/gameController.js';

const router = express.Router();

router.get('/panel', getProblemas);
router.post('/registrar-ejercicio', registrarPregunta);
router.post('/guardarImagen-ejercicio/:id', upload.array('options'), guardarImagen);

export default router;