/* 
This is where the majority of the backend service happens

To test endpoints, use POSTMAN API and connect to localhost:5000 or whatever the port may be inside this project and test out the endpoints yourself

You can check what values or JSON responses it returns so you know where to start fetching and testing

- Resty (BE)
*/
require('dotenv').config();

const apiMessages = require('./middleware/apiMessages');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');
const multer = require('multer');

// Import Routes
const accommodationRouter = require('./routes/accommodationRouter');
const authRouter = require('./routes/authRouter');
const authRequiredFunc = require('./routes/authRequiredRoutes');

// Express application
const app = express();

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next(); 
});

// To serve the website directly
app.use(express.static('client/build'));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json())

app.use((err, req, res, next) => {
  console.log(err);
  next();
});
//
// Routes
app.get('/api/v1', (req, res) => {
  res.json({ msg: 'This is the API route' });
});
app.use('/api/v1/accommodation', accommodationRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/auth-required-func', authRequiredFunc);

app.get('*', (req, res) => {
    res.sendFile(path.resolve('./client/build', 'index.html'));
});

app.use((req, res, next) => {
  res.status(404).json({ error: apiMessages.ROUTE_NOT_FOUND });
});

// Connect to the database and listen for requests
console.log('Awakening the server...');

mongoose.connect(process.env.MONGO_URI)
  .then(() =>{
    app.listen(process.env.PORT, () => {
      console.log('Database connected successfully, listening on port', process.env.PORT)
    })
  })
  .catch((err) => console.log(err))