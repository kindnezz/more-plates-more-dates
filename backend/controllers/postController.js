var PostModel = require('../models/postModel.js');
const UserModel = require("../models/userModel");
const decay = require("decay");
var mongoose = require('mongoose');
const {query} = require("express");

/**
 * postController.js
 *
 * @description :: Server-side logic for managing posts.
 */
module.exports = {

    list: function (req, res) {

        PostModel.find({'inappropriate': "false", 'reports': { $lte: 10 }})
            .sort({date: 'desc'})
            .populate('postedBy')
            .exec(function (err, posts) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting post.',
                        error: err
                    });
                }
                var data = [];
                data.posts = posts;
                return res.json(posts);
            });
    },

    oneNear: function (req, res) {
        var latitude = req.params.p1;
        var longitude = req.params.p2;
        console.log(req.params)
        PostModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude,latitude],
                    },
                },
            },
            inappropriate: false,
            reports: { $lte: 10 }
        })
            .sort({ distance: 1 })
            .limit(1)
            .populate('postedBy')
            .exec(function (err, posts) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting post.',
                        error: err
                    });
                }
                var data = [];
                data.posts = posts;
                console.log(posts)
                return res.json(posts);
            });
    },
    withinRadius: function (req, res) {
        var dist = req.params.dist;
        var latitude = req.params.p1;
        var longitude = req.params.p2;

        console.log(req.params)


        PostModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude,latitude]
                    },
                    $maxDistance: dist * 1000
                }
            },
                reports: { $lte: 10 }}
            )
            .sort({ distance: 1 })
            .populate('postedBy')
            .exec(function (err, posts) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting post.',
                        error: err
                    });
                }
                var data = [];
                data.posts = posts;
                return res.json(posts);
            });
    },
     listByLocation: function (req, res) {
        console.log(req.params)
         var latitude = req.params.p1;
         var longitude = req.params.p2;
         const  limitValue = 1;
         const  offset = req.params.offset;


         const offsetValue = parseInt(offset, 10);

         if (isNaN(limitValue) || isNaN(offsetValue)) {
             return res.status(400).json({ message: 'Invalid limit or offset values' });
         }

         PostModel.find({
             location: {
                 $near: {
                     $geometry: {
                         type: "Point",
                         coordinates: [longitude,latitude],
                     },
                 },
             },
             inappropriate: false,
             reports: { $lte: 10 }
         })
             .sort({ distance: 1 })
             .skip(offsetValue)
             .limit(limitValue)
             .populate('postedBy')
             .exec(function (err, posts) {
                 if (err) {
                     return res.status(500).json({
                         message: 'Error when getting post.',
                         error: err
                     });
                 }
                 var data = [];
                 data.posts = posts;
                 return res.json(posts);
             });
     },

    listForInfiniteScroll: function (req, res) {
        const  limit = req.params.limit;
        const  offset = req.params.offset;

        try {
            const limitValue = parseInt(limit, 10);
            const offsetValue = parseInt(offset, 10);

            if (isNaN(limitValue) || isNaN(offsetValue)) {
                return res.status(400).json({ message: 'Invalid limit or offset values' });
            }

            PostModel.find({ 'inappropriate': false })
                .sort({ date: 'desc' })
                .skip(offsetValue)
                .limit(limitValue)
                .populate('postedBy')
                .then(posts => {
                    return res.json(posts);
                })
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting posts.',
                error: err
            });
        }
    },




    listByUser: function (req, res) {
        var user_id = req.params.userId;
        console.log("user_id: " + user_id);

        PostModel.find({ 'postedBy': user_id, 'reports': { $lte: 10 } })
            .sort({ date: 'desc' })
            .populate('postedBy')
            .exec(function (err, posts) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting posts.',
                        error: err
                    });
                }
                var data = {};
                data.posts = posts;
                return res.json(posts);
            });
    },

    show: function (req, res) {
        var id = req.params.id;

        PostModel.findOne({_id: id, 'reports': { $lte: 10 }})
            .populate('postedBy')
            .exec(async function (err, post) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting post.',
                        error: err
                    });
                }

                if (!post) {
                    return res.status(404).json({
                        message: 'No such post'
                    });
                }

                await PostModel.findOneAndUpdate({_id: id}, {$inc: {'views': 1}})
                    .exec();

                return res.json(post);
            });
    },

    create: function (req, res) {
        var post = new PostModel({
            name: req.body.name,
            link: req.body.link,
            postedBy: req.session.userId,
            views: 0,
            rating: 5,
            reports: 0,
            numberOfRatings: 0,
            inappropriate: false,
            date: new Date(),
            description: req.body.description,
            tags: req.body.tags,
            location: {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude] // Replace with actual coordinates
            }
        });

        UserModel.findOneAndUpdate({_id: req.session.userId}, {$inc: {'posts': 1}})
            .exec();

        post.save(function (err, post) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating post',
                    error: err
                });
            }

            return res.status(201).json(post);
        });
    },

    update: function (req, res) {
        var id = req.params.id;

        PostModel.findOne({_id: id}, function (err, post) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting post',
                    error: err
                });
            }

            if (!post) {
                return res.status(404).json({
                    message: 'No such post'
                });
            }

            post.name = req.body.name ? req.body.name : post.name;
            post.link = req.body.link ? req.body.link : post.link;
            post.postedBy = req.body.postedBy ? req.body.postedBy : post.postedBy;
            post.views = req.body.views ? req.body.views : post.views;
            post.rating = req.body.rating ? req.body.rating : post.rating;
            post.date = req.body.date ? req.body.date : post.date;
            post.description = req.body.description ? req.body.description : post.description;
            post.tags = req.body.tags ? req.body.tags : post.tags;
            post.reports = req.body.reports ? req.body.reports : post.reports;
            post.inappropriate = req.body.inappropriate ? req.body.inappropriate : post.inappropriate;

            post.save(function (err, post) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating post.',
                        error: err
                    });
                }

                return res.json(post);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        PostModel.findByIdAndRemove(id, function (err, post) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the post.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    rate: function (req, res) {
        var id = req.params.id;
        var rating = req.body.rating;

        UserModel.findOne({ _id: req.session.userId }, async function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            // Check if there's a liked item with the specified itemId
            const likedItem = user.liked.find((item) => item.id === id);

            const post = await PostModel.findOne({ _id: id });

            if (!post) {
                console.log(`Post with ID ${id} not found.`);
                return res.status(404).json({
                    message: `Post with ID ${id} not found.`
                });
            }

            if (!likedItem) {
                console.log("post.rating", post.rating);
                if(post.numberOfRatings === undefined)
                    post.numberOfRatings = 0;
                post.numberOfRatings += 1;
                console.log("post.numberOfRatings", post.numberOfRatings);
                post.rating = (parseInt(rating, 10) + parseInt(post.rating, 10) * post.numberOfRatings) / (post.numberOfRatings + 1);

                console.log("rating", rating);
                console.log("final post.rating", post.rating);


                 post.save(async function (err, photo) {
                     if (err) {
                         return res.status(500).json({
                             message: 'Error when updating Post.',
                             error: err
                         });
                   }

                     UserModel.findOneAndUpdate({ _id: req.session.userId }, { $addToSet: { liked: { id, rating } } })
                         .exec();

                     return res.json(photo);
                });/**/
            }
        });
    },

    report: function (req, res) {
        var id = req.params.id;

        PostModel.findOne({_id: id})
            .populate('postedBy')
            .exec({_id: id}, function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo',
                        error: err
                    });
                }

                if (!photo) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }

                UserModel.findOne({_id: req.session.userId}, function (err, user) {
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

                    if (user.reported.includes(id)) {
                        photo.reports -= 1;
                        UserModel.findOneAndUpdate({_id: req.session.userId}, {$pull: {reported: id}})
                            .exec();
                        UserModel.findOneAndUpdate({_id: photo.postedBy}, {$inc: {'reports': -1}})
                            .exec();

                        photo.save(function (err, photo) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when updating photo.',
                                    error: err
                                });
                            }
                            return res.json(photo);
                        });
                    } else {
                        photo.reports += 1;

                        if (photo.reports >= 10) {
                            photo.inappropriate = true;
                        }

                        UserModel.findOneAndUpdate({_id: req.session.userId}, {$addToSet: {reported: id}})
                            .exec();

                        UserModel.findOneAndUpdate({_id: photo.postedBy}, {$inc: {'reports': 1}})
                            .exec();

                        photo.save(function (err, photo) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when updating photo.',
                                    error: err
                                });
                            }
                            return res.json(photo);
                        });
                    }
                });
            });
    },
};
