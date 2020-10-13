const regions = {
    europe: [
        'ALB','AND','AUT','BLR','BEL','BIH','BGR','HRV','CYP','CZE','DNK','EST',
        'FRO','FIN','FRA','DEU','GIB','GRC','HUN','IRL','ISL','IMN','ITA','XKX',
        'LVA','LTE','LTU','MKD','MLT','MDA','MCO','MNE','NLD','NOR','POL','PRT',
        'ROU','RUS','SMR','SRB','SVK','SVN','ESP','SWE','CHE','UKR','GBR','VAT'
    ],
    eu: [
        'AUT','BEL','BGR',/*'HRV'*/,'CYP','CZE','DNK','EST','FIN','FRA','DEU','GRC',
        'HUN','IRL','ITA','LVA','LTU','LUX','MLT','NLD','POL','PRT','ROU','SVK',
        'SVN','ESP','SWE','GBR'
    ],
}

const bordersData = require('../data/countries.geojson')

const getBorders = (region) => {
    if (!region || !region.length || !(region in regions)) {
        return bordersData;
    } else {
        var data = {...bordersData,
            features: bordersData.features.filter(feature => regions[region].indexOf(feature.properties.ISO_A3) !== -1),
        };
        return data;
    }
}

module.exports = { getBorders };
