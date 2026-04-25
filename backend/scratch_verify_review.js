const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Review = require('./models/Review');

async function verifyReview() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB...");

        const clientId = "69e595c25738e709f3973982";
        const freelancerId = "69e595c25738e709f3973984";
        const jobId = "69e595c25738e709f397398a";

        // 1. Check initial Trust Score of Client
        const initialClient = await User.findById(clientId);
        console.log(`Initial Client Trust Score: ${initialClient.trustScore}`);

        // 2. Mock adding a review (Simulation of addReview controller)
        // We bypass the route middleware because we are running server-side
        console.log("Adding review from Freelancer to Client...");
        const review = await Review.create({
            jobId,
            raterId: freelancerId,
            rateeId: clientId,
            rating: 5,
            comment: "Great client, very clear requirements!"
        });

        // Update ratee's trust score (logic from reviewController)
        const rating = 5;
        const scoreChange = (rating >= 4) ? 5 : (rating <= 2) ? -5 : 0;
        initialClient.trustScore = Math.max(0, Math.min(100, (initialClient.trustScore || 50) + scoreChange));
        initialClient.completedJobs = (initialClient.completedJobs || 0) + 1;
        await initialClient.save();

        console.log(`Updated Client Trust Score: ${initialClient.trustScore}`);

        // 3. Verify getReviews (logic from reviewController)
        console.log("Fetching reviews for Client...");
        const clientReviews = await Review.find({ rateeId: clientId });
        console.log(`Found ${clientReviews.length} reviews for Client.`);
        clientReviews.forEach(r => console.log(`- [${r.rating} stars] ${r.comment}`));

        console.log("Fetching reviews for Freelancer...");
        const freelancerReviews = await Review.find({ rateeId: freelancerId });
        console.log(`Found ${freelancerReviews.length} reviews for Freelancer.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifyReview();
