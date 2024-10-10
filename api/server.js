const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection

        const uri = 'mongodb+srv://doctor123:doctor123@cluster0.nnxbqud.mongodb.net/review';  // Or your MongoDB Atlas URI
        mongoose.connect(uri)
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.error('MongoDB connection error:', err));
// Review Schema
const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 3,
        max: 5
    },
    review: {
        type: String,
        required: true
    },
    imageUrl: { // Optional field for testimonial images
        type: String,
        default: '' // Default to empty if no image is provided
    }
});

// Create the Review model
const Review = mongoose.model('Review', reviewSchema);

// Route to submit a new review
app.post('/reviews', async (req, res) => {
    const { name, rating, review, imageUrl } = req.body; // Extract values from request body

    // Validate that all fields are present
    if (!name || !rating || !review) {
        return res.status(400).json({ success: false, message: 'Name, rating, and review are required.' });
    }

    try {
        // Create a new review instance and save it
        const newReview = new Review({ name, rating, review, imageUrl });
        await newReview.save();
        return res.status(201).json({ success: true, message: 'Review submitted successfully!' });
    } catch (error) {
        console.error('Error saving review:', error);
        return res.status(500).json({ success: false, message: 'Error saving review' });
    }
});

// Route to retrieve all reviews
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find(); // Fetch all reviews from the database
        return res.status(200).json(reviews); // Return the reviews as JSON
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        return res.status(500).json({ success: false, message: 'Error retrieving reviews' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
