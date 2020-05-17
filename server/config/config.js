// ===========================
//           Puerto
// ===========================
process.env.PORT = process.env.PORT || 3000;

// ===========================
//           Entorno
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
//        Base de datos
// ===========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB =
      "mongodb+srv://sandbox:1S1vDEr317zTTXsY@cluster0-wb0i1.mongodb.net/cafe";
}

process.env.URLDB = urlDB;