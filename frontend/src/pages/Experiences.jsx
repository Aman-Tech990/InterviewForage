import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { DIFFICULTIES, EmptyState, ErrorState, INTERVIEW_TYPES, ListSkeleton, PageHeader, Pagination, difficultyLabel, formatDate, typeLabel } from '../components/ui.jsx';

export default function Experiences() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [interviewType, setType] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const { data, loading, error, reload } = useAsync(
    () => api.get('/experiences', { params: { page, limit: 10, q: query || undefined, interviewType: interviewType || undefined, difficulty: difficulty || undefined } }),
    [page, query, interviewType, difficulty],
  );

  const reset = (setter) => (e) => { setter(e.target.value); setPage(1); };

  return (
    <>
      <PageHeader
        title="Interview experiences"
        description="Written by candidates about their own interviews. These are personal accounts, not verified company facts."
        action={<Link to="/experiences/new" className="btn btn-primary">Share experience</Link>}
      />

      <form onSubmit={(e) => { e.preventDefault(); setQuery(q.trim()); setPage(1); }} className="mb-6 flex flex-wrap gap-3" role="search">
        <input className="input max-w-xs" placeholder="Search company, role or question" aria-label="Search experiences" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input w-auto" aria-label="Interview type" value={interviewType} onChange={reset(setType)}>
          <option value="">All types</option>{INTERVIEW_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className="input w-auto" aria-label="Difficulty" value={difficulty} onChange={reset(setDifficulty)}>
          <option value="">Any difficulty</option>{DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
        <button className="btn">Search</button>
      </form>

      {loading && <ListSkeleton />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && data.items.length === 0 && <EmptyState title="No experiences found" description="Try a different search, or share the first one yourself." action={<Link to="/experiences/new" className="btn btn-primary">Share experience</Link>} />}
      {data && data.items.length > 0 && (
        <>
          <ul className="divide-y divide-line rounded-lg border border-line">
            {data.items.map((e) => (
              <li key={e.id}>
                <Link to={`/experiences/${e.id}`} className="block px-4 py-3.5 transition-colors hover:bg-raised/60">
                  <p className="text-sm font-medium">{e.company}, {e.role}</p>
                  <p className="mt-0.5 text-xs text-muted">{e.round} - {typeLabel(e.interviewType)} - {difficultyLabel(e.difficulty)} - shared by {e.author.name} on {formatDate(e.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Pagination pagination={data.pagination} onChange={setPage} />
        </>
      )}
    </>
  );
}
