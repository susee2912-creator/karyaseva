const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/karyaseva');
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const users = await User.find({});
        console.log(`Total users in DB: ${users.length}`);
        users.forEach(u => console.log(`- ${u.name} (${u.role}), ID: ${u._id}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
