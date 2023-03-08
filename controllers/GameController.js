import { validationResult, check } from "express-validator"
import { Problema, Imagenes, Respuestas } from '../models/index.js';

const getProblemas = async (req, res) => {
    const problemas = await Problema.findAll();
    const imagenes = await Imagenes.findAll();
    const respuestas = await Respuestas.findAll();

    const problemasCompleto = [];
    Object.values(problemas).forEach(problema => {
        Object.values(imagenes).forEach(imagen => {
            Object.values(respuestas).forEach(respuesta => {
                if(problema.id == imagen.id && problema.id == respuesta.id){

                    problemasCompleto.push({
                        id: problema.id,
                        planteamiento: problema.planteamiento,
                        imagenes: {
                            nombre: imagen.nombre,
                            path: imagen.path,
                            mimetype: imagen.mimetype,
                        },
                        respuesta: respuesta.opcion
                    });
                }
            });
        });
    });
 
    return res.status(200).json({
        status: 200,
        data: problemasCompleto
    })
}

const registrarPregunta = async (req, res) => {
    await check('problem').notEmpty().withMessage('El campo es obligatorio').run(req);
    await check('correct').notEmpty().withMessage('El campo es obligatorio').run(req);

    let result = validationResult(req);
    let errors = {};
    result.array().map(resultState => {
        const { param, msg } = resultState;
        if (param == 'problem') {
            errors = { ...errors, problem: msg }
        }
        if (param == 'options') {
            errors = { ...errors, options: msg }
        }
        if (param == 'correct') {
            errors = { ...errors, correct: msg }
        }
    });

    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors: errors
        });
    }

    const { problem, correct: correctAnswer } = req.body

    try {
        const problema = await Problema.create({
            planteamiento: problem
        });

        const { id } = problema;
        const correct = await Respuestas.create({
            opcion: correctAnswer,
            id_problema: id
        });

        return res.status(201).json({
            status: 201,
            problema: id,
            msg: 'Pregunta creada correctamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            msg: 'Ha ocurrido un error'
        });
    }
}

const guardarImagen = async (req, res) => {
    console.log(req.params);
    const arrayPathFiles = [];
    const arrayNameFiles = [];
    const arrayMimetypesFiles = [];

    req.files.forEach(file => {
        const { path, filename, mimetype } = file;
        arrayPathFiles.push(path);
        arrayNameFiles.push(filename);
        arrayMimetypesFiles.push(mimetype);
    });

    const { id } = req.params;

    const imagenes = await Imagenes.create({
        nombre: JSON.stringify(arrayNameFiles),
        path: JSON.stringify(arrayPathFiles),
        mimetype: JSON.stringify(arrayMimetypesFiles),
        id_problema: id
    });

    return res.status(201).json({
        status: 201,
        msg: 'Pregunta creada correctamente'
    });
}

export { getProblemas, registrarPregunta, guardarImagen }