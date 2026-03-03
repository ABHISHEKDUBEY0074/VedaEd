const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();
const Institution = require("./src/modules/institution/institutionModel");

async function test() {
    try {
        await mongoose.connect(process.env.db_Connect_String);
        console.log("Connected to DB");

        const testData = {
            identity: { schoolName: "Test School" }
        };

        const inst = new Institution(testData);
        await inst.save();
        console.log("Successfully saved test institution");

        await Institution.deleteOne({ "identity.schoolName": "Test School" });
        console.log("Cleanup done");

        process.exit(0);
    } catch (error) {
        console.error("Error in test script:", error);
        process.exit(1);
    }
}

test();
