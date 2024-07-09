const { hashSync, compareSync, genSaltSync } = require('bcrypt');
const express = require('express');

//Modelos
const Auth = require('../database/models/Auth');

const router = express.Router();
router.use(express.json());

//Mensaje en fomato json del servidor
function sms(text) {
	return {message: text}
}

//Verificar el tipo de dato y el contenido de una variable
function check(variable, datatype = 'string') {
  if (variable == null) {
    return true;
  } else {
    const type = typeof variable === datatype;
    const empy = variable.length != 0;

    return !(type && empy)
  }
}

//Procesar los datos del body enviados en la petición
function body(req, res) {
  const body = req.body;

	//Datos
	const email = body.email;
	const password = body.password;

  if (check(email) || check(password)) {
    res.status(400).send(sms('Customer request is invalid due to missing or incorrect data'));
    return null;
  }

  return {email:email, password:password}
}

router.post('/register', (req, res) => {
	const data = body(req, res);
  if (data != null) {
    const {email, password} = data;
    //Hash para la contraseña
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    //Buscar el documento en al base de datos por email
    Auth.findOne({email: email}).exec()
      .then(document => {
        if (document) {
          res.status(409).send(sms('Account already exists'));
        } else {
          //Se crea el objeto cuenta
          const account = new Auth({
            email: email,
            password: hash
          });
      
          //Guardar el documento
          account.save()
            .then(() => {
              res.send(sms('successful save'));
            })
            .catch(() => {
              res.status(500).send(sms('Internal Server Error'));
              return;
            });
        }
      })
  }
});

router.post('/auth', (req, res) => {
  const data = body(req, res);
  if (data != null) {
    const {email, password} = data;
    //Buscar el documento en al base de datos por email
    Auth.findOne({email: email}).exec()
      .then(document => {
        if(document) {
          //Verificar la contraseña
          if (compareSync(password, document.password)) {
            res.send(sms('login susscefull'));
          } else {
            res.status(401).send(sms('Incorrect password'));
          }
        } else {
          res.status(404).send(sms('Incorrect email or unregistered account'));
        }
      });
  }
})

module.exports = router;
