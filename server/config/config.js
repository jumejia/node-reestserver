//puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//Base de datos
let urlDb;
let seed;

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe';
    seed = 'este-es-seed-desarrollo';
} else {
    urlDb = 'mongodb+srv://jumejia:Dianis1027.*@cluster0-qhrxh.mongodb.net/cafe';
    seed = 'este-es-seed-produccion';
}

process.env.URL = urlDb;


//vencimiento del token(30 días)
process.env.CADUCIDAD_TOKEN = (60 * 60 * 24 * 30);

//seed de autenticación
process.env.SEED = seed;


//CLIENT id de Google
process.env.CLIENT_ID = process.env.CLIENT_ID || '774207438248-094dn6ehvd62m27devm6df7f55litcvc.apps.googleusercontent.com';