const axios = require('axios');

async function testApi() {
    const freelancerId = "69e5977d8240d08d72fdd7f4"; // susee
    try {
        const res = await axios.get(`http://localhost:5000/api/applications/freelancer/${freelancerId}`);
        console.log("Response data:", res.data);
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}

testApi();
