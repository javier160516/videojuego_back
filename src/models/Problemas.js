import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Problema = db.define('Problemas', {
    planteamiento:{
        type: DataTypes.STRING,
        allowNull: false
    },
    opciones: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

export default Problema;