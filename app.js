const express = require('express');
const app = express();

const PORT = 4000;

//Modulo database
require('./database/connection')

//Routers
const auth = require('./routers/auth');
const categories = require('./routers/categories');

//Configuración de routers
app.use('/api', auth);
app.use('/api', categories);

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