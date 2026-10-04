import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { EmptyState, ErrorState, ListSkeleton, PageHeader, ScoreBand, difficultyLabel, formatDate, typeLabel } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Trend({ scores }) {
  if (scores.length < 2) return <p className="text-sm text-muted">Complete two interviews to see a trend.</p>;
  const w = 320; const h = 72; const pad = 6;
  const points = scores.map((s, i) => `${pad + (i * (w - pad * 2)) / (scores.length - 1)},${pad + ((100 - s) * (h - pad * 2)) / 100}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full max-w-sm" role="img" aria-label={`Score trend over the last ${scores.length} interviews`}>
      <polyline points={points} fill="none" stroke="#2f80ff" strokeWidth="2" strokeLinejoin="round" />
      {scores.map((s, i) => (
        <circle key={i} cx={pad + (i * (w - pad * 2)) / (scores.length - 1)} cy={pad + ((100 - s) * (h - pad * 2)) / 100} r="2.5" fill="#2dd4e6" />
      ))}
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(
    () => Promise.all([api.get('/interviews', { params: { limit: 50 } }), api.get('/code-reviews', { params: { limit: 1 } })]),
    [],
  );

  if (loading) return <><PageHeader title="Dashboard" /><ListSkeleton /></>;
  if (error) return <><PageHeader title="Dashboard" /><ErrorState error={error} onRetry={reload} /></>;

  const [interviews, reviews] = data;
  const completed = interviews.items.filter((i) => i.status === 'COMPLETED' && i.score !== null);
  const average = completed.length ? Math.round(completed.reduce((s, i) => s + i.score, 0) / completed.length) : null;
  const trend = completed.slice(0, 10).reverse().map((i) => i.score);
  const active = interviews.items.find((i) => i.status === 'ACTIVE');
  const recent = interviews.items.slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        action={<Link to="/interviews/new" className="btn btn-primary">Start interview</Link>}
      />

      {active && (
        <Link to={`/interviews/${active.id}`} className="mb-8 flex items-center justify-between rounded-lg border border-brand/40 bg-brand/5 px-4 py-3 text-sm transition-colors hover:bg-brand/10">
          <span>You have an interview in progress: {typeLabel(active.type)}, question {active.questionsAsked} of {active.questionCount}.</span>
          <span className="text-brand">Continue</span>
        </Link>
      )}

      <section className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {[
          ['Completed interviews', completed.length],
          ['Average score', average === null ? 'None yet' : `${average}%`],
          ['Code reviews', reviews.pagination.total],
        ].map(([label, value]) => (
          <div key={label} className="bg-panel px-5 py-4">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 font-mono text-2xl">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-medium text-muted">Score trend</h2>
        <Trend scores={trend} />
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted">Recent interviews</h2>
          <Link to="/interviews" className="text-sm text-brand hover:text-brand-hover">View all</Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState title="No interviews yet" description="Your first mock interview takes about ten minutes." action={<Link to="/interviews/new" className="btn btn-primary">Start interview</Link>} />
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line">
            {recent.map((i) => (
              <li key={i.id}>
                <Link to={`/interviews/${i.id}`} className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-raised/60">
                  <span>{typeLabel(i.type)} <span className="text-muted">({difficultyLabel(i.difficulty)}, {formatDate(i.createdAt)})</span></span>
                  {i.status === 'COMPLETED' ? <span className="font-mono">{i.score ?? '-'}% <ScoreBand score={i.score} /></span> : <span className="text-warn">In progress</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
