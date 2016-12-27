var app = require('./app');

var port = process.env.PORT || 5000;

var server = app.listen(port, function () {
  console.log('Tunari Web client is running at %s development mode.', port);
});
