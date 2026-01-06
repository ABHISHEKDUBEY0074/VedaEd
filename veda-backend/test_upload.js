const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        // 1. Get latest application
        console.log("Fetching applications...");
        const res = await fetch('http://localhost:5000/api/admission/application');
        const json = await res.json();
        const apps = json.data;
        if (!apps || apps.length === 0) {
            console.log("No applications found.");
            return;
        }
        const app = apps[0];
        console.log("Latest App ID:", app._id, app.personalInfo.name);

        // 2. Create a dummy file
        const filePath = path.join(__dirname, 'test.txt');
        fs.writeFileSync(filePath, 'Hello World');
        const fileContent = fs.readFileSync(filePath);
        const blob = new Blob([fileContent], { type: 'text/plain' });

        // 3. Upload
        const formData = new FormData();
        formData.append('applicationId', app._id);
        formData.append('type', 'Test Document');
        formData.append('file', blob, 'test.txt');

        console.log("Uploading file...");
        const uploadRes = await fetch('http://localhost:5000/api/admission/application/upload', {
            method: 'POST',
            body: formData
        });

        const uploadJson = await uploadRes.json();
        console.log("Upload Response:", uploadJson);

        // 4. Verify
        const verifyRes = await fetch(`http://localhost:5000/api/admission/application/${app._id}`);
        const verifyJson = await verifyRes.json();
        console.log("Documents after upload:", verifyJson.data.documents);

        // Clean up
        fs.unlinkSync(filePath);

    } catch (err) {
        console.error("Error:", err.message);
    }
}

testUpload();
