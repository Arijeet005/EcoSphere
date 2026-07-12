import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SubTabBar from '../components/SubTabBar';
import { fetchBadgeGallery, fetchChallengeParticipations, fetchChallenges, fetchLeaderboard } from '../api/metricsApi';

const tabs = [
  { label: 'Challenges', path: '/gamification/challenges' },
  { label: 'Challenge Participation', path: '/gamification/challenge-participation' },
  { label: 'Badges', path: '/gamification/badges' },
  { label: 'Rewards', path: '/gamification/rewards' },
  { label: 'Leaderboard', path: '/gamification/leaderboard' },
];

const filters = ['Draft', 'Active', 'Under Review', 'Completed', 'Archived'];

const Placeholder = ({ title, body }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{body}</p>
  </div>
);

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState('Active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setLoading(true);
        const response = await fetchChallenges();
        setChallenges(response?.data?.data || []);
      } finally {
        setLoading(false);
      }
    };
    loadChallenges();
  }, []);

  const visibleChallenges = useMemo(() => challenges.filter((challenge) => challenge.status === filter || filter === 'All'), [challenges, filter]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-3 py-1.5 text-sm ${filter === item ? 'bg-amber-500/20 text-amber-200' : 'bg-slate-800 text-slate-300'}`}>{item}</button>
        ))}
      </div>
      {loading ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading challenges…</div> : visibleChallenges.length === 0 ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">No challenges match this filter.</div> : <div className="grid gap-4 lg:grid-cols-2">{visibleChallenges.map((challenge) => (
        <div key={challenge.id} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-lg font-semibold text-white">{challenge.title}</h4>
              <p className="mt-1 text-sm text-slate-300">{challenge.description}</p>
            </div>
            <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-amber-200">{challenge.status}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
            <span>XP: {challenge.xp}</span>
            <span>Difficulty: {challenge.difficulty}</span>
            <span>Deadline: {challenge.deadline}</span>
          </div>
          <button className="mt-4 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-amber-400">Join Challenge</button>
        </div>
      ))}</div>}
    </div>
  );
};

const ChallengeParticipationPage = () => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipations = async () => {
      try {
        setLoading(true);
        const response = await fetchChallengeParticipations();
        setParticipations(response?.data?.data || []);
      } finally {
        setLoading(false);
      }
    };
    loadParticipations();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold text-white">Challenge Participation</h3>
      {loading ? <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading participation queue…</div> : <div className="mt-4 space-y-3">{participations.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-white">{item.challengeTitle}</p>
              <p className="mt-1 text-sm text-slate-400">{item.employeeName} • {item.status}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500">Approve</button>
              <button className="rounded bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-500">Reject</button>
            </div>
          </div>
        </div>
      ))}</div>}
    </div>
  );
};

const BadgesPage = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        setLoading(true);
        const response = await fetchBadgeGallery();
        setBadges(response?.data?.data || []);
      } finally {
        setLoading(false);
      }
    };
    loadBadges();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold text-white">Badges</h3>
      {loading ? <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading badges…</div> : <div className="mt-4 grid gap-4 md:grid-cols-3">{badges.map((badge) => (
        <div key={badge.id} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="text-3xl">{badge.icon}</div>
          <p className="mt-3 font-medium text-white">{badge.name}</p>
          <p className="mt-1 text-sm text-slate-300">{badge.description}</p>
        </div>
      ))}</div>}
    </div>
  );
};

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetchLeaderboard();
        setLeaderboard(response?.data?.data || []);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold text-white">Leaderboard</h3>
      {loading ? <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading leaderboard…</div> : <div className="mt-4 overflow-hidden rounded-xl border border-slate-800"><table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300"><thead className="bg-slate-800/80"><tr><th className="px-4 py-3 text-left font-medium">Rank</th><th className="px-4 py-3 text-left font-medium">Employee / Dept</th><th className="px-4 py-3 text-left font-medium">XP</th></tr></thead><tbody>{leaderboard.map((entry) => (<tr key={entry.rank} className="border-t border-slate-800"><td className="px-4 py-3">#{entry.rank}</td><td className="px-4 py-3">{entry.name}</td><td className="px-4 py-3">{entry.xp}</td></tr>))}</tbody></table></div>}
    </div>
  );
};

const RewardsPage = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">Rewards</h3>
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      {[
        { name: 'Wellness Voucher', points: 1200, stock: '8 left' },
        { name: 'Eco Kit', points: 800, stock: '12 left' },
        { name: 'Conference Pass', points: 2000, stock: '4 left' },
      ].map((reward) => (
        <div key={reward.name} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="font-medium text-white">{reward.name}</p>
          <p className="mt-2 text-sm text-slate-300">Points: {reward.points}</p>
          <p className="mt-1 text-sm text-slate-400">Stock: {reward.stock}</p>
        </div>
      ))}
    </div>
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
      <Route path="challenges" element={<ChallengesPage />} />
      <Route path="challenge-participation" element={<ChallengeParticipationPage />} />
      <Route path="badges" element={<BadgesPage />} />
      <Route path="rewards" element={<RewardsPage />} />
      <Route path="leaderboard" element={<LeaderboardPage />} />
    </Routes>
  </div>
);

export default GamificationModule;
