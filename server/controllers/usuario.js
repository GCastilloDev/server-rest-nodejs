// Son las rutas
const express = require("express");
const Usuario = require("../models/usuario");
const {
  verificaToken,
  esAdministrador,
} = require('../middlewares/autenticacion');
const bcrypt = require("bcrypt");
const _ = require("underscore");

const app = express();

// Obtener usuarios
app.get("/usuario", verificaToken, (req, res) => {
  let desde = Number(req.query.desde) || 0;

  let limite = Number(req.query.limite) || 5;

  Usuario.find({ estado: true})
    .skip(desde)
    .limit(limite)
    .exec((error, usuarios) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      Usuario.countDocuments({ estado: true }, (error, conteo) => {
        res.json({
          ok: true,
          totalRegistros: conteo,
          usuarios,
        });
      });
    });
});

// Crear usuarios
app.post('/usuario', [verificaToken, esAdministrador], (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    rol: body.role,
  });

  // Grabar en la bd
  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    // usuarioDB.password = null;

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

// Actualizar usuarios
app.put('/usuario/:id', [verificaToken, esAdministrador], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (error, usuarioDB) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      if (!usuarioDB) {
        return res.status(204).json({
          ok: true,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

// Borrar usuario (solamente marcar como eliminado)
app.delete('/usuario/:id', [verificaToken, esAdministrador], (req, res) => {
  let id = req.params.id;

  let cambiaEstado = {
    estado: false,
  };

  Usuario.findByIdAndUpdate(
    id,
    cambiaEstado,
    { new: true },
    (error, usuarioBorrado) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      if (!usuarioBorrado) {
        return res.status(400).json({
          ok: false,
          error: {
            message: 'Usuario no encontrado',
          },
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBorrado,
      });
    }
  );
});

// Borrar usuarios (directamente)
// app.delete("/usuario/:id", function (req, res) {

//   let id = req.params.id;

//   Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {

//     if (error) {
//       return res.status(400).json({
//         ok: false,
//         error
//       });
//     }

//     if (!usuarioBorrado) {
//       return res.status(400).json({
//         ok: false,
//         error: {
//           message: 'Usuario no encontrado'
//         }
//       });
//     }

//     res.json({
//       ok: true,
//       usuario: usuarioBorrado
//     });
//   })

// });

module.exports = app;
