// schema.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'User ID is required'],
        unique: true,
        min: [1, 'User ID must be a positive number'],
    },
    first_name: {
        type: String,
        required: [true, 'First name is required'],
        minLength: [1, 'First name must have at least 1 character'],
        maxLength: [100, 'First name must have at most 100 characters'],
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        minLength: [1, 'Last name must have at least 1 character'],
        maxLength: [100, 'Last name must have at most 100 characters'],
    },
    birthday: {
        type: String,
        required: [true, 'Birthday is required'],
    }
}, { collection: 'users' });

const calorieSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, 'User ID is required'],
        min: [1, 'User ID must be a positive number'],
        index: true
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1900, 'Year must be greater than or equal to 1900'],
        max: [new Date().getFullYear(), `Year must be less than or equal to ${new Date().getFullYear()}`],
        index: true
    },
    month: {
        type: Number,
        required: [true, 'Month is required'],
        min: [1, 'Month must be between 1 and 12'],
        max: [12, 'Month must be between 1 and 12'],
        index: true
    },
    day: {
        type: Number,
        required: [true, 'Day is required'],
        min: [1, 'Day must be between 1 and 31'],
        max: [31, 'Day must be between 1 and 31'],
    },
    id: {
        type: Number,
        required: [true, 'ID is required'],
        min: [1, 'ID must be a positive number'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minLength: [1, 'Description must have at least 1 character'],
        maxLength: [1000, 'Description must have at most 1000 characters'],
    },
    category: {
        type: String,
        enum: {
            values: ['breakfast', 'lunch', 'dinner', 'other'],
            message: 'Invalid category',
        },
        required: [true, 'Category is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be a non-negative number'],
    }
}, { versionKey: false });

const schemas = {
    users: mongoose.model('users', userSchema),
    calories: mongoose.model('calories', calorieSchema)
};

module.exports = schemas;
