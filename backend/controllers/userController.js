var UserModel = require('../models/userModel.js');
var PostModel = require('../models/postModel.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    listByRating: function (req, res) {
        UserModel.find()
            .sort({ rating: -1 })
            .exec(async function (err, users) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }

                // Create an array to store user ratings after processing
                var updatedUsers = [];

                // Loop through the users to calculate their updated ratings
                for (const user of users) {
                    // Find all posts by the user
                    const userPosts = await PostModel.find({ postedBy: user._id });

                    if (userPosts.length > 0) {
                        // Calculate the average rating of the user's posts
                        const totalRating = userPosts.reduce((sum, post) => sum + post.rating, 0);
                        const averageRating = totalRating / userPosts.length;

                        // Update the user's rating
                        user.rating = averageRating;
                        updatedUsers.push(user);
                    }



                }

                // updatedUsers = updatedUsers.concat(updatedUsers, updatedUsers);
                // updatedUsers = updatedUsers.concat(updatedUsers, updatedUsers);
                updatedUsers.sort((a, b) => b.rating - a.rating);
                return res.json(updatedUsers);
            });
    },

    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    create: function (req, res) {
        var user = new UserModel({
            username : req.body.username,
            password : req.body.password,
            email : req.body.email,
            posts : 0,
            likes : 0,
            reports : 0
            // liked : []
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            return res.status(201).json(user);
            //return res.redirect('/users/login');
        });
    },

    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
            user.password = req.body.password ? req.body.password : user.password;
            user.email = req.body.email ? req.body.email : user.email;
            user.liked = req.body.liked ? req.body.liked : user.liked;
            user.reported = req.body.reported ? req.body.reported : user.reported;
            user.posts = req.body.posts ? req.body.posts : user.posts;
            user.likes = req.body.likes ? req.body.likes : user.likes;
            user.reports = req.body.reports ? req.body.reports : user.reports;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    showRegister: function(req, res){
        res.render('user/register');
    },

    showLogin: function(req, res){
        res.render('user/login');
    },

    login: function(req, res, next){
        UserModel.authenticate(req.body.username, req.body.password, function(err, user){
            if(err || !user){
                var err = new Error('Wrong username or password');
                err.status = 401;
                return next(err);
            }
            req.session.userId = user._id;
            //res.redirect('/users/profile');
            return res.json(user);
        });
    },

    profile: function(req, res,next){
        UserModel.findById(req.session.userId)
            .exec(async function(error, user){
                if(error){
                    return next(error);
                } else{
                    if(user===null){
                        var err = new Error('Not authorized, go back!');
                        err.status = 400;
                        return next(err);
                    } else{
                        //return res.render('user/profile', user);
                        var users = [user];
                        var updatedUsers = [];

                        // Loop through the users to calculate their updated ratings
                        for (const user of users) {
                            // Find all posts by the user
                            const userPosts = await PostModel.find({ postedBy: user._id });

                            if (userPosts.length > 0) {
                                // Calculate the average rating of the user's posts
                                const totalRating = userPosts.reduce((sum, post) => sum + post.rating, 0);
                                const averageRating = totalRating / userPosts.length;

                                // Update the user's rating
                                user.rating = averageRating;
                                updatedUsers.push(user);
                            }
                        }

                        return res.json(updatedUsers[0]);
                        /*const userPosts =  PostModel.find({ postedBy: user._id });

                        if (userPosts.length > 0) {
                            const totalRating = userPosts.reduce((sum, post) => sum + post.rating, 0);
                            const averageRating = totalRating / userPosts.length;

                            // Update the user's rating
                            user.rating = averageRating;
                            console.log(user)
                            return res.json(user);
                        }
                        return res.json(user);*/


                    }
                }
            });
    },

    logout: function(req, res, next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else{
                    //return res.redirect('/');
                    return res.status(201).json({});
                }
            });
        }
    }
};
