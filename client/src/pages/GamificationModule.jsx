import { Navigate, Route, Routes } from 'react-router-dom';
import SubTabBar from '../components/SubTabBar';

const tabs = [
  { label: 'Challenges', path: '/gamification/challenges' },
  { label: 'Challenge Participation', path: '/gamification/challenge-participation' },
  { label: 'Badges', path: '/gamification/badges' },
  { label: 'Rewards', path: '/gamification/rewards' },
  { label: 'Leaderboard', path: '/gamification/leaderboard' },
];

const Placeholder = ({ title, body }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{body}</p>
  </div>
);

const GamificationModule = () => (
  <div>
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold text-white">Gamification</h1>
        <p className="mt-1 text-sm text-slate-400">Drive engagement with challenges, rewards, and recognition.</p>
      </div>
      <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-300">Orange Module</div>
    </div>
    <SubTabBar tabs={tabs} accent="amber" />
    <Routes>
      <Route path="" element={<Navigate to="/gamification/challenges" replace />} />
      <Route path="challenges" element={<Placeholder title="Challenges" body="Challenge programs and their status will appear here." />} />
      <Route path="challenge-participation" element={<Placeholder title="Challenge Participation" body="Participation records will appear here." />} />
      <Route path="badges" element={<Placeholder title="Badges" body="User badges and unlock criteria will appear here." />} />
      <Route path="rewards" element={<Placeholder title="Rewards" body="Reward catalog and redemption status will appear here." />} />
      <Route path="leaderboard" element={<Placeholder title="Leaderboard" body="Top performers and ranking history will appear here." />} />
    </Routes>
  </div>
);

export default GamificationModule;
