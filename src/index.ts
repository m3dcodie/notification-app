import express from 'express';
import userRoutes from './routes/user';
import notificationRoutes from './routes/notifications';
import healthRoutes from './routes/health';

const app = express();
app.use(express.json());

app.use('/user', userRoutes);
app.use('/notifications', notificationRoutes);
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.send('Notification System API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
