const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validatePin, isAuthor} = require('../middleware');
const earthExplorers = require('../controllers/earthExplorer');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(earthExplorers.index))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send('it worked!');
    });
    // .post(isLoggedIn, validatePin, catchAsync(earthExplorers.createNewPin));

router.get('/newPin', isLoggedIn, earthExplorers.new);

router.route('/:id')
    .get(catchAsync(earthExplorers.viewPin))
    .put(isLoggedIn, validatePin, isAuthor, catchAsync(earthExplorers.postEdit))
    .delete(isLoggedIn, isAuthor, catchAsync(earthExplorers.deletePin));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(earthExplorers.editPin));

module.exports = router;