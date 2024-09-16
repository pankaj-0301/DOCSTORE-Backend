const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db'); // MongoDB connection
const contentRoutes = require('./routes/contentRoutes');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', contentRoutes);


app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h1>This is the Server for Documents</h1>
        <p>Welcome to the document server. Use the API endpoints to create and fetch documents.</p>
      </body>
    </html>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
