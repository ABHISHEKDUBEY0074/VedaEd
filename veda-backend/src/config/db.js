const mongoose = require('mongoose');
require('dotenv').config();

async function main(){
    mongoose.connect(process.env.db_Connect_String);
}

module.exports = main;