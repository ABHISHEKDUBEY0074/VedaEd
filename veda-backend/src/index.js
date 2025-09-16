// CONNECT DB & START SERVER 
const express = require('express');
const dotenv = require('dotenv');
require('dotenv').config();
const app = require("./app");
const main  = require('./config/db');




main()
.then(()=>{
        console.log("connected to db");

        app.listen(process.env.PORT, ()=>{
                console.log("Server Listening at Port: "+ process.env.PORT)
        })
})
.catch(err => console.log("DB Connection Error: ", err));

