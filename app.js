require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.port
const connectDatabase = require('./src/config/Database');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const Router = require('./src/Route/userRoute/userRoute')

app.use('/api/v1',Router)

//Database connect
connectDatabase();

//listen port
app.listen(port,()=>{
    console.log(`Server is listining on port : ${port}`)
})




