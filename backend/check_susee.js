const mongoose = require('mongoose');
require('dotenv').config();

async function checkSusee() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const suseeId = "69e5977d8240d08d72fdd7f4";
        
        const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
        const jobs = await Job.find({ $or: [{ clientId: suseeId }, { freelancerId: suseeId }] });
        console.log('Jobs associated with susee:', jobs.length);
        
        const Application = mongoose.model('Application', new mongoose.Schema({}, { strict: false }));
        const apps = await Application.find({ freelancerId: suseeId });
        console.log('Apps associated with susee:', apps.length);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSusee();
