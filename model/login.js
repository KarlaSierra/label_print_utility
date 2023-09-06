const bcrypt = require('bcrypt');

module.exports = {
    insertar: function (con, datos, funcion, res, error) {
        // Generar el valor de hash de la contraseña
        const hash = bcrypt.hashSync(datos.password, 10);

        con.query('INSERT INTO users(user, name, password, rol) VALUES (?,?,?,?)',
            [datos.user, datos.name, hash, datos.rol], funcion);
        if (error) {
            res.redirect('/');
            console.log(error);       
        }
    },

    obtener: function (con, funcion) {
        con.query('SELECT * FROM label_print_utility.users', (error, resultados) => {
            if (error) {
                return funcion(error, null);
            } else {
                return funcion(null, resultados);
            }
        });
    },
}
