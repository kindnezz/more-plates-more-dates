var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController.js');

/**
 * @swagger
 * /comments:
 *   get:
 *     tags:
 *       - Comments
 *     description: Use to request all comments
 */
router.get('/', commentController.list);

/**
 * @swagger
 * /comments/photo/{id}:
 *   get:
 *     tags:
 *       - Comments
 *     description: Use to request all comments for a photo
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the photo to get comments for
 *         required: true
 *         type: string
 *         format: uuid
 *         example: 5f9d88b3c4b9e00017a9d1a0
 */
router.get('/photo/:id', commentController.listPhoto);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     tags:
 *       - Comments
 *     description: Use to request a comment by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the comment to get
 *         required: true
 *         type: string
 *         format: uuid
 *         example: 5f9d88b3c4b9e00017a9d1a0
 */
router.get('/:id', commentController.show);

/**
 * @swagger
 * /comments:
 *   post:
 *     tags:
 *       - Comments
 *     description: Use to create a comment
 */
router.post('/', commentController.create);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     tags:
 *       - Comments
 *     description: Use to update a comment by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the comment to update
 *         required: true
 *         type: string
 *         format: uuid
 *         example: 5f9d88b3c4b9e00017a9d1a0
 */
router.put('/:id', commentController.update);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     tags:
 *       - Comments
 *     description: Use to delete a comment by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the comment to delete
 *         required: true
 *         type: string
 *         format: uuid
 *         example: 5f9d88b3c4b9e00017a9d1a0
 */
router.delete('/:id', commentController.remove);

module.exports = router;
