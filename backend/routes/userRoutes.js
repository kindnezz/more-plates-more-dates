var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Use to request all users
 */
router.get('/', userController.list);

router.get('/details', userController.listWithDetails);

router.get('/verify/:id', userController.verifyUser);
router.get('/ban/:id', userController.banUser);

/**
 * @swagger
 * /users/leaderboard:
 *   get:
 *     tags:
 *       - Users
 *     description: Use to request all users ordered by rating
 */
router.get('/leaderboard', userController.listByRating);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags:
 *       - Users
 *     description: Use to request the profile of the current user
 */
router.get('/profile', userController.profile);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     tags:
 *       - Users
 *     description: Use to logout the current user
 */
router.get('/logout', userController.logout);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Use to request a user by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to get
 *         required: true
 *         type: string
 *         format: uuid
 *         example: 5f9d88b9c4b9e3b3c8a0b0a0 (check MongoDB for an existing user ID)
 */
router.get('/:id', userController.show);

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     description: Use to create a new user
 */
router.post('/', userController.create);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     description: Use to login a user
 */
router.post('/login', userController.login);

router.post('/loginAdmin', userController.loginAsAdmin);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: Use to update a user
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
 *         required: true
 *         type: string
 *         format: uuid
 *         example: 5f9d88b9c4b9e3b3c8a0b0a0 (check mongoDB for an existing user ID)
 */
router.put('/:id', userController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Use to delete a user
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete
 *         required: true
 *         type: string
 *         format: uuid
 *         example: 5f9d88b9c4b9e3b3c8a0b0a0 (check mongoDB for an existing user ID)
 */
router.delete('/:id', userController.remove);

module.exports = router;
