const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        sparse: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === 'local'
        },
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'apple'],
        default: 'local',
    },
    socialId: {
        type: String, 
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema)