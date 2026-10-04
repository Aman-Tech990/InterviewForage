import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { EmptyState, ErrorState, ListSkeleton, PageHeader, Pagination, ScoreBand, difficultyLabel, formatDate, typeLabel } from '../components/ui.jsx';

export default function Interviews() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useAsync(() => api.get('/interviews', { params: { page, limit: 10 } }), [page]);

  return (
    <>
      <PageHeader title="Interviews" description="Every mock interview you have started." action={<Link to="/interviews/new" className="btn btn-primary">Start interview</Link>} />
      {loading && <ListSkeleton />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && data.items.length === 0 && (
        <EmptyState title="No interviews yet" description="Choose a topic and difficulty and the interviewer will take it from there." action={<Link to="/interviews/new" className="btn btn-primary">Start interview</Link>} />
      )}
      {data && data.items.length > 0 && (
        <>
          <ul className="divide-y divide-line rounded-lg border border-line">
            {data.items.map((i) => (
              <li key={i.id}>
                <Link to={`/interviews/${i.id}`} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5 text-sm transition-colors hover:bg-raised/60">
                  <div>
                    <p className="font-medium">{typeLabel(i.type)}</p>
                    <p className="text-xs text-muted">{difficultyLabel(i.difficulty)} - {i.questionCount} questions - {formatDate(i.createdAt)}</p>
                  </div>
                  {i.status === 'COMPLETED'
                    ? <span className="font-mono text-sm">{i.score ?? '-'}% <ScoreBand score={i.score} /></span>
                    : <span className="text-warn">In progress ({i.questionsAsked} of {i.questionCount})</span>}
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
