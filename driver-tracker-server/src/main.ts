import express from 'express';
import { connectToDatabase } from './utilities/db-connection'
import dotenv from 'dotenv';
import driverRouter from './routes/driver-location.routes';
import { initBatching } from './services/batcher.services';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());


app.get('/health-check', (req, res) => {
  res.send('app is working');
});

app.use('/drivers', driverRouter);

// Start server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    initBatching();
  });
}).catch(err => {
  console.error('❌ Failed to connect to database:', err);
  process.exit(1);
});