const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var mongoose = require("mongoose");
var conn = mongoose.createConnection('mongodb://127.0.0.1:27017',
    {useNewUrlParser: true, useUnifiedTopology: true});
var sudoku = conn.useDb('sudoku');
var boards = sudoku.collection('boards');
app.use(express.static('./dist'));
app.use(bodyParser.json());

app.get('/board', (req, res) => {
    var query = mongoose.Types.ObjectId.createFromHexString(req.query.id);
    boards.findOne({'_id' : query}).then((data) => {
        res.status(200).send(data);
    });
});
app.post('/board', (req, res) => {
    boards.insertOne(req.body).then((data) => {
        res.status(200).send(data.insertedId);
    });
});

app.listen(3000, () => console.log(`Listening at port 3000!`));