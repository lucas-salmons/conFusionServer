/**Favorites */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //dishes stored as an array as many dishes are available per user
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    ]
}, {
    usePushEach: true,
    timestamps: true
});

Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;