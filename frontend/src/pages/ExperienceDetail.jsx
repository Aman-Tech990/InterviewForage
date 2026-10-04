import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { Button, ErrorState, ListSkeleton, difficultyLabel, formatDate, typeLabel } from '../components/ui.jsx';

export default function ExperienceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(() => api.get(`/experiences/${id}`), [id]);
  const [deleting, setDeleting] = useState(false);

  if (loading) return <ListSkeleton rows={3} />;
  if (error) return <ErrorState error={error} onRetry={error.status === 404 ? undefined : reload} />;

  const e = data.experience;
  const sections = [['Questions asked', e.questions], ['Preparation', e.preparation], ['Overall experience', e.overall], ['Advice', e.advice]].filter(([, v]) => v);

  async function remove() {
    if (!window.confirm('Delete this experience? This cannot be undone.')) return;
    setDeleting(true);
    try { await api.delete(`/experiences/${id}`); navigate('/experiences'); } catch { setDeleting(false); }
  }

  return (
    <article>
      <Link to="/experiences" className="text-sm text-muted hover:text-ink">Experiences</Link>
      <div className="mb-6 mt-1 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{e.company}, {e.role}</h1>
          <p className="mt-1 text-sm text-muted">{e.round} - {typeLabel(e.interviewType)} - {difficultyLabel(e.difficulty)}</p>
          <p className="mt-1 text-xs text-muted">User-submitted by {e.author.name} on {formatDate(e.createdAt)}. Not verified by Interview Forage or the company.</p>
        </div>
        {e.isMine && (
          <div className="flex gap-2">
            <Link to={`/experiences/${id}/edit`} className="btn">Edit</Link>
            <Button variant="ghost" onClick={remove} loading={deleting}>Delete</Button>
          </div>
        )}
      </div>
      <div className="max-w-2xl space-y-7">
        {sections.map(([title, body]) => (
          <section key={title}><h2 className="mb-2 text-sm font-medium">{title}</h2><p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{body}</p></section>
        ))}
      </div>
    </article>
  );
}
