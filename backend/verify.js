const http = require("http");

async function runTests() {
  console.log("Starting Verification Tests...");
  const baseUrl = "http://localhost:5000/api";

  const fetchJson = async (url, options) => {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options?.headers || {}) }
    });
    const data = await res.json();
    return { status: res.status, data };
  };

  try {
    // 1. Register users
    const clientEmail = `client_${Date.now()}@test.com`;
    const freelancerEmail = `freelancer_${Date.now()}@test.com`;
    
    await fetchJson(`${baseUrl}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name: "Test Client", email: clientEmail, password: "password123", role: "client" })
    });
    await fetchJson(`${baseUrl}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name: "Test Freelancer", email: freelancerEmail, password: "password123", role: "freelancer" })
    });

    // 2. Login
    const { data: clientData } = await fetchJson(`${baseUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: clientEmail, password: "password123" })
    });
    const clientToken = clientData.token;

    const { data: freelancerData } = await fetchJson(`${baseUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: freelancerEmail, password: "password123" })
    });
    const freelancerToken = freelancerData.token;
    const freelancerId = freelancerData.user.id;

    console.log("Registered & Logged in successfully.");

    // 3. Client posts a scam job (should fail)
    const { status: scamStatus, data: scamData } = await fetchJson(`${baseUrl}/jobs/post`, {
      method: "POST",
      headers: { Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({ title: "Quick work", description: "test job no pay needed", budget: 1000, clientId: clientData.user.id })
    });
    console.log("Scam Job Test:", scamStatus === 400 ? "PASSED" : "FAILED", scamData);

    // 4. Client posts a valid job
    const { data: jobData } = await fetchJson(`${baseUrl}/jobs/post`, {
      method: "POST",
      headers: { Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({ title: "Build an API", description: "Need a high quality backend built in Node.js.", budget: 5000, clientId: clientData.user.id })
    });
    const jobId = jobData.id;
    console.log("Valid Job Posted:", jobData.title);

    // 5. Freelancer applies to job
    const { data: appData } = await fetchJson(`${baseUrl}/applications/apply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${freelancerToken}` },
      body: JSON.stringify({ jobId, freelancerId, proposal: "I can build this fast and securely." })
    });
    const appId = appData.id;
    console.log("Freelancer Applied:", appData.proposal);

    // 6. Client hires freelancer
    const { data: hireData } = await fetchJson(`${baseUrl}/applications/hire`, {
      method: "POST",
      headers: { Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({ applicationId: appId, jobId })
    });
    
    console.log("Hiring Result:", hireData.message);
    console.log("Job Status Now:", hireData.job.status, "| Assigned Freelancer:", hireData.job.freelancerId);

    console.log("All tests completed successfully!");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTests();
