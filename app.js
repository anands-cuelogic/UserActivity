require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';

//Load User Module
import userIndex from './User/index';
//DB config
import db from './config/keys';


const app = express();
const port = process.env.PORT || 3000;

//Connect to mongoDB
mongoose.connect(db.mongoURI).then((result) => {
    console.log('Database connected');
}).catch((err) => {
    console.log('Error in connection :', err);
});

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/user', userIndex);

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});