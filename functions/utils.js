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

module.exports = { sms, check }