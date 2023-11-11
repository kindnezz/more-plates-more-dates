var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
var upload = multer({ dest: 'public/images/' });

var router = express.Router();
var postController = require('../controllers/postController.js');

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *       - Posts
 *     description: Use to request all posts
 */
router.get('/', postController.list);

/**
 * @swagger
 * /posts/within/{dist}/{p1}/{p2}:
 *   get:
 *     tags:
 *       - Posts
 *     description: Use to request all posts within a certain distance from a point
 *     parameters:
 *       - name: dist
 *         description: Distance in meters
 *         in: path
 *         required: true
 *       - name: p1
 *         description: Latitude
 *         in: path
 *         required: true
 *       - name: p2
 *         description: Longitude
 *         in: path
 *         required: true
 */
router.get('/within/:dist/:p1/:p2', postController.withinRadius);

/**
 * @swagger
 * /posts/oneNear/{p1}/{p2}:
 *   get:
 *     tags:
 *       - Posts
 *     description: Use to request the nearest post to a point
 *     parameters:
 *       - name: p1
 *         description: Latitude
 *         in: path
 *         required: true
 *       - name: p2
 *         description: Longitude
 *         in: path
 *         required: true
 */
router.get('/oneNear/:p1/:p2', postController.oneNear);

/**
 * @swagger
 * /posts/listByLocation/{p1}/{p2}/{offset}:
 *   get:
 *     tags:
 *       - Posts
 *     description: Use to request all posts ordered by distance from a point
 *     parameters:
 *       - name: p1
 *         description: Latitude
 *         in: path
 *         required: true
 *       - name: p2
 *         description: Longitude
 *         in: path
 *         required: true
 *       - name: offset
 *         description: Offset from which to return posts
 *         in: path
 *         required: true
 */
router.get('/listByLocation/:p1/:p2/:offset', postController.listByLocation);

/**
 * @swagger
 * /posts/user/{userId}:
 *   get:
 *     tags:
 *       - Posts
 *     description: Use to request all posts by a user
 *     parameters:
 *       - name: userId
 *         description: User id
 *         in: path
 *         required: true
 */
router.get('/user/:userId', postController.listByUser);

/**
 * @swagger
 * /posts/{limit}/{offset}:
 *   get:
 *     tags:
 *       - Posts
 *     description: Use to request a certain number of posts from a certain offset
 *     parameters:
 *       - name: limit
 *         description: Number of posts to return
 *         in: path
 *         required: true
 *       - name: offset
 *         description: Offset from which to return posts
 *         in: path
 *         required: true
 */
router.get('/:limit/:offset', postController.listForInfiniteScroll);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     description: Use to request a post by id
 *     parameters:
 *       - name: id
 *         description: Post id
 *         in: path
 *         required: true
 */
router.get('/:id', postController.show);

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *       - Posts
 *     description: Use to create a new post
 */
router.post('/', requiresLogin, upload.single('image'), postController.create);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     tags:
 *       - Posts
 *     description: Use to update a post by id
 *     parameters:
 *       - name: id
 *         description: Post id
 *         in: path
 *         required: true
 */
router.put('/:id', postController.update);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     description: Use to delete a post by id
 *     parameters:
 *       - name: id
 *         description: Post id
 *         in: path
 *         required: true
 */
router.delete('/:id', postController.remove);

/**
 * @swagger
 * /posts/rate/{id}:
 *   put:
 *     tags:
 *       - Posts
 *     description: Use to rate a post by id
 *     parameters:
 *       - name: id
 *         description: Post id
 *         in: path
 *         required: true
 */
router.put('/rate/:id', requiresLogin, postController.rate);

module.exports = router;
