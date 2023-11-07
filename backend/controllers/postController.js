

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

        PostModel.find({'inappropriate': "false"})
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
        var p1 = req.params.p1;
        var p2 = req.params.p2;
        console.log(req.params)


        PostModel.findOne({location: {$near: { $geometry: {type: "Point", coordinates: [p1, p2]}}}})
            .sort({date: 'desc'})
            .populate('postedBy')
            .exec(function (err, post) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting post.',
                        error: err
                    });
                }
                var data = [];
                data.posts = [post];
                return res.json(data.posts);
            });
    },
    withinRadius: function (req, res) {
        var dist = req.params.dist;
        var p1 = req.params.p1;
        var p2 = req.params.p2;


        console.log(req.params)

        PostModel.find({location: {$geoWithin: { $centerSphere: [ [ p1, p2 ], dist*0.621371/3963.2] }}})
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
     listByLocation: function (req, res) {
        console.log(req.params)
         var p1 = req.params.p1;
         var p2 = req.params.p2;
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
                         coordinates: [p1, p2],
                     },
                 },
             },
             inappropriate: false, // Add any additional filters you need
         })
             .sort({ distance: 1 })
             //.skip(offsetValue)
             //.limit(limitValue)
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

        PostModel.find({ 'postedBy': user_id })
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

        PostModel.findOne({_id: id})
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
            inappropriate: false,
            date: new Date(),
            description: req.body.description,
            tags: req.body.tags,
            location: {
                type: 'Point',
                coordinates: [req.body.latitude, req.body.longitude] // Replace with actual coordinates
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
        console.log(rating);



        UserModel.findOne({_id: req.session.userId}, async function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            // Check if there's a liked item with the specified itemId
            const likedItem = user.liked.find((item) => item.id === id);
            const likedItemIndex = user.liked.findIndex((item) => item.id === id);

            const post = await PostModel.findOne({_id: id});

            if (!post) {
                console.log(`Post with ID ${id} not found.`);
                return;
            }

            if (likedItem) {
                console.log(`Rating for item with ID ${id}: ${likedItem.rating}`);
                const originalRating = 2 * post.rating - likedItem.rating;

                // if (originalRating !== 0) {
                //     post.rating = (originalRating + rating) / 2;
                // } else {
                //     // If rating is 0, keep the original rating
                //     post.rating = rating;
                // }

                console.log(post.rating, rating, originalRating)
                post.rating = (originalRating + rating) / 2;

                post.save(async function (err, photo) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating photo.',
                            error: err
                        });
                    }

                    UserModel.findOneAndUpdate({_id: req.session.userId}, {$pull: {liked: {id}}})
                        .exec();
                    UserModel.findOneAndUpdate({_id: req.session.userId}, {$addToSet: {liked: {id, rating}}})
                        .exec();

                    return res.json(photo);
                });

            } else {
                console.log(`User with ID ${id} has not liked an item with ID ${id}.`);

                // if (post.rating !== 0) {
                //     post.rating = (post.rating + rating) / 2;
                // } else {
                //     // If rating is 0, keep the original rating
                //     post.rating = rating;
                // }
                console.log(post.rating, rating, post.rating + rating)
                post.rating = (post.rating + rating) / 2;


                post.save(function (err, photo) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating photo.',
                            error: err
                        });
                    }

                    UserModel.findOneAndUpdate({_id: req.session.userId}, {$addToSet: {liked: {id, rating}}})
                        .exec();

                    return res.json(photo);
                });
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

                        if (photo.reports >= 3) {
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

    // listByVotesDecaying: function (req, res) {
    //     PostModel.find({'inappropriate': "false"})
    //         .sort({views: 'desc'})
    //         .populate('postedBy')
    //         .exec(function (err, photos) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     message: 'Error when getting photo.',
    //                     error: err
    //                 });
    //             }
    //
    //             var decay = require('decay');
    //             var hHot = decay.hackerHot(1.8)
    //
    //             photos.forEach((photo, index) => {
    //                 photo.score = hHot(photo.likes, photo.date);
    //                 console.log(photo.score)
    //             });
    //
    //             photos.sort((a, b) => b.score - a.score);
    //
    //             return res.json(photos);
    //         });
    // },

    // like: function (req, res) {
    //     var id = req.params.id;
    //
    //     PhotoModel.findOne({_id: id})
    //         .populate('postedBy')
    //         .exec(function (err, photo) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     message: 'Error when getting photo',
    //                     error: err
    //                 });
    //             }
    //
    //             if (!photo) {
    //                 return res.status(404).json({
    //                     message: 'No such photo'
    //                 });
    //             }
    //
    //             UserModel.findOne({_id: req.session.userId}, function (err, user) {
    //                 if (err) {
    //                     return res.status(500).json({
    //                         message: 'Error when getting user.',
    //                         error: err
    //                     });
    //                 }
    //
    //                 if (!user) {
    //                     return res.status(404).json({
    //                         message: 'No such user'
    //                     });
    //                 }
    //
    //                 // var isInArray = user.liked.some(function (_id) {
    //                 //     return _id === id;
    //                 // });
    //
    //                 if (user.liked.includes(id)) {
    //                     photo.likes -= 1;
    //                     UserModel.findOneAndUpdate({_id: req.session.userId}, {$pull: {liked: id}})
    //                         .exec();
    //                     UserModel.findOneAndUpdate({_id: photo.postedBy}, {$inc: {'likes': -1}})
    //                         .exec();
    //
    //                     photo.save(function (err, photo) {
    //                         if (err) {
    //                             return res.status(500).json({
    //                                 message: 'Error when updating photo.',
    //                                 error: err
    //                             });
    //                         }
    //
    //                         return res.json(photo);
    //                     });
    //                 } else {
    //                     photo.likes += 1;
    //                     UserModel.findOneAndUpdate({_id: req.session.userId}, {$addToSet: {liked: id}})
    //                         .exec();
    //                     UserModel.findOneAndUpdate({_id: photo.postedBy}, {$inc: {'likes': 1}})
    //                         .exec();
    //
    //                     photo.save(function (err, photo) {
    //                         if (err) {
    //                             return res.status(500).json({
    //                                 message: 'Error when updating photo.',
    //                                 error: err
    //                             });
    //                         }
    //
    //                         return res.json(photo);
    //                     });
    //                 }
    //             });
    //         });
    // },

    // listByTags: function (req, res) {
    //     var tags = req.body.tags;
    //     var tagsSplit = tags.split(" ");
    //     console.log(tagsSplit);
    //
    //     PostModel.find({'inappropriate': "false"})
    //         .sort({date: 'desc'})
    //         .populate('postedBy')
    //         .exec(function (err, posts) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     message: 'Error when getting post.',
    //                     error: err
    //                 });
    //             }
    //             var postsByTags = [];
    //
    //             if (tags !== "") {
    //                 posts.forEach((post, index) => {
    //                     if (post.tags.some(value => tagsSplit.includes(value))) {
    //                         postsByTags.push(post);
    //                     }
    //                 });
    //             } else {
    //                 postsByTags = posts;
    //             }
    //
    //             return res.json(postsByTags);
    //         });
    // },
};
