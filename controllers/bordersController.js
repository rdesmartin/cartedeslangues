var borders = require('../models/borders.js');

module.exports = {
    getBorders: (req, res, next) => {
        const { region } = req.params;
        res.json(borders.getBorders(region));
    }
}
