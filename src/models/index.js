import Imagenes from "./Imagenes.js";
import Problema from "./Problemas.js";
import Respuestas from "./Respuestas.js";

Problema.hasMany(Imagenes, {foreignKey: 'id_problema'});
Problema.hasMany(Respuestas, {foreignKey: 'id_problema'});


export {
    Problema, 
    Imagenes,
    Respuestas
}