import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Button, DIFFICULTIES, Field, INTERVIEW_TYPES, PageHeader, Spinner } from '../components/ui.jsx';

export default function NewInterview() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ type: 'DSA', difficulty: 'INTERMEDIATE', questionCount: 5 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function start(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { interview } = await api.post('/interviews', { ...form, questionCount: Number(form.questionCount) });
      navigate(`/interviews/${interview.id}`);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <PageHeader title="Start interview" description="The interviewer asks a question, reads your answer, and decides whether to probe further or move on." />
      <form onSubmit={start} className="max-w-md space-y-5">
        <Field label="Topic">
          <select className="input" value={form.type} onChange={set('type')}>{INTERVIEW_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select>
        </Field>
        <Field label="Difficulty">
          <select className="input" value={form.difficulty} onChange={set('difficulty')}>{DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}</select>
        </Field>
        <Field label="Number of questions" hint="Follow-ups do not count toward this number.">
          <select className="input" value={form.questionCount} onChange={set('questionCount')}>{[3, 5, 7, 10].map((n) => <option key={n} value={n}>{n}</option>)}</select>
        </Field>
        {error && <p role="alert" className="text-sm text-danger">{error.message}</p>}
        <Button variant="primary" loading={busy}>{busy ? 'Preparing your first question' : 'Start interview'}</Button>
        {busy && <p className="flex items-center gap-2 text-sm text-muted"><Spinner /> This takes a few seconds.</p>}
      </form>
    </>
  );
}
