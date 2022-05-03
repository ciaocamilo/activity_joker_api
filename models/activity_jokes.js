import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const activityJokesSchema = new Schema(
    {
        type: { type: String, required: [true, 'Tipo de la actividad'] },
        activity: { type: String, required: [true, 'Nombre de la actividad'] },
        key: { type: String, required: [true, 'Clave de la actividad'] },
        joker: { type: Object, default: { id: 0, joke: 'Esta es una actividad muy aburrida' } }
    }
)

const activityJokes = mongoose.model('activity_jokes', activityJokesSchema);

export default activityJokes;