const { con, User } = require('../config/db');
const ticket = require('../model/ticket');
const barcode = require('barcode');
const PDFDocument = require('pdfkit');
const bwipjs = require('bwip-js');
const infoVariedad = require('../datos/variedad.js');

const ITEMS_PER_PAGE = 10;

module.exports = {

    // Para ver los registros de los tickets
    index: function (req, res,) {
        const page = parseInt(req.query.page) || 1;
        ticket.obtener(con, function (err, datos) {

            //Manejar el error
            if (err) {
                console.error(err);
                return res.status(500).send('Error al obtener los datos de la base de datos');
            }

            const totalItems = datos.length;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
            const startIndex = (page - 1) * ITEMS_PER_PAGE;
            const endIndex = page * ITEMS_PER_PAGE;
            const paginatedData = datos.slice(startIndex, endIndex);

            res.render('tickets/index', {

                ticket1: paginatedData,
                pageInfo: {
                    currentPage: page,
                    totalPages: totalPages,
                    hasNextPage: endIndex < totalItems,
                    hasPreviousPage: startIndex > 0,
                    nextPage: page + 1,
                    previousPage: page - 1
                }
            });
        });
    },

    // Para crear un nuevo registro
    crear: function (req, res) {
        const banda = infoVariedad.banda[0].Variedad;
        const capa = infoVariedad.capa[0].Variedad;
        
        if (banda && capa) {
            // Obtener hojas_fundas de una variedad específica en la banda
            const varie = banda.find(variedad => variedad.nombre === 'NSA').varie;
    
            // Agregar hojas_fundas a cada objeto de la variedad para ser consistente con cómo lo accedes en la vista
            banda.forEach(variedad => {
                variedad.varie = varie ;
            });
    
            capa.forEach(variedad => {
                variedad.varie = varie ;
            });
    
            const variedades = {
                banda: [{ Variedad: banda }],
                capa: [{ Variedad: capa }]
            };
    
            res.render('tickets/crear', { variedades: variedades });
    
        } else {
            // Manejar el caso donde banda o capa sean undefined
            console.error('Error: Banda o capa es undefined.');
            res.status(500).send('Error en la obtención de los datos de variedades.');
        }
    },    

    // Para realizar una busqueda de los tickets
    buscar: function (req, res) {
        const searchQuery = req.query.q; // Obtener el valor de búsqueda de los parámetros de la URL
        if (!searchQuery) {
            return res.render('tickets/buscar'); // Si no hay valor de búsqueda, simplemente renderiza la vista de búsqueda
        }

        // Realizar la búsqueda en la base de datos utilizando el valor de búsqueda
        ticket.returnPaca(con, searchQuery, function (err, registro) {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al realizar la búsqueda en la base de datos');
            }

            console.log('Resultado de la consulta:', registro);
            res.render('tickets/resultados_busqueda', { tickets: registro });
        });
    },

    save: function (req, res) {
        ticket.insertar(con, req.body, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: 'Error al insertar los datos en la base de datos' }); // Enviar el mensaje de error al frontend
            }
            res.redirect('/tickets');
        });
    },    

    ver: function (req, res) {
        ticket.returnId(con, req.params.id, function (err, registro) {
            if (err) throw err;
            console.log(req.params.id);
            console.log(req.body);
            res.render('tickets/ver', { ticket1: registro[0] });
        });
    },

    generarCodigoDeBarras: function (req, res) {
        ticket.returnId(con, req.params.id, function (err, registro) {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al obtener los datos de la base de datos');
            }
            
            const text = String(registro[0].n_paca);
            const bcid = 'code128';
            const scale = 1.2;
            const height = 7;
            const includetext = false;
            const textxalign = 'center';
            
            const bar = new Promise((resolve, reject) => {
                bwipjs.toBuffer({
                    bcid,
                    text,
                    scale,
                    height,
                    includetext,
                    textxalign,
                }, (err, png) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(png);
                    }
                });
            });
                
            bar.then((png) => {
                const doc = new PDFDocument({
                    size: [7.6 * 28.35, 5 * 28.35],
                    margins: {
                    top: 0.5 * 28.35,
                    bottom: 0.3 * 28.35,
                    left: 0.8 * 28.35,
                    right: 0.8 * 28.35
                }
            });
            
            //Setea el stream de salida del PDF
            doc.pipe(res);
        
            //insertamos el for para recorrer el numero de tickets
            for (let i = 0; i < registro[0].n_tickets; i++) {
                console.log('Iteración:', i + 1); // Agregado para depuración

                //generamos los datos de tickes
                doc.fontSize(9);
                doc.text('N° Paca: ' + registro[0].n_paca + '   P. Capa_____');
                doc.text('Variedad: ' + registro[0].variedad);
                doc.text('Clase: ' + registro[0].clase + '        Tam: ' + registro[0].tamano);
                doc.text('Peso humedo: ___________');
                doc.text('Peso despalillo: ________');
        
                // Verificamos si hay gavillas sobrantes y las sumamos a gavillas_funda si es necesario
                if (i === 0 && registro[0].sobrante <= 5) {
                    registro[0].gavillas_funda += registro[0].sobrante;
                    registro[0].sobrante = 0;
                }

                if (registro[0].variedad === "Sumatra tripa") {
                    doc.text('Gavillas funda:  ' + registro[0].gavilla_funda_sumatra);
                    doc.text('Gavillas paca:  ' + registro[0].cant_gavillas_paca_sumatra);
                    doc.text('Maquinista: __________________');
                    doc.text('Fecha elaboración: ' + registro[0].fecha_elaboracion.toLocaleDateString('es-ES'));
                    doc.text('Prom. Gavillas:' + 40);
                } else {
                    doc.text('Gavillas funda:  ' + registro[0].gavillas_funda);
                    doc.text('Gavillas paca:  ' + registro[0].cant_gavillas_paca);
                    doc.text('Maquinista: __________________');
                    doc.text('Fecha elaboración: ' + registro[0].fecha_elaboracion.toLocaleDateString('es-ES'));
                    doc.text('Prom. Gavillas:' + registro[0].prom_gavillas);
                }
                    
                    if (registro[0].sobrante > 5) {
                        var tic = registro[0].n_tickets + 1;
                        var ia = i + 1;
                        doc.text(ia + '/' + tic, { align: 'center' });
                    } else {
                        var ia = i + 1;
                        var tic = registro[0].n_tickets; 
                        doc.text(ia + '/' + tic, { align: 'center' });
                    } 
                        
                // Calcula la posición y de la imagen y añádela al PDF
                const y = (doc.page.height - doc.page.margins.bottom - doc.page.margins.top - 40) / 2 + doc.page.margins.top;
                doc.image(png, doc.page.width - doc.page.margins.right - 60, y, { fit: [60, 40], align: 'center', valign: 'center' });
            
                // Si es el último ciclo y hay gavillas sobrantes, agrega una página adicional
                if (i === registro[0].n_tickets - 1 && registro[0].sobrante !== 0) {
                    doc.addPage();
                    doc.text('N° Paca: ' + registro[0].n_paca + '   P. Capa_____');
                    doc.text('Variedad: ' + registro[0].variedad);
                    doc.text('Clase: ' + registro[0].clase + '        Tam: ' + registro[0].tamano);
                    doc.text('Peso humedo: ___________');
                    doc.text('Peso despalillo: ________');
                    doc.text('Gavillas funda:  ' + registro[0].sobrante);
                    doc.text('Gavillas paca:  ' + registro[0].cant_gavillas_paca);
                    doc.text('Maquinista: __________________');
                    doc.text('Fecha elaboración: ' + registro[0].fecha_elaboracion.toLocaleDateString('es-ES'));
                    doc.text('Prom. Gavillas:' + registro[0].prom_gavillas);
                    var tic = registro[0].n_tickets+1;
                    doc.text(tic+ '/' + tic, {align: 'center'});
            
                    // Calculamos la posición y de la imagen para que se centre verticalmente en la página
                    const y = (doc.page.height - doc.page.margins.bottom - doc.page.margins.top - 40) / 2 + doc.page.margins.top;
                    doc.image(png, doc.page.width - doc.page.margins.right - 60, y, { fit: [60, 40], align: 'center', valign: 'center' });
                }
        
                // Si no es el último ciclo, agrega una nueva página
                    if (i < registro[0].n_tickets - 1) {
                        doc.addPage();
                    }
                    console.log('Fin de iteración:', i + 1); // Agregado para depuración
                }
        
                // Finaliza el PDF
                doc.end();
                        
                }).catch((err) => {
                    console.error(err);
                    res.status(500).send('Error al generar el código de barras y el PDF');
                });  
        });
    }
}