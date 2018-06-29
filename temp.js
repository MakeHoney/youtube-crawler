/* crawler-server port number */
const PORT = 24681;
// ---> 아마존 포트열어놓기

/* cralwer module */
const main = require('./index_db.js');

/* express module */
var express = require('express');
var app = express();

/* body-parser for post req */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.post('/sign_up_init', function(req, res) {
    main('UCxx7UvIhPkEQxaplaWS2hLg');
    res.send("signed up successfully\n");
});

app.listen(PORT, function() {
  console.log("Crawler Server is Running...");
})
