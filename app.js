const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const PORT = 3000;

// middleare...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// .
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// init routes
app.use('/', urlRoutes);

// server run in PORT:3000
app.listen(PORT, () => {
    console.log(`Server running in => http://localhost:${PORT}`);
});