const jwt = require('jsonwebtoken');

//==========================
//  Verificar Token
//==========================

const verificaToken = (req, res, next) => {
  let token = req.get('token');

  jwt.verify(token, process.env.SEMILLA, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        ok: false,
        error: {
          message: 'Token no válido',
        },
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

//==========================
//  Verificar Rol
//==========================
let esAdministrador = (req, res, next) => {
  const rol = req.usuario.rol;
  if (rol === 'ADMIN_ROLE') {
    next();
  } else {
    return res.status(401).json({
      error: {
        message: 'El usuario no tiene privilegios',
      },
    });
  }
};

module.exports = {
  verificaToken,
  esAdministrador,
};
