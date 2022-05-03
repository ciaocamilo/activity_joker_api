import express from 'express';
const router = express.Router();

// Importar el modelo
import ActivityJokes from '../models/activity_jokes';

// Ruta para consultar todos las actividades guardadas y sus chistes
router.get('/activity-jokes/download', async(req, res) => {
    try {
        const activityJokesDB = await ActivityJokes.find();
        res.json(activityJokesDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Se presentó un error al consultar las actividades y chistes de la base de datos',
            error
        })
    }
});

//Exportar configuración
module.exports = router;