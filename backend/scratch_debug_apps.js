const axios = require('axios');

async function testFetch() {
    const freelancerId = '69e4a7eaac8adfe7a444da17';
    try {
        const res = await axios.get(`http://localhost:5000/api/applications/freelancer/${freelancerId}`, {
            headers: { Authorization: 'Bearer YOUR_TOKEN_HERE' } // I don't have the token here
        });
        console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error(err.message);
    }
}

// Instead of axios, let's just query the DB directly to see what the populate returns
const mongoose = require('mongoose');
require('dotenv').config();

async function checkPopulate() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/karyaseva');
        const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
        const Application = mongoose.model('Application', new mongoose.Schema({
            jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
        }, { strict: false }));
        
        const apps = await Application.find({ freelancerId: '69e4a7eaac8adfe7a444da17' }).populate('jobId');
        console.log('Populated Applications:');
        console.log(JSON.stringify(apps, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkPopulate();
