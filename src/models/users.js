const mongoose = require('mongoose');
const validator = require('validator');


const User = mongoose.model('User',
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must be positve number');
                }
            }
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 6,
            validate(value){
                var inValid = value.includes('password');
                if (inValid) {
                    throw new Error('Password cannot contain the word password');
                }
            }
        }
    });


    module.exports = User