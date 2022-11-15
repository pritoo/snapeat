const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({

    name: {
        type: String
    },
    contact_no: {
        type: Number
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    insta_name: {
        type: Boolean
    },
    food_blogger: {
        type: Boolean
    },
    profile_id: {
        type: String
    },
    loc: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        cordinates: [Number],
    },
    role: {
        type: String, default: "user"
    },
    status: {
        type: Boolean, default: true
    },

    dietaryandothers: {
        type: String
    },

    fav_ingrediants: {
        type: String
    },

    dislike_ingrediants: {
        type: String
    },

    address: [
        {
            house_address: {
                type: String
            },
            street_address: {
                type: String
            },
            postCode: {
                type: String
            },
            contact_no: {
                type: Number
            },
            instructions: {
                type: String
            }
        }
    ]
})



module.exports = mongoose.model("User", userSchema)