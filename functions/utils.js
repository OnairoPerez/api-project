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

//Generar códigos
function generateCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
  }

  return code;
}

module.exports = { sms, check, generateCode };