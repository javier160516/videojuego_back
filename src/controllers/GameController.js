import { validationResult, check } from "express-validator"
import { Problema, Imagenes, Respuestas } from '../models/index.js';
import db from "../config/db.js";
import { QueryTypes } from "sequelize";

const getProblemas = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    try {
        // const problemas = await Problema.findAll();
        // const imagenes = await Imagenes.findAll();
        // const respuestas = await Respuestas.findAll();

        const problemas = await db.query(`
            SELECT p.id, p.planteamiento, p.opciones, r.opcion
            FROM problemas as p
            INNER JOIN respuestas as r ON r.id_problema = p.id
        `, { type: QueryTypes.SELECT });

        const newArrayProblemas = [];
        Object.values(problemas).forEach(problema => {
            const problemaObjeto = {
                id: problema.id,
                planteamiento: problema.planteamiento,
                respuestas: problema.opciones,
                opcion: problema.opcion
            }
            newArrayProblemas.push(problemaObjeto);
        });

        return res.status(200).json({
            status: 200,
            data: newArrayProblemas
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            msg: 'Ha ocurrido un error'
        })
    }
}

const registrarPregunta = async (req, res) => {
    await check('problem').notEmpty().withMessage('El campo es obligatorio').run(req);
    await check('answers').notEmpty().withMessage('Las respuestas son obligatorias').run(req);
    await check('correct').notEmpty().withMessage('El campo es obligatorio').run(req);

    console.log(req.body);

    let result = validationResult(req);
    let errors = {};
    result.array().map(resultState => {
        const { param, msg } = resultState;
        if (param == 'problem') {
            errors = { ...errors, problem: msg }
        }
        if (param == 'answers') {
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

    const { problem, answers, correct: correctAnswer } = req.body

    try {
        const problema = await Problema.create({
            planteamiento: problem,
            opciones: JSON.stringify(answers)
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

// const guardarImagen = async (req, res) => {
//     console.log(req.params);
//     const arrayPathFiles = [];
//     const arrayNameFiles = [];
//     const arrayMimetypesFiles = [];

//     req.files.forEach(file => {
//         const { path, filename, mimetype } = file;
//         arrayPathFiles.push(`${path}`);
//         arrayNameFiles.push(filename);
//         arrayMimetypesFiles.push(mimetype);
//     });

//     const { id } = req.params;

//     const imagenes = await Imagenes.create({
//         nombre: JSON.stringify(arrayNameFiles),
//         path: JSON.stringify(arrayPathFiles),
//         mimetype: JSON.stringify(arrayMimetypesFiles),
//         id_problema: id
//     });

//     return res.status(201).json({
//         status: 201,
//         msg: 'Pregunta creada correctamente'
//     });
// }

const deleteQuestion = async (req, res) => {
    const {id} = req.params;
    const question = await Problema.findOne({where: {id}});
        if(!question){
            return res.status(404).json({
                status: 404,
                msg: 'Pregunta no encontrada'
            });
        }
    try {
        await Problema.destroy({where: {id}});
        return res.status(200).json({
            status: 200,
            msg: 'Problema eliminado correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            msg: 'No hemos podido eliminar el registro'
        });
    }
}

export { getProblemas, registrarPregunta, deleteQuestion }