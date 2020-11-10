const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

//Import Routes
const authRoute = require('./routes/auth');
const createAccount = require('./routes/createAccount');
const Notifications = require('./routes/notifications');
const Notice = require('./routes/notice');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, 
    { useNewUrlParser: true },
    { useCreateIndex: true },
    { useUnifiedTopology: true },
    () => console.log('connected to db!')
);

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public/"));



//Route Middlewares
app.use('/user', authRoute);
app.use('/createAccount', createAccount);
app.use('/notifications', Notifications);
app.use('/notice', Notice);


app.listen(5000, () => console.log('Server Up and running'));
