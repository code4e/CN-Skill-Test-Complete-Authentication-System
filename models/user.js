const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//plug in the static method utility of findOrCreate
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = User;