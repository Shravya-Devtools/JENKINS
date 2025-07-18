const path = require('path');
const fs = require('fs');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("Error: MONGO_URI environment variable is not set");
    process.exit(1);
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err) {
    if (err) {
        console.log("error!! " + err);
    } else {
        console.log("MongoDB Connection Successful");
    }
});

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

app.post('/planet', function(req, res) {
    planetModel.findOne({ id: req.body.id }, function(err, planetData) {
        if (err) {
            console.error("Error fetching planet data:", err);
            return res.status(500).send("Internal server error");
        }
        if (!planetData) {
            console.error("Ooops, We only have 9 planets and a sun. Select a number from 0 - 9");
            return res.status(400).send("Error: Invalid planet ID");
        }
        res.send(planetData);
    });
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/api-docs', (req, res) => {
    fs.readFile('oas.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }
        res.json(JSON.parse(data));
    });
});

app.get('/os', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        os: OS.hostname(),
        env: process.env.NODE_ENV || 'development'
    });
});

app.get('/live', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({ status: "live" });
});

app.get('/ready', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({ status: "ready" });
});

app.listen(3000, () => {
    console.log("Server successfully running on port - 3000");
});

module.exports = app;

// module.exports.handler = serverless(app);

