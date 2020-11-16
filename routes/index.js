var express = require('express');
var router = express.Router();

var mapController = require('../controllers/mapController');
var bordersController = require('../controllers/bordersController');
var languageController = require('../controllers/languageController');

router.get('/', mapController.map);

router.get('/info', mapController.info)

// api
router.get('/borders/:region', bordersController.getBorders)
router.get('/country/:code', languageController.getCountryData)
router.get('/langdata', languageController.getLangData)

module.exports = router;
