const mongoose = require('mongoose');
require('dotenv').config();

async function checkJobs() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/karyaseva');
        const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
        const jobs = await Job.find({});
        console.log(`Total jobs in DB: ${jobs.length}`);
        jobs.forEach(j => console.log(`- ${j.title} (${j.status}), ID: ${j._id}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkJobs();
