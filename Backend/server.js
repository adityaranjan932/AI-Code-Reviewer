const dotenv = require('dotenv');

// Load environment variables VERY FIRST
dotenv.config({ path: './.env' }); // Make sure this path is correct

// --- Verify DATABASE variable ---
console.log('Attempting to connect to MongoDB using:', process.env.DATABASE);
// --- End Verification ---

const dbConnect = require('./src/config/database'); // Import the connect function
const app = require('./src/app');

// --- Database Connection ---
dbConnect.connect(); // Call the connect function
// --- End Database Connection ---


// --- Server Start ---
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle Unhandled Rejections (e.g., DB connection issues after initial success)
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION!  Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM (graceful shutdown)
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log(' Process terminated!');
    });
});
// --- End Server Start ---
