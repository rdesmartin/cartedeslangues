require('dotenv').config();

var langData = require('./models/language.js')
var papa = require('papaparse');
var fs = require('fs');
var mongoose = require('mongoose');

const host = process.env.MONGO_HOST
const port = process.env.MONGO_PORT
const db = process.env.MONGO_DB
const user = process.env.MONGO_USER
const pwd = process.env.MONGO_PWD

var client = mongoose.connect(
  `mongodb://${user}:${pwd}@${host}:${port}/${db}`,
  {useNewUrlParser: true, useUnifiedTopology: true}
).then(res => {
  console.log('connected to mongo')
}).catch(err => {
  console.log(err);
})

var dataSources = [
  {
    ageGroup: '15-34',
    native: true,
    filePath: 'data/15_34_native.csv',
  },
  {
    ageGroup: '15-34',
    native: false,
    filePath: 'data/15_34_total.csv',
  },
  {
    ageGroup: '35-54',
    native: true,
    filePath: 'data/35_54_native.csv',
  },
  {
    ageGroup: '35-54',
    native: false,
    filePath: 'data/35_54_total.csv',
  },
  {
    ageGroup: '55+',
    native: true,
    filePath: 'data/55_native.csv',
  },
  {
    ageGroup: '55+',
    native: false,
    filePath: 'data/55_total.csv',
  }
];

// remove old data if it already exists.
langData.langDataModel.remove({}, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Old data removed');
  }
})


const readCSV = filePath => {
  fileStream = fs.createReadStream(filePath)
  return new Promise((resolve, reject) => {
    papa.parse(fileStream, {
      header: true,
      dynamicTyping: true,
      complete: function(results) {
        resolve(results);
      }
    });
  })
}

dataSources.map(source => {
  var count = 0;
  readCSV(source.filePath)
  .then(content => {
    content.data.forEach((country) => {
      const countryCode = country.code;
      Object.entries(country).forEach(([key, value]) => {
        if (key === 'code' || !value) return;
        // console.log(`countryCode: ${countryCode}`);
        // console.log(`langCode: ${key}`);
        // console.log(`ageGroup: ${source.ageGroup}`);
        // console.log(`native: ${source.native}`);
        // console.log(`value: ${value}\n`);
        count++;
        langData.addLangData({
          countryCode: countryCode,
          langCode: key,
          ageGroup: source.ageGroup,
          native: source.native,
          value: value
        }).then(res => {
          //console.log(res);
        }).catch(err => {
          console.log(err);
        })
      });
    });
    console.log(`Added ${count} elements from ${source.filePath}`)
  })
  .catch(err => {
    console.log(err);
  })
})

// db.createUser(
//   {
//     user: "language_eu",
//     pwd: "ZRohvH6!#HNM",
//     roles: [
//        { role: "readWrite", db: "language_eu" }
//     ]
//   }
// )
