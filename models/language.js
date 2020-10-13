var mongoose = require('mongoose');
var languages = require('../data/languages')

var langCodes = Object.keys(languages)

const countryCodes = [
    "BEL","DNK","DEU","GRC","ESP","FRA","IRL","ITA","LUX","NLD","PRT","GBR",
    "AUT","SWE","FIN","CYP","CZE","EST","HUN","LVA","LTU","MLT","POL","SVK",
    "SVN","BGR","ROU"
];

const langDataSchema = new mongoose.Schema({
    langCode:  {
        type: String,
        required: true,
        validate: {
            validator: v => langCodes.indexOf(v) !== -1,
            message: props => `${props.value}: invalid language code.`
        }
    },
    countryCode: {
        type: String,
        required: true,
        validate: {
            validator: v => countryCodes.indexOf(v) !== -1,
            message: props => `${props.value}: invalid country code.`
        }
    },
    ageGroup: {
        type: String,
        required: true
    },
    native: {
        type: Boolean,
        default: false
    },
    value: {
        type: Number,
        required: true
    }
})

const langDataModel = mongoose.model('langData', langDataSchema);

const addLangData = (newLangData, cb) => {
    const { countryCode, langCode, ageGroup, native, value } = newLangData;
    const langData = new langDataModel({
        countryCode,
        langCode,
        ageGroup,
        native,
        value
    })
    return langData.save(cb)
}

const getAllLangData = () => {
    return langDataModel.find().exec();
}

const getLangDataByCountry = (countryCode) => {
    return langDataModel.find({countryCode});
}

const findLangDatas = (searchParams) => {
    return langDataModel.find(searchParams);
}

module.exports = {
    langDataModel,
    addLangData,
    getAllLangData,
    getLangDataByCountry,
    findLangDatas
};
