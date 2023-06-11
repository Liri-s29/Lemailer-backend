const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  from: { type: String, required: true },  // Sender's email
  to: { type: String, required: true },
  subject: { type: String, required: true },
  sent: { type: Date, default: Date.now },
  opens: [{ openedAt: Date }]
});

module.exports = mongoose.model('Email', EmailSchema);
