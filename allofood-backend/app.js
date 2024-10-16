const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const cors = require('cors');
// const userRoutes = require('./routes/userRoutes');
// const deliveryRoutes = require('./routes/deliveryRoutes');
// const managerRoutes = require('./routes/managerRoutes');

const app = express();
const PORT = process.env.PORT;

// Connect to the database
require('./config/db').connect();

// Middleware :
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 600000 } 
}))

// Routes :
app.use('/auth', authRoutes);
// app.use('/user', userRoutes);
// app.use('/delivery', deliveryRoutes);
// app.use('/manager', managerRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;