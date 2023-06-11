const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://liri_s29:kirisuna@cluster.5ry3xe5.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected");
});

module.exports = db;
    