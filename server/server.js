import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import metricsRoutes from './routes/metricsRoutes.js';
import complianceRoutes from './routes/complianceRoutes.js';
import csrRoutes from './routes/csrRoutes.js';
import participationRoutes from './routes/participationRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import challengeParticipationRoutes from './routes/challengeParticipationRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';

import emissionFactorRoutes from './routes/emissionFactorRoutes.js';
import carbonRoutes from './routes/carbonRoutes.js';

import scoreRoutes from './routes/scoreRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { sanitizeInputs } from './middleware/sanitizeInputs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInputs);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'EcoSphere API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/csr', csrRoutes);

app.use('/api/participation', participationRoutes);

app.use('/api/challenges', challengeRoutes);
app.use('/api/challenge-participation', challengeParticipationRoutes);



app.use('/api/departments', departmentRoutes);


app.use('/api/emission-factors', emissionFactorRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/leaderboard', leaderboardRoutes);


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
