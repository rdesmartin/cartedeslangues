$(document).ready(() => {

  // Side panel functions

  var panel = document.getElementById('sidepanel')
  var chartTitle = document.getElementById('chartTitle')
  var chart = document.getElementById('chart')
  var myChart = new Chart(chart, {
    type: 'horizontalBar',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        display: false
      },
      responsive: true,
      aspectRatio: 1,
      animation: {
        duration: 0
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  })

  const removeChartData = () => {
    myChart.data.labels = []
    myChart.data.datasets.forEach((dataset) => {
      dataset.data = []
      dataset.backgroundColor = []
    })
    myChart.update()
  }

  const addChartData = (label, data, color) => {
    myChart.data.labels.push(label)
    myChart.data.datasets.forEach((dataset) => {
        dataset.data.push(data)
        dataset.backgroundColor.push(color)
    })
    myChart.update()
  }

  const updateSidePanel = () => {
    if (!currentCountry) return

    var formVal = getFormValues()

    $.get(`/country/${currentCountry.ISO_A3}`, data => {
      // filter data by current selected options
      data = data.filter(el => el.native === formVal.native && el.ageGroup === formVal.ageGroup)
      data = data.sort((a, b) => b.value - a.value)

      var title = `5 langues ${formVal.native ? 'maternelles' : 'parlées'} les
       plus courantes en ${countryCodes[currentCountry.ISO_A3]}
       (${formVal.ageGroup} ans)`
      chartTitle.innerHTML = title

      removeChartData()
      data.forEach(el => {
        var color = el.langCode == formVal.langCode ? 'rgba(54, 162, 235, 1)' : 'rgba(54, 162, 235, 0.2)'
        addChartData(langCodes[el.langCode], el.value, color)
      })
    })
  }

  const showSidePanel = (e) => {
    panel.style.right = "0"
  }

  const hideSidePanel = (e) => {
    panel.style.right = "-300px"
  }
  $('#closepanel').click(e => hideSidePanel(e))


  // Leaflet

  var mymap = L.map('map', {
    minZoom: 4,
    maxZoom: 6,
    maxBounds: [
      [80, -50],
      [0, 70]
    ]
  }).setView([58, 5], 4)

  var mbtoken = "pk.eyJ1IjoicmRlcyIsImEiOiJja2Z3bnozaDcwMW41MnJyd3FpdmFqemZoIn0.zhDiA5J4lnu3cEnUzVQZyA"

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mbtoken
  }).addTo(mymap)

  const defaultColor = (code) => {
    // if (code.length < 3) return console.error("invalid country code: " + code)
    // var range = [0, 256]
    // var g = (i) => ~~((code[i].charCodeAt(0) - 'A'.charCodeAt(0)) * (range[1] - range[0]) / 26) + range[0]
    // var color = "rgb(" + g(0) + "," + g(1) + "," + g(2) +")"
    // return color
    return "#FFF"
  }

  const generateColorScale = (value) => {
    if (value == 0) {
      return "#f7fbff"
    } else if (value < 1) {
      return "#deebf7"
    } else if (value < 5) {
      return "#c6dbef"
    } else if (value < 15) {
      return "#9ecae1"
    } else if (value < 20) {
      return "#6baed6"
    } else if (value < 30) {
      return "#4292c6"
    } else if (value < 50) {
      return "#2171b5"
    } else if (value < 75) {
      return "#08519c"
    } else {
      return "#08306b"
    }
  }

  const defaultStyle = (feature) => ({
    fillColor: defaultColor(feature.properties.ISO_A3),
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  })

  var currentCountry=null
  var currentData = null
  var geojsonLayer

  const style = (feature) => {
    const data = currentData
    if (!data) return defaultStyle(feature)
    var s = {
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    }
    var d = data.find(el => el.countryCode === feature.properties.ISO_A3)
    s.fillColor = generateColorScale(d ? d.value : 0)
    return s
  }

  const tooltipContent = (caller) => {
    const properties = caller.feature.properties
    if (!currentData) {
      return properties.ADMIN
    } else {
      data = currentData.find(e => e.countryCode === properties.ISO_A3)
      if (!data) return 'NA'
      return data.value.toString()
    }
  }

  const onEachFeature = (feature, layer) => {
    layer.bindTooltip(tooltipContent, {
      sticky: true,
    })

    layer.on({
      mouseover: e => {
        e.target.setStyle({
          weight: 3,
          color: 'white',
          fillOpacity: 0.7
        })
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          e.target.bringToFront()
        }
      },
      mouseout: e => geojsonLayer.resetStyle(e.target),
      click: e => {
        currentCountry = feature.properties
        updateSidePanel()
        showSidePanel(e)
      }
    })
  }

  $.get('/borders/eu', borders => {
    geojsonLayer = L.geoJson(borders, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(mymap)
    updateMap()
  })


  // Navigation bar behavior

  const findSelection = (field) => {
    var test = document.getElementsByName(field)
    var sizes = test.length
    for (i=0; i < sizes; i++) {
      if (test[i].checked==true) {
        return test[i].value
      }
    }
  }

  const getFormValues = () => ({
    langCode: document.getElementById('langcodeselect').value,
    ageGroup: findSelection('agegroup'),
    native: document.getElementById('nativecheckbox').checked
  })

  const updateMap = () => {
    // get form values
    var formVal = getFormValues()
    if (!formVal.langCode || !formVal.ageGroup) {
      return
    }
    // send request
    $.get(`/langdata?native=${encodeURIComponent(formVal.native)}&langCode=${encodeURIComponent(formVal.langCode)}&ageGroup=${encodeURIComponent(formVal.ageGroup)}`, data => {
      currentData = data
      geojsonLayer.setStyle(style)
    })
  }

  $('#optionForm').on('change', e => {
    updateSidePanel()
    updateMap()
  })
})
