const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

/**
 * Passport-Local Mongoose will add a username, hash and salt field 
 * to store the username, the hashed password and the salt value.
 * Additionally Passport-Local Mongoose adds some methods to our Schema.
 */
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);