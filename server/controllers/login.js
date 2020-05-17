const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {
  let body = req.body;

  Usuario.findOne({ email: body.email }, (error, usuarioDB) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error,
      });
    }

    // Comprobar si existe el usuario
    if (!usuarioDB) {
      return res.status(400).json({
        message: '(Usuario) y/o contraseña incorrectos',
      });
    }

    // Evaluamos la contraseña
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        message: 'Usuario y/o (contraseña) incorrectos',
      });
    }

    let token = jwt.sign(
      {
        usuario: usuarioDB,
      },
      process.env.SEMILLA,
      {
        expiresIn: process.env.CADUCIDAD_TOKEN,
      }
    );

    // Respuesta del servidor
    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    });
  });
});

module.exports = app;
