const express = require('express')
const app = express()
const request = require('request')
const path = require("path")
const port = process.env.PORT || 5400
const fetch = require('node-fetch')
const snoowrap = require('snoowrap')
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
const { createClient } = require('pexels')
const client = createClient(process.env.pexel_api_key)


let query 
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
app.set('view engine', 'ejs')
app.get('/status', async (req, res) => {
    return res.sendStatus(200)
})
app.get('/', async (req, res) => {
  res.sendFile(__dirname+'/Pixelatlas.html')
})

app.set("views", path.join(__dirname, "views"))

app.get('/weather', async (req, res) => {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.weather_api_key}&q=${req.query.name}`)
    let data = await response.json();

    if(!data.location) return res.json({error: "Location not found"})
   data = {
    info: {
        location: data.location.name,
        country: data.location.country,
        region: data.location.region,
    },
    weather: {
        temp_c: data.current.temp_c,
        temp_f: data.current.temp_f,
        feels_c: data.current.feelslike_c,
        feels_f: data.current.feelslike_f,
        condition: data.current.condition.text,
        wind_kph: data.current.wind_kph,
        wind_mph: data.current.wind_mph,
        humidity: data.current.humidity,
        icon: `https:${data.current.condition.icon}`
    }


}
   res.render('index', 
   {name: capitalizeFirstLetter(req.query.name.toLowerCase()),
    location: data.info.location,
    country: data.info.country,
    region: data.info.region,
    temp_c: data.weather.temp_c,
    temp_f: data.weather.temp_f,
    condition: data.weather.condition,
    wind: data.weather.wind_mph,
    humid: data.weather.humidity,
    icon: data.weather.icon
})
})


app.get('/image.png', async (req, res) => {
    client.photos.search({query: "nature", page: Math.floor(Math.random() * 100), orientation: 'landscape'}).then(photos => {
    let image = photos.photos[Math.floor(Math.random() * photos.photos.length)].src.original
    request({
        url: image,
        encoding: null
    }, (err, resp, buffer) => {
        res.set('Content-Type', 'image/png')
        res.end(buffer)
    })
    })
   
})

app.get('/icon.png', async (req, res) => {
    let response  = await fetch(`./data/weather/?location=${query}`)
    response = await response.json()
    request({
        url: response.weather.icon,
        encoding: null
    }, (err, resp, buffer) => {
        res.set('Content-Type', 'image/png')
        res.end(buffer)
    })
})

