const express = require('express');
const app = express();

const PORT = 4000;

//Modulo database
require('./database/connection')

//Routers
const auth = require('./routers/auth');
const categories = require('./routers/categories');
const brands = require('./routers/brands');
const products = require('./routers/products');

//Configuración de routers
app.use('/api', auth);
app.use('/api', categories);
app.use('/api', brands);
app.use('/api', products);

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