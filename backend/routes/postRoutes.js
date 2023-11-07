var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var router = express.Router();
var postController = require('../controllers/postController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', postController.list);

router.get('/within/:dist/:p1/:p2', postController.withinRadius);
router.get('/oneNear/:p1/:p2', postController.oneNear);
router.get('/listByLocation/:p1/:p2/:offset', postController.listByLocation);

router.get('/user/:userId', postController.listByUser);
router.get('/:limit/:offset', postController.listForInfiniteScroll);

router.get('/:id', postController.show);

router.post('/', requiresLogin, upload.single('image'), postController.create);

router.put('/:id', postController.update);

router.delete('/:id', postController.remove);

router.put('/rate/:id', requiresLogin, postController.rate);

// router.put('/report/:id', requiresLogin, postController.report);
// router.get('/votes', postController.listByVotesDecaying);
// router.post('/listByTags', requiresLogin, postController.listByTags);

module.exports = router;
