const User = require('./src/models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const [username, email, password] = process.argv.slice(2);
console.log(username, email, password);

// Connect database
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })

        const passwordHash = bcrypt.hashSync(password);

        const user = new User();

        user.username = username;
        user.email = email;
        user.password = passwordHash

        await user.save();

        console.log("Success");

    } catch (error) {
        console.error(error )
    }

    process.exit()
})()