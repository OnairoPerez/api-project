const { sms, check, generateCode } = require('../functions/utils');
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
    res.status(400).send(sms('Sitanxis error in references ID'));
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
          web_id: generateCode(10),
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
            let message = sms('successful save');
            message["document"] = { web_id: document.web_id }
            res.send(message);
          })
          .catch(() => {
            res.status(500).send(sms('Internal Server Error'));
          });
      }
    });
});

//Obtener un producto por id
router.get('/products/get/:id', (req, res) => {
  const id = req.params.id;

  if (id.length != 10) {
    res.status(400).send(sms('Sitanxis error in ID'));
    return
  }

  Products.findOne({ web_id: id }).exec()
    .then(document => {
      if (document) {
        let message = sms('Successful operation')
        message['document'] = document;
        res.send(document);
      } else {
        res.status(404).send(sms('Incorrect ID'));
      }
    })
    .catch(() => {
      res.status(500).send(sms('Internal Server Error'));
    });
});

//obtener los productos más comprados
router.get('/products/most-purchased', (req, res) => {
  Products.find({}).sort({ purchased: -1 }).limit(4)
    .then(documents => {
      let message = sms('Successful operation');
      message['documents'] = documents;
      res.send(message);
    })
    .catch(() => {{
      res.status(500).send(sms('Internal Server Error'));
    }});
});

//Buscador de productos
router.get('/products/search', (req , res) => {
  const { query } = req.query;

  //Procesar el parámetro de consulta
  const excludeWords = ['y', 'de', 'la', 'el', 'un', 'en', 'a', 'al', 'es', 'por', 'para'];
  const lower = query.toLowerCase();
  const words = lower.split(' ').filter(word => !excludeWords.includes(word));

  //Realizar la búsqueda a través de regex
  Products.find({
    $or: words.map(word => ({
      name: { $regex: word, $options: 'i'}
    }))
  })
    .then(documents => {
      if(documents) {
        let message = sms('Successful operation');
        message['documents'] = documents;
        res.send(message);
      } else {
        res.status(404).send(sms('A product has not been found with the search term indicated.'));
      }
    })
    .catch(() => {
      res.status(500).send(sms('Internal Server Error'));
    });
})

//Actualizar la información de un producto
router.put('/products/update/:id', (req, res) => {
  let id = req.params.id;
  let body = req.body;

  //Definimos las propiedades que puede contener el objeto enviado por el cliente
  let properties = ['name', 'img', 'price', 'purchased', 'stock', 'category', 'brand'];
  let verify = [];

  //Guardamos las comprobaciones en un arreglo
  for (const [key, value] of Object.entries(body)) {
    verify.push(properties.includes(key));

    let datatype = key === 'price' || key === 'purchased' || key === 'stock' ? 'number' : 'string';
    verify.push(!check(value, datatype));
  }

  //Si las propiedad son correcta se realiza la actualización
  if (verify.every(Boolean)) {
    Products.findOneAndUpdate({  web_id: id }, body, { new: true })
      .then(document => {
        if(!document) {
          res.status(404).send(sms('Document not found'));
        } else {
          let message = sms('Updated article');
          message['document'] = document;  
          res.send(message);
        }
      })
      .catch((error) => {
        res.status(500).send(sms('Internal Server Error'));
        console.log(error);
      });
  } else {
    res.status(400).send(sms('Incorrect property or value type'));
  }
});

module.exports = router;