const express = require('express');
const app = express();

const PORT = 4000;

//Modulo database
require('./database/connection')

//Routers
const auth = require('./routers/auth');

//Configuración de routers
app.use('/api', auth);

app.get('/', (req, res) => {
  res.send('API en funcionamiento');
});

app.listen(PORT, () => {
  console.log(`
    -----------------------
    Servidor ejecutandoce
        correctamente

        Puerto: ${PORT}
    -----------------------`
  );
});