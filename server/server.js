const express = require('express');
const app = express();
const middleware = express.static('public');

app.use('/', middleware);

app.listen(3000, function() {

    console.log('App started at port http://localhost:3000');
})