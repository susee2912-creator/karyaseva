const mongoose = require('mongoose');
require('dotenv').config();

async function checkNullApps() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Application = mongoose.model('Application', new mongoose.Schema({}, { strict: false }));
        const apps = await Application.find({ freelancerId: { $in: [null, undefined] } });
        console.log('Apps with null freelancerId:', apps.length);
        apps.forEach(a => console.log(a));
        
        const allApps = await Application.find({});
        console.log('Total Apps:', allApps.length);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkNullApps();
