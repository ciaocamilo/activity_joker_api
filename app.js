import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

const app = express();

// Conexión base de datos
const mongoose = require('mongoose');
const uri = 'mongodb+srv://humboldt:wj1QtoFFZdOZZkDB@cluster0.hhf0y.mongodb.net/humboldt_test?retryWrites=true&w=majority';
const options = {useNewUrlParser: true, useUnifiedTopology: true};

mongoose.connect(uri, options).then(
    () => { console.log('Conectado a la DB Mongo') },
    err => { console.log(err) }
);

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send('<h1>Servicio Web para consultar actividades y chistes.</h1><h2>Prueba Humboldt</h2>');
});

app.use('/api', require('./routes/activity_jokes'));

const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), function () {
    console.log('La aplicación corre en el puerto '+ app.get('puerto'));
});

// Desarrollado por: Ing. Camilo A. Castañeda G. - 2022