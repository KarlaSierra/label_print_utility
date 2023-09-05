module.exports={
    obtener: function(conexion, funcion) {
        conexion.query('SELECT * FROM ticket_gavilla ORDER BY fecha_elaboracion DESC', (error, resultados) => {
            if (error) {
                return funcion(error, null);
            }
    
            const resultadosFormateados = resultados.map((fila) => {
                const fechaElaboracion = new Date(fila.fecha_elaboracion);
                const fechaElaboracionFormateada = `${fechaElaboracion.getDate()}/${fechaElaboracion.getMonth() + 1}/${fechaElaboracion.getFullYear()}`;
                return {
                    ...fila,
                    fecha_elaboracion: fechaElaboracionFormateada
                };
            });
    
            return funcion(null, resultadosFormateados);
        });
    },

    insertar: function(conexion, datos, funcion) {
        let n_tickets, resto;
    
        if (datos.variedad === "Sumatra tripa") {
            n_tickets = datos.cant_gavillas_paca_sumatra / datos.gavilla_funda_sumatra;
            resto = datos.cant_gavillas_paca_sumatra % datos.gavilla_funda_sumatra;
        } else {
            n_tickets = Math.floor(datos.cant_gavillas_paca / datos.gavillas_funda);
            resto = datos.cant_gavillas_paca % datos.gavillas_funda;
        }
    
        if (n_tickets === 0) {
            n_tickets = 1;
        }
    
        let insertValues = [
            datos.n_paca, datos.clase, datos.variedad, datos.hojas_gavillas, datos.gavillas_funda,
            datos.hojas_fundas, datos.prom_gavillas, datos.cant_gavillas_fundas, datos.cant_gavillas_paca,
            datos.prom_hojas_paca, datos.cant_fundas_paca, datos.tamano, n_tickets, datos.fecha_elaboracion, resto
        ];
    
        if (datos.variedad === "Sumatra tripa") {
            insertValues.push (
                datos.muestra_gavillas_sumatra, 
                datos.gavilla_funda_sumatra, 
                datos.peso_funda_sumatra, 
                datos.cant_fundas_paca_sumatra, 
                datos.cant_gavillas_paca_sumatra
            );
        } else {
            insertValues.push(null, null, null, null, null);
        }
    
        const sql = 'INSERT INTO ticket_gavilla(n_paca, clase, variedad, hojas_gavillas, gavillas_funda, hojas_fundas, prom_gavillas, cant_gavillas_fundas, cant_gavillas_paca, prom_hojas_paca, cant_fundas_paca, tamano, n_tickets, fecha_elaboracion, sobrante, muestra_gavillas_sumatra, gavilla_funda_sumatra, peso_funda_sumatra, cant_fundas_paca_sumatra, cant_gavillas_paca_sumatra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        conexion.query(sql, insertValues, (error, results) => {
            if (error) {
                console.error("Error:", error);
                funcion(error);
            } else {
                console.log("Registro insertado correctamente.");
                funcion(null, results);
            }
        });
    },

    returnId:function(con, id, funcion){
        con.query('SELECT * FROM ticket_gavilla Where id= ?',[id], funcion);
    },

    returnPaca: function (con, q, funcion) {
      console.log('Valor de búsqueda:', q);
      con.query('SELECT * FROM ticket_gavilla WHERE n_paca = ?', [q], funcion);
  },
  
}