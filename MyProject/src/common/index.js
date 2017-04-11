var tes= require('indonesian-text-sentiment-classifier');
// var text = 'Politik itu jahat. Kemaren aja kena tipu gara-gara si anu. ADuh. bener bener kampret.';
// console.log(tes.predict(text));

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// respond with "hello world" when a GET request is made to the homepage
app.post('/', function (req, res) {
  //console.log(req.body);
  var content = req.body.postContent;
  res.json(tes.predict(content));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})