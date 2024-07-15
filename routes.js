// Eli Shulman 316040120
// Shahar Ashkenazi 316244060

const express = require('express');
const router = express.Router();
const schemas = require('./schema'); // Assuming schema.js contains your Mongoose schemas
const generateRandomId = require('./utils'); // Assuming utils.js generates unique IDs

// Correct import of models
const User = schemas.users;
const Calorie = schemas.calories;

// Welcome Route
router.get('/', (req, res) => {
    res.send('Welcome to Calorie Manager REStful Web Services');
});

/* Get all users */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

/* New Route to Get Detailed User Description */
router.get('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    console.log(`Searching for user with ID: ${userId}`);

    try {
        const user = await User.findOne({ id: userId });
        if (user) {
            console.log('User found:', user);
            res.status(200).json(user);
        } else {
            console.log('User not found');
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Error finding user', error });
    }
});

/* Add Calorie function to add new items into the collection */
router.post('/addcalories', async (req, res) => {
    console.log('Received request body:', req.body);

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    const { user_id, year, month, day, description, category, amount } = req.body;

    // Convert numeric parameters to numbers
    const parsedUserId = parseInt(user_id, 10);
    const parsedYear = parseInt(year, 10);
    const parsedMonth = parseInt(month, 10);
    const parsedDay = parseInt(day, 10);
    const parsedAmount = parseFloat(amount);

    console.log('Parsed data:', { parsedUserId, parsedYear, parsedMonth, parsedDay, description, category, parsedAmount });

    try {
        const existingUser = await User.findOne({ id: parsedUserId });
        if (!existingUser) {
            console.log(`User with id ${parsedUserId} not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        const newCalorie = new Calorie({
            user_id: parsedUserId,
            year: parsedYear,
            month: parsedMonth,
            day: parsedDay,
            id: generateRandomId(),
            description,
            category,
            amount: parsedAmount,
        });

        const validationError = newCalorie.validateSync();
        if (validationError) {
            const errorMessages = Object.values(validationError.errors).map(error => error.message);
            console.log('Validation errors:', errorMessages);
            return res.status(400).json({ errors: errorMessages });
        }

        const savedCalorie = await newCalorie.save();
        console.log('Saved calorie:', savedCalorie);
        res.status(201).json(savedCalorie);
    } catch (error) {
        console.error('Error adding calorie:', error);
        res.status(500).json({ error: 'Failed to add the calorie consumption item', details: error.toString() });
    }
});

/* Get a specific user's monthly report */
router.get('/report', async (req, res) => {
    const { user_id, year, month } = req.query;

    const userId = parseInt(user_id);
    const reportYear = parseInt(year);
    const reportMonth = parseInt(month);

    try {
        const existingUser = await User.findOne({ id: userId });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const calories = await Calorie.find({ user_id: userId, year: reportYear, month: reportMonth });

        const report = {
            breakfast: [],
            lunch: [],
            dinner: [],
            other: []
        };

        calories.forEach(calorie => {
            const { category, day, description, amount } = calorie;
            if (report.hasOwnProperty(category)) {
                report[category].push({ day, description, amount });
            } else {
                report.other.push({ day, description, amount });
            }
        });

        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate the calorie report' });
    }
});

/* Get developer data */
router.get('/about', (req, res) => {
    const developers = [
        { firstname: 'Eli', lastname: 'Shulman', id: 316040120, email: 'mim472042@gmail.com' },
        { firstname: 'Shahar', lastname: 'Ashkenazi', id: 316244060, email: 'shaharke9@gmail.com' }
    ];

    res.json(developers);
});


