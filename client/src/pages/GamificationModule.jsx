import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SubTabBar from '../components/SubTabBar';
import { fetchBadgeGallery, fetchChallengeParticipations, fetchChallenges, fetchLeaderboard, joinChallenge, reviewChallengeParticipation, submitChallengeProgress } from '../api/metricsApi';
import { useAuth } from '../context/AuthContext';

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
  const [filter, setFilter] = useState('ACTIVE');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetchChallenges();
      setChallenges(response?.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const visibleChallenges = useMemo(() => {
    if (filter === 'ALL') return challenges;
    return challenges.filter((challenge) => String(challenge.status || '').toUpperCase() === filter);
  }, [challenges, filter]);

  const handleJoin = async (challengeId) => {
    try {
      await joinChallenge(challengeId);
      await loadChallenges();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {['ALL', ...filters].map((item) => (
          <button key={item} onClick={() => setFilter(item.toUpperCase())} className={`rounded-full px-3 py-1.5 text-sm ${filter === item.toUpperCase() ? 'bg-amber-500/20 text-amber-200' : 'bg-slate-800 text-slate-300'}`}>{item}</button>
        ))}
      </div>
      {loading ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading challenges…</div> : visibleChallenges.length === 0 ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">No challenges match this filter.</div> : <div className="grid gap-4 lg:grid-cols-2">{visibleChallenges.map((challenge) => (
        <div key={challenge.id} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-lg font-semibold text-white">{challenge.title}</h4>
              <p className="mt-1 text-sm text-slate-300">{challenge.description}</p>
            </div>
            <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-amber-200">{String(challenge.status || '').toLowerCase()}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
            <span>XP: {challenge.xpReward ?? challenge.xp ?? 0}</span>
            <span>Deadline: {challenge.endDate ? new Date(challenge.endDate).toLocaleDateString() : 'Open ended'}</span>
          </div>
          {user?.role === 'EMPLOYEE' ? (
            <button onClick={() => handleJoin(challenge.id)} className="mt-4 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-amber-400">Join Challenge</button>
          ) : null}
        </div>
      ))}</div>}
    </div>
  );
};

const ChallengeParticipationPage = () => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadParticipations = async () => {
    try {
      setLoading(true);
      const response = await fetchChallengeParticipations();
      setParticipations(response?.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipations();
  }, []);

  const handleReview = async (participationId, decision) => {
    await reviewChallengeParticipation(participationId, { status: decision, xpAwarded: 50 });
    await loadParticipations();
  };

  const handleSubmitProgress = async (participationId) => {
    await submitChallengeProgress(participationId, { progressValue: 100, submissionNote: 'Completed via demo workflow' });
    await loadParticipations();
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold text-white">Challenge Participation</h3>
      {loading ? <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading participation queue…</div> : <div className="mt-4 space-y-3">{participations.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-white">{item.challenge?.title || item.challengeTitle}</p>
              <p className="mt-1 text-sm text-slate-400">{item.user?.name || item.employeeName} • {String(item.status || '').toLowerCase()}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {user?.role === 'EMPLOYEE' ? (
                <button onClick={() => handleSubmitProgress(item.id)} className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-500">Submit progress</button>
              ) : null}
              {user?.role === 'MANAGER' ? (
                <>
                  <button onClick={() => handleReview(item.id, 'APPROVED')} className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500">Approve</button>
                  <button onClick={() => handleReview(item.id, 'REJECTED')} className="rounded bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-500">Reject</button>
                </>
              ) : null}
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
