const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI || process.env.URI,
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    console.log("MongoDB has been connected");
}

module.exports = connectDB;