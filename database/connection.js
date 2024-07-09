require('dotenv').config({ path: './database/.env' });
const mongoose = require('mongoose');

//URI y Opciones para la conexión con MongoDB Atlas (urlencode credentials)
const uri = process.env.mongodb_uri;

//Realiza la conexión
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const database = mongoose.connection;
mongoose.connect(uri, clientOptions)
  //Mostrar errores que ocurren al realizar la conexión
  .catch(error => console.log('[MongoDB] Error de conexión', error)); 

//Evento open para verificar la conexión con la base de datos
database.on('open', _ => {
  console.log(`
    -----------------------
        Conexión exitosa 
            MongoDB
    -----------------------`
  );
});

//Evento error para verificar si ocurre un error en tiempo de ejecución 
database.on('error', (error) => {
  console.log('[MongoDB] Error de procesamiento', error);
});
