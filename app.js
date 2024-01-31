const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const earthExplorer = require('./routes/earthExplorer');
const reviews =  require('./routes/reviews');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://127.0.0.1:27017/planetFB')
    .then(() => { console.log('connection opened!'); })
    .catch((e) => {
        console.log('error!');
        console.log(e);
    });

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use('/earthExplorer', earthExplorer);
app.use('/earthExplorer/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.send('It is working!');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message){
        message = 'something went wrong!';
    }
    res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});