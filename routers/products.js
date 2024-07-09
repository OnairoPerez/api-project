const { sms, check } = require('../functions/utils');
const { Types } = require('mongoose'); 
const express = require('express');

//Modelos
const Products = require('../database/models/Products');
const Brands = require('../database/models/Brands');
const Categories = require('../database/models/Categories');

//Configuración  del router
const  router = express.Router();
router.use(express.json());

//Verificar si una consulta retorna un documento
function docVerify(variable) {
  return variable ? true :false;
}

//Guardar un nuevo documento
router.post('/products/new', async (req, res) => {
  const body = req.body;

  //Datos
  const name = body.name; const price = body.price; const purchased = body.purchased;
  const stock = body.stock; const category = body.category; const brand = body.brand;
  const img = body.img;

  if (check(name) || check(price, 'number') || check(category) || check(brand) || check(img)) {
    res.status(400).send(sms('Customer request is invalid due to missing or incorrect data'));
    return
  }

  if (category.length != 24 || brand.length != 24) {
    res.status(400).send(sms('Sitenxis error in references ID'));
    return
  }

  //Comprobar si las referencias existen
  const refCategory = await Categories.findOne({ _id: category }).exec();
  const refBrand = await Brands.findOne({ _id: brand }).exec();

  if (!docVerify(refCategory) || !docVerify(refBrand)) {
    res.status(404).send(sms('The ID value for the category or brand is incorrect'));
    return
  }

  //Comprobar si existe en la base de datos
  Products.findOne({name: name}).exec()
    .then(document => {
      if(document) {
        res.status(409).send(sms('Product already exists'));
      } else {
        const data = {
          name: name,
          price: price,
          img: img,
          category: new Types.ObjectId(category),
          brand: new Types.ObjectId(brand)
        }
        
        if (!check(purchased, 'number')) {
          data['purchased'] = purchased;
        }

        if(!check(stock, 'number')) {
          data['stock'] = stock;
        }

        //Crear objeto producto
        const product = new Products(data);

        //Guardar documento
        product.save()
          .then((document) => {
            res.send(sms('successful save'));
            console.log(document)
          })
          .catch(() => {
            res.status(500).send(sms('Internal Server Error'));
          });
      }
    });
});

module.exports = router;