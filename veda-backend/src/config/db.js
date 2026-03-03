const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
    await mongoose.connect(process.env.db_Connect_String);
}

module.exports = main;