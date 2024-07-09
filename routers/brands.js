const { sms, check } = require('../functions/utils');
const express = require('express');

//Modelos
const Brand = require('../database/models/Brands');

//Configuración del router
const router = express.Router();
router.use(express.json());

//Eviar al cliente todas las marcas
router.get('/brands', (req, res) => {
  Brand.find({}).select({__v:0})
    .then(data => {
      let message = sms('Successful operation');
      message['documents'] = data;
      res.send(message);
    })
    .catch(() => {
      res.status(500).send(sms('Internal Server Error'));
    });
})

//Guardar una marca
router.post('/brands/new', (req, res) => {
  const body = req.body;

  //Datos
  const name = body.name;

  if(check(name)) {
    res.status(400).send(sms('Customer request is invalid due to missing or incorrect data'));
    return
  }

  //Comprobar si existe
  Brand.findOne({name: name}).exec()
    .then(document => {
      if(document) {
        res.status(409).send(sms('Brand already exists'));
      } else {
        //Crear objeto marca
        const brand = new Brand({
          name: name
        });

        //Guardar el documento
        brand.save()
          .then(() => {
            res.send(sms('successful save'));
          })
          .catch(() => {
            res.status(500).send(sms('Internal Server Error'));
          })
      }
    })
})

module.exports = router;