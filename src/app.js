const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('views', viewsPath)
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Tshepiso Makuru'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is a help page. Click here for more details',
        title: 'help',
        name: 'Tshepiso Makuru'
    })
})
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Tshepiso Makuru'
    })
})
app.get('/weather', (req, res) => {
    const address = req.query.address
    if(!address){
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(address, (error, {latitude, longitude, location} = {}) => {
        
        if(error){
            return res.send({error})
        }
       
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({ error })
            }  
            res.send({
                location,
                forecast: forecastData,
                address
            })

          })


    })

 
})


app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    //console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Tshepiso Makuru',
        errorMessage: 'Help article not found.'
     })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Tshepiso Makuru',
        errorMessage: 'Page not found.'
    })
})

//The last thing to do is start the server. This is done by calling app.listen with the port 
//you want to listen on.
app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})