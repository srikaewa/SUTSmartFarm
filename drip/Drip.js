// User.js
var mongoose = require('mongoose');
var DripSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
mongoose.model('Drip', DripSchema);
module.exports = mongoose.model('Drip');
