import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { Button, ErrorState, ListSkeleton, ScoreBand, difficultyLabel, typeLabel } from '../components/ui.jsx';

const LEVEL = (n) => (n < 0 ? 'n/a' : `${n}/4`);

function Thinking() {
  return (
    <p className="flex items-center gap-1.5 text-sm text-muted" role="status">
      Interviewer is thinking
      {[0, 1, 2].map((i) => <span key={i} className="inline-block h-1 w-1 animate-blink rounded-full bg-muted" style={{ animationDelay: `${i * 0.2}s` }} />)}
    </p>
  );
}

function Evaluation({ evaluation }) {
  if (!evaluation) return null;
  return (
    <div className="mt-2 rounded-md bg-raised px-3 py-2 text-xs text-muted">
      <p className="font-mono">Correctness {LEVEL(evaluation.correctness)} - Reasoning {LEVEL(evaluation.reasoning)} - Communication {LEVEL(evaluation.communication)} - Answer score {evaluation.score}%</p>
      {evaluation.evidenceQuote && <p className="mt-1">You said: "{evaluation.evidenceQuote}"</p>}
      {evaluation.gaps?.length > 0 && <p className="mt-1">Gaps: {evaluation.gaps.join(', ')}</p>}
    </div>
  );
}

function Report({ interview }) {
  const { report, score } = interview;
  const List = ({ title, items }) => items?.length > 0 && (
    <div>
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted">{items.map((t) => <li key={t}>{t}</li>)}</ul>
    </div>
  );
  return (
    <section className="mb-10 space-y-6 rounded-lg border border-line p-5">
      <div className="flex items-baseline gap-4">
        <p className="font-mono text-4xl">{score ?? '-'}<span className="text-lg text-muted">%</span></p>
        <p className="text-sm"><ScoreBand score={score} /></p>
      </div>
      {report ? (
        <>
          <p className="max-w-2xl text-sm text-muted">{report.summary}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <List title="Strengths" items={report.strengths} />
            <List title="Weaknesses" items={report.weaknesses} />
          </div>
          {report.recommendedTopics?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium">What to practice next</h3>
              <ul className="divide-y divide-line rounded-md border border-line text-sm">
                {report.recommendedTopics.map((t) => (
                  <li key={t.topic} className="px-3 py-2.5"><p className="font-medium">{t.topic}</p><p className="text-muted">{t.reason} {t.practice}</p></li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : <p className="text-sm text-muted">No answers were submitted, so there is nothing to report on.</p>}
    </section>
  );
}

export default function InterviewSession() {
  const { id } = useParams();
  const { data, loading, error, reload } = useAsync(() => api.get(`/interviews/${id}`), [id]);
  const [interview, setInterview] = useState(null);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const endRef = useRef(null);

  useEffect(() => { if (data) setInterview(data.interview); }, [data]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [interview?.messages.length, busy]);

  async function run(call) {
    setBusy(true);
    setActionError(null);
    try {
      const result = await call();
      setInterview(result.interview);
      setAnswer('');
    } catch (err) {
      setActionError(err);
    } finally {
      setBusy(false);
    }
  }

  const submit = (e) => { e?.preventDefault(); if (answer.trim()) run(() => api.post(`/interviews/${id}/answer`, { answer })); };
  const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit(); };

  if (loading || (!interview && !error)) return <ListSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const done = interview.status === 'COMPLETED';

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <Link to="/interviews" className="text-sm text-muted hover:text-ink">Interviews</Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{typeLabel(interview.type)}</h1>
          <p className="text-sm text-muted">{difficultyLabel(interview.difficulty)}</p>
        </div>
        {!done && (
          <div className="flex items-center gap-4 text-sm">
            <span className="font-mono text-muted">Question {interview.questionsAsked} of {interview.questionCount}</span>
            <Button disabled={busy} onClick={() => window.confirm('End the interview now and see your results?') && run(() => api.post(`/interviews/${id}/finish`))}>Finish interview</Button>
          </div>
        )}
      </div>

      {done && <Report interview={interview} />}

      <ol className="space-y-6">
        {interview.messages.map((m) => (
          <li key={m.id} className={`border-l-2 pl-4 ${m.role === 'INTERVIEWER' ? 'border-brand' : 'border-line-strong'}`}>
            <p className="mb-1 text-xs text-muted">{m.role === 'INTERVIEWER' ? (m.kind === 'FOLLOW_UP' ? 'Interviewer, follow-up' : 'Interviewer') : 'You'}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
            <Evaluation evaluation={m.evaluation} />
          </li>
        ))}
      </ol>

      <div ref={endRef} className="mt-6">
        {busy && <Thinking />}
        {actionError && <p role="alert" className="mb-3 text-sm text-danger">{actionError.message}</p>}
        {!done && (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <label htmlFor="answer" className="sr-only">Your answer</label>
            <textarea id="answer" className="input min-h-[140px] resize-y font-sans" placeholder="Type your answer. Explain your reasoning as you would out loud." value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={onKey} disabled={busy} />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Ctrl or Cmd + Enter to send</span>
              <Button variant="primary" loading={busy} disabled={!answer.trim()}>Send answer</Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
