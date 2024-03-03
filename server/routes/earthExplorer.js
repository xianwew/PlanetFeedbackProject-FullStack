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
    .post(isLoggedIn, upload.array('image'), validatePin, catchAsync(earthExplorers.createNewPin));
        // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.files);
    //     res.send('it worked!');
    // });

router.get('/newPin', isLoggedIn, earthExplorers.new);

router.route('/:id')
    .get(catchAsync(earthExplorers.viewPin))
    .put(isLoggedIn, upload.array('image'), validatePin, isAuthor, catchAsync(earthExplorers.postEdit))
    .delete(isLoggedIn, isAuthor, catchAsync(earthExplorers.deletePin));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(earthExplorers.editPin));

module.exports = router;