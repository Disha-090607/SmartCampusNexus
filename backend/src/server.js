const http = require('http');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const app = require('./app');
const { initSocket } = require('./services/socketService');

dotenv.config();
connectDB();

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
