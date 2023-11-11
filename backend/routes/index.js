var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Home
 *     description: Use to request the home page
 */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
