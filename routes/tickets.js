var express = require('express');
var router = express.Router();
const ticketsController = require('../controllers/ticketsController');

router.get('/', ticketsController.index);
router.get('/crear', ticketsController.crear);
router.post('/', ticketsController.save);
router.get('/buscar', ticketsController.buscar); 
router.get('/resultados_busqueda', ticketsController.buscar)
router.get('/:id', ticketsController.ver);
router.get('/codigo-de-barras/:id', ticketsController.generarCodigoDeBarras);

module.exports = router;