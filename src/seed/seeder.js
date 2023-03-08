import { exit } from 'node:process'
import db from "../../config/db.js";
import personajes from './Personajes.js';
import Personaje from '../../models/Personajes.js';

const importarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate()
        
        //Generar las columnas
        await db.sync()

        //Insertar Datos
        await Promise.all([
            Personaje.bulkCreate(personajes)
        ]);
        console.log('Datos importados correctamente');
        exit();

    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if(process.argv[2] === '-i'){
    importarDatos();
}