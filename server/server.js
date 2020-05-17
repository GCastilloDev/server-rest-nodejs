require("./config/config");

const mongoose = require('mongoose');
const express = require("express");

const app = express();

const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());


// Configuración global de rutas
app.use(require("./controllers/index"));

// Conexión a la BD
mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  (err, res) => {
    if (err) throw err;
    console.log('Base de datos conectada...');
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
