import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import metricsRoutes from './routes/metricsRoutes.js';
import complianceRoutes from './routes/complianceRoutes.js';
import csrRoutes from './routes/csrRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
<<<<<<< HEAD
=======
import emissionFactorRoutes from './routes/emissionFactorRoutes.js';
import carbonRoutes from './routes/carbonRoutes.js';
>>>>>>> b0514b66e92ad0566c63987828ebefd224fdc116
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'EcoSphere API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/csr', csrRoutes);
<<<<<<< HEAD
app.use('/api/departments', departmentRoutes);
=======
app.use('/api/emission-factors', emissionFactorRoutes);
app.use('/api/carbon', carbonRoutes);
>>>>>>> b0514b66e92ad0566c63987828ebefd224fdc116

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
