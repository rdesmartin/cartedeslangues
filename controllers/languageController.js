var languages = require('../models/language.js')

var languageController = {
    getCountryData: (req, res, next) => {
        const { code } = req.params;
        languages.getLangDataByCountry(code)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
    },

    getLangData: (req, res, next) => {
        console.log("getLangData");
        console.log(req.query);
        const searchParams = { countryCode, langCode, ageGroup, native } = req.query;
        for(var k in searchParams)
            if(!searchParams[k]) delete searchParams[k];
        languages.findLangDatas(searchParams)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
    }
};

module.exports = languageController;
