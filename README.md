<!-- To Be Filled by Project Leader with correct information -->
# E8L - STALS

# Refer to this document for guidelines regarding the use of this repository and its branches:
- https://docs.google.com/document/d/14vkYe7_gc-vT5j3cW_ETH-6DtaSeteN5dkQRBhBGuuw/edit#heading=h.tchu7tbasqkq

# How to setup project from scratch
- Guide: https://www.digitalocean.com/community/tutorials/getting-started-with-the-mern-stack
1. Make sure you are in the root directory.
2. `npm init -y`
3. `npm install express`
4. `touch server.js`
5. Paste the following code inside `server.js`:
```js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/api');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// THIS PART IS STILL TODO FOR [DB]
// Connect to the database
// mongoose
//   .connect(process.env.DB, { useNewUrlParser: true })
//   .then(() => console.log(`Database connected successfully`))
//   .catch((err) => console.log(err));

// Since mongoose's Promise is deprecated, we override it with Node's Promise
// mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```
6. `mkdir routes`
7. `touch api.js`
8. Paste the following code inside `api.js`:
```js
const express = require('express');
const router = express.Router();

router.get('/todos', (req, res, next) => {
  // get placeholder
});

router.post('/todos', (req, res, next) => {
  // post placeholder
});

router.delete('/todos/:id', (req, res, next) => {
  // delete placeholder
});

module.exports = router;
```
9. `npm install mongoose`
10. `mkdir models`
11. Make sure you are still in the root directory, run: `npx create-react-app client`
12. `npm install concurrently --save-dev`
13. `npm install nodemon --save-dev`
14. Modify the `package.json` in the root folder, and paste this code:
```.json
"scripts": {
    "start": "node index.js",
    "start-watch": "nodemon index.js",
    "dev": "concurrently \"npm run start-watch\" \"cd client && npm start\""
},
```
15. Go to the `client` folder, and modify its `package.json` file with:
```.json
"proxy": "http://localhost:5000"
```
16. To make sure setup correctly, do `npm run dev`
17. Open `localhost:3000` for front-end, `localhost:5000` for back-end, in your browser to check.
18. Start Developing!

# How to run the app
1. Make sure to `npm install` the first time you localize this repository., Do this command both inside the root folder, and the client folder, to make sure that the backend (root) and frontend (client) both have installed dependencies
2. For back-end & database:
   1. Make sure you are in the root folder directory.
   2. `npm start`
   3. You should see your development server in `localhost:5000`.
3. For front-end:
   1. Make sure you are in the client folder directory.
   2. `npm start`
   3. You should see your development server in `localhost:3000`.