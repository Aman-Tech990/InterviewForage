import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { api } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { Button, EmptyState, ErrorState, Field, ListSkeleton, PageHeader, formatDate } from '../components/ui.jsx';

const LANGUAGES = { Java: 'java', JavaScript: 'javascript', Python: 'python', 'C++': 'cpp' };
const VERDICTS = { CORRECT: 'Correct', MOSTLY_CORRECT: 'Mostly correct', INCORRECT: 'Incorrect', INCOMPLETE: 'Incomplete' };

function Section({ title, children }) {
  return <section className="border-t border-line pt-5"><h3 className="mb-3 text-sm font-medium">{title}</h3>{children}</section>;
}

function ReviewResult({ review }) {
  const r = review.result;
  if (!r) return <ErrorState error={{ message: 'This review did not finish. Submit the code again.' }} />;
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-sm text-accent">{VERDICTS[r.verdict]}</p>
        <p className="mt-2 max-w-2xl text-sm text-muted">{r.summary}</p>
      </div>
      <Section title="Complexity">
        <dl className="grid gap-4 font-mono text-sm sm:grid-cols-2">
          <div><dt className="text-xs text-muted">Time</dt><dd>{r.timeComplexity}</dd></div>
          <div><dt className="text-xs text-muted">Space</dt><dd>{r.spaceComplexity}</dd></div>
        </dl>
      </Section>
      {r.bugs.length > 0 && (
        <Section title="Bugs and issues">
          <ul className="space-y-3 text-sm">{r.bugs.map((b, i) => <li key={i}><p>{b.description}</p><p className="text-muted">Why it matters: {b.why}</p></li>)}</ul>
        </Section>
      )}
      {r.edgeCases.length > 0 && (
        <Section title="Edge cases">
          <ul className="space-y-1 text-sm">{r.edgeCases.map((c, i) => <li key={i} className="flex gap-2"><span className={c.handled ? 'text-ok' : 'text-danger'}>{c.handled ? 'Handled' : 'Missed'}</span><span className="text-muted">{c.case}</span></li>)}</ul>
        </Section>
      )}
      {r.readability.length > 0 && (
        <Section title="Readability">
          <ul className="space-y-3 text-sm">{r.readability.map((x, i) => <li key={i}><p>{x.observation}</p><p className="text-muted">Why: {x.why}</p></li>)}</ul>
        </Section>
      )}
      {r.suggestions.length > 0 && (
        <Section title="Suggestions">
          <ul className="space-y-3 text-sm">{r.suggestions.map((s, i) => <li key={i}><p className="font-medium">{s.title}</p><p className="text-muted">{s.explanation} {s.why}</p></li>)}</ul>
        </Section>
      )}
      <Section title="Better approach"><p className="max-w-2xl text-sm text-muted">{r.improvedApproach}</p></Section>
      {r.improvedCode && <Section title="Suggested fix"><pre className="overflow-x-auto rounded-md border border-line bg-panel p-4 font-mono text-xs">{r.improvedCode}</pre></Section>}
    </div>
  );
}

function ReviewDetail({ id }) {
  const { data, loading, error, reload } = useAsync(() => api.get(`/code-reviews/${id}`), [id]);
  return (
    <>
      <PageHeader title="Code review" action={<Link to="/code-review" className="btn">New review</Link>} />
      {loading && <ListSkeleton rows={3} />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (
        <div className="space-y-8">
          <div>
            <p className="mb-2 text-sm text-muted">{data.review.language}, {formatDate(data.review.createdAt)}</p>
            <p className="whitespace-pre-wrap text-sm">{data.review.problemStatement}</p>
          </div>
          <pre className="overflow-x-auto rounded-md border border-line bg-panel p-4 font-mono text-xs">{data.review.code}</pre>
          <ReviewResult review={data.review} />
        </div>
      )}
    </>
  );
}

export default function CodeReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('Python');
  const [problem, setProblem] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const history = useAsync(() => api.get('/code-reviews', { params: { limit: 8 } }), []);

  if (id) return <ReviewDetail id={id} />;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { review } = await api.post('/code-reviews', { language, problemStatement: problem, code });
      navigate(`/code-review/${review.id}`);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Code review" description="Submit a solution and get feedback that explains why each change matters." />
      <form onSubmit={submit} className="space-y-5">
        <Field label="Problem statement" error={error?.details?.problemStatement}>
          <textarea className="input min-h-[96px]" value={problem} onChange={(e) => setProblem(e.target.value)} required />
        </Field>
        <Field label="Language">
          <select className="input max-w-[200px]" value={language} onChange={(e) => setLanguage(e.target.value)}>{Object.keys(LANGUAGES).map((l) => <option key={l}>{l}</option>)}</select>
        </Field>
        <Field label="Your code" error={error?.details?.code}>
          <div className="overflow-hidden rounded-md border border-line">
            <Editor height="340px" theme="vs-dark" language={LANGUAGES[language]} value={code} onChange={(v) => setCode(v ?? '')} options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, padding: { top: 12 } }} />
          </div>
        </Field>
        {error && !error.details && <p role="alert" className="text-sm text-danger">{error.message}</p>}
        <div className="flex items-center gap-3">
          <Button variant="primary" loading={busy} disabled={!code.trim() || !problem.trim()}>{busy ? 'Reviewing' : 'Submit for review'}</Button>
          <Button type="button" variant="ghost" onClick={() => { setCode(''); setProblem(''); }}>Reset</Button>
        </div>
      </form>

      <section className="mt-12">
        <h2 className="mb-3 text-sm font-medium text-muted">Previous reviews</h2>
        {history.loading && <ListSkeleton rows={2} />}
        {history.data?.items.length === 0 && <EmptyState title="No reviews yet" description="Your submitted solutions will appear here." />}
        {history.data?.items.length > 0 && (
          <ul className="divide-y divide-line rounded-lg border border-line">
            {history.data.items.map((r) => (
              <li key={r.id}>
                <Link to={`/code-review/${r.id}`} className="flex items-center justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-raised/60">
                  <span className="truncate">{r.problemStatement}</span>
                  <span className="shrink-0 text-xs text-muted">{r.language}, {r.verdict ? VERDICTS[r.verdict] : 'Failed'}, {formatDate(r.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
