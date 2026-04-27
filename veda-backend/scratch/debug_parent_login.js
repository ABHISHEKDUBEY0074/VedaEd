const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AdmissionApplication = require('../src/modules/admission/admissionApplicationModel');

async function debugLogin() {
  try {
    await mongoose.connect(process.env.db_Connect_String);
    console.log("Connected to DB");

    const email = 'PRN-ADM-A252AB';
    const shortId = email.replace("PRN-ADM-", "").toLowerCase();
    console.log("Searching for shortId:", shortId);

    const allApps = await AdmissionApplication.find({}).select("_id").lean();
    console.log(`Found ${allApps.length} applications`);

    const matchingApp = allApps.find(app => {
      const appShortId = app._id.toString().toLowerCase().slice(-6);
      return appShortId === shortId;
    });

    if (matchingApp) {
      console.log("MATCH FOUND:", matchingApp._id);
    } else {
      console.log("NO MATCH FOUND");
      if (allApps.length > 0) {
        console.log("First 5 app IDs:");
        allApps.slice(0, 5).forEach(a => console.log(a._id.toString().toLowerCase().slice(-6)));
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugLogin();
