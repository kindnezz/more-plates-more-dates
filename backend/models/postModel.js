var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    'name': String,
    'description': String,
    'tags': Array,
    'link': String,
    'postedBy': {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    'views': Number,
    'rating': Number,
    'reports': Number,
    'inappropriate' : Boolean,
    'date': Date,
    'location': {
        type: {
            type: String,  // We'll use 'Point' for the type
            enum: ['Point'], // Ensures the type is always 'Point'
            required: true
        },
        coordinates: {
            type: [Number],  // An array of two numbers (longitude and latitude)
            required: true
        }
    }
});
postSchema.index({ location: '2dsphere' });
postSchema.pre('save', function (next) {
    var photo = this;
    var tags = photo.tags[0].split(' ')

    tags.forEach((tag, index) => {
        photo.tags[index] = tag;
    });
    next();
});

var Post = mongoose.model('post', postSchema);
module.exports = Post;
