if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const earthExplorerRoutes = require('./routes/earthExplorer');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbUrl = process.env.DB_URL;
const session = require('express-session');
const MongoDBStore = require("connect-mongo"); 
const localDBUrl = 'mongodb://127.0.0.1:27017/planetFB';

mongoose.connect(dbUrl)
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
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret,
    }
});

store.on('error', () => {
    console.log('session store error!');
});

const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://kit.fontawesome.com/",
    "https://fonts.google.com/",
    "https://fonts.gstatic.com",
    " https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [
    "https://fonts.gstatic.com/",
];

const cloudinaryEnv = process.env.CLOUDINARY_CLOUD_NAME;

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${cloudinaryEnv}/`,
                "https://images.unsplash.com/",
                "https://www.pexels.com/",
                "https://fontawesome.com/",
                "https://source.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'), 
        warming: req.flash('warming'), 
        currentUser: req.user,
    };

    for (let key in messages) {
        res.locals[key] = messages[key];
    }

    next();
});

app.use('/earthExplorer', earthExplorerRoutes);
app.use('/earthExplorer/:id/reviews', reviewsRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('./home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        message = 'something went wrong!';
    }
    res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});