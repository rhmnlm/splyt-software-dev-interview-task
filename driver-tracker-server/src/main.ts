import express from 'express';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

import { connectToDatabase } from './utilities/db-connection'
import driverRouter from './routes/driver-location.routes';
import { initBatching } from './services/batcher.services';
import { initDb } from './utilities/initDb';
import authRouter from './routes/auth.routes';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


app.get('/health-check', (req, res) => {
  res.send('app is working');
});

app.use('/drivers', driverRouter);
app.use('/auth', authRouter);

// Start server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    initDb();
    initBatching();
  });
}).catch(err => {
  console.error('❌ Failed to connect to database:', err);
  process.exit(1);
});