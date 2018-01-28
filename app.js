const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const fb = require('./firebase');

app.use(bodyParser.json({
    limit: '5mb'
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/fb',router.get('/get',(req,res) => {
    fb.get((o) => {
        res.send(o);
    })
}))

module.exports = app;