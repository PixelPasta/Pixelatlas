const express = require('express')
const app = express()
const request = require('request')
const port = process.env.PORT || 5400
const fetch = require('node-fetch')
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})

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

app.get('/weather', async (req, res) => {
   let data = await fetch(`https://pixel-api-production.up.railway.app/data/weather/?location=${req.query.name}`)
   data = await data.json()
  if (data.error) return res.render('404')
   query = req.query.name
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
    let response  = await fetch(`https://www.reddit.com/r/EarthPorn/random/.json`)
    response = await response.json()
    request({
        url: response[0].data.children[0].data.url,
        encoding: null
    }, (err, resp, buffer) => {
        res.set('Content-Type', 'image/jpeg')
        res.end(buffer)
    })
   
})

app.get('/icon.png', async (req, res) => {
    let response  = await fetch(`https://pixel-api-production.up.railway.app/data/weather/?location=${query}`)
    response = await response.json()
    request({
        url: response.weather.icon,
        encoding: null
    }, (err, resp, buffer) => {
        res.set('Content-Type', 'image/png')
        res.end(buffer)
    })
})