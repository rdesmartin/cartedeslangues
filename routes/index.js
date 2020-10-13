var express = require('express');
var router = express.Router();

var mapController = require('../controllers/mapController');
var bordersController = require('../controllers/bordersController');
var languageController = require('../controllers/languageController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/map', mapController.map);

router.get('/borders/:region', bordersController.getBorders)

router.get('/country/:code', languageController.getCountryData)
router.get('/langdata', languageController.getLangData)

module.exports = router;
