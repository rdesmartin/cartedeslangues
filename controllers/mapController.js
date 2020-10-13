const languages = require('../data/languages');

const ageGroups = ['15-34', '35-54', '55+'];

const mapController = {
    map: (req, res, next) => {
        values = Object.values(languages)
        langCodesArray = Object.keys(languages).map((e, i)  => [e, values[i]])
        langCodesArray.sort();
        console.log(langCodesArray);
        res.render('map', {
            title: 'Map',
            langCodes: langCodesArray,
            ageGroups: ageGroups,
        });
    }
}

module.exports = mapController
