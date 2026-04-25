const mongoose = require('mongoose');
require('dotenv').config();

async function checkApplications() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/karyaseva');
        const Application = mongoose.model('Application', new mongoose.Schema({}, { strict: false }));
        const apps = await Application.find({});
        console.log(`Total applications in DB: ${apps.length}`);
        apps.forEach(a => console.log(`- App ID: ${a._id}, Job: ${a.jobId}, Freelancer: ${a.freelancerId}, Status: ${a.status}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkApplications();
