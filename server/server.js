const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());

app.get("/usuarios", function (req, res) {
  res.json("Get Usuarios");
});

app.post("/usuarios", function (req, res) {
    let body = req.body;
    res.json({body});
});

app.listen(process.env.PORT, () => {
  console.clear();
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
