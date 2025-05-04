// Backend/src/config/database.js
const mongoose = require("mongoose");
// No need to call dotenv.config() here if it's called early in server.js

exports.connect = () => {
    // Use the existing environment variable name 'DATABASE'
    const dbUrl = process.env.DATABASE;

    if (!dbUrl) {
        console.error('ERROR: DATABASE environment variable is not set.');
        process.exit(1); // Exit if DB connection string is missing
    }

    mongoose.connect(dbUrl)
        .then(() => console.log("DB connected successfully"))
        .catch((error) => {
            console.log("DB connection Failed");
            console.log(error); // Log the error object
            // console.error(error); // console.log(error) is often sufficient
            process.exit(1);
        });
};
