const mongoose = require('mongoose');
require('dotenv').config();

const db = process.env.MONGODB_URI;

exports.connect = () => {
  mongoose.connect(db)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });
};