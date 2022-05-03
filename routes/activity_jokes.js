import express from 'express';
import axios from 'axios';
const router = express.Router();

// Importar el modelo
import ActivityJokes from '../models/activity_jokes';

// Ruta para generar actividad y chiste
router.get('/activity-jokes/new/:type', async(req, res) => {
    const activity_type = req.params.type;
    try {
        axios.get('https://www.boredapi.com/api/activity?type=' + activity_type)
            .then(result => {
                if (result.data.error) {
                    res.json({error: "El tipo de actividad no es válido. Pista: Debe ser en inglés."});
                } else {
                    const activity_data = result.data;
                    const words_array = activity_data.activity.split(" ");
                    const jokes_array = [];
                    words_array.forEach((word, index) => {
                        axios.get('https://v2.jokeapi.dev/joke/Any?contains=' + word)
                            .then(result2 => {
                                if (!result2.data.error) {
                                    if (jokes_array.length < 1) {
                                        jokes_array.push(result2.data);
                                        let joke_data = jokes_array[0];
                                        let joke_text = '';
                                        if (joke_data.type === 'twopart') {
                                            joke_text = joke_data.setup + '->' + joke_data.delivery;
                                        } else {
                                            joke_text = joke_data.joke;
                                        }
                                        // Organiza información
                                        let final_data = {
                                            type: activity_data.type,
                                            activity: activity_data.activity,
                                            key: activity_data.key,
                                            joker: {
                                                id: joke_data.id,
                                                joke: joke_text
                                            }
                                        }
                                        // Inserta en base de datos
                                        try {
                                            ActivityJokes.create(final_data);
                                        } catch (error) {
                                            console.log('Error de escritura en la base de datos: ' + error);
                                        }
                                        // Rederiza JSON
                                        res.json(final_data);
                                    }
                                }
                                if (index === words_array.length-1 && jokes_array.length === 0) {
                                    res.json({error: "Esta es una actividad muy aburrida"});
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    });
                }
            })
            .catch(error => {
                console.log(error);
            })
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Se presentó un error al generar la actividad y/o chiste',
            error
        })
    }
});

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