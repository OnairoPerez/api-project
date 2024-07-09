const { sms, check } = require('../functions/utils');
const express = require('express');

//Modelos
const Categories = require('../database/models/Categories');

//Configuración del router
const router = express.Router();
router.use(express.json());

//Eviar al cliente todas las categorias
router.get('/categories', (req, res) => {
  Categories.find({}).select({__v:0})
    .then(data => {
      let message = sms('Successful operation');
      message['documents'] = data;
      res.send(message);
    })
    .catch(() => {
      res.status(500).send(sms('Internal Server Error'));
    });
});

//Guardar una categoria
router.post('/categories/new', (req, res) => {
  const body = req.body;

  //Datos
  const name = body.name;
  const img = body.img;
  const value = body.value;

  if(check(name) || check(img) || check(value)) {
    res.status(400).send(sms('Customer request is invalid due to missing or incorrect data'));
    return
  }

  //Buscar el documento por nombre para evitar guardar un mismo objeto dos veces.
  Categories.findOne({name: name}).exec()
    .then(document => {
      if(document) {
        res.status(409).send(sms('Caterory already exists'));
      } else {
        //Crear objeto categoria
        const category = new Categories({
          name: name,
          img: img,
          value: value
        });

        //Guardar el documento
        category.save()
            .then(() => {
              res.send(sms('successful save'));
            })
            .catch(() => {
              res.status(500).send(sms('Internal Server Error'));
              return;
            });
      }
    })
    .catch(()  => {
      res.status(500).send(sms('Internal Server Error'));
    });
});

module.exports = router;



