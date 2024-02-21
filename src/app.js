import express from 'express';
import { usersRoutes } from './routes/users.routes.js';
import cors from 'cors';

const PORT = process.env.PORT ?? 1234;
const app = express();
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

app.use('/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
