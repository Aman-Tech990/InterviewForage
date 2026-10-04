import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Button, DIFFICULTIES, Field, INTERVIEW_TYPES, PageHeader } from '../components/ui.jsx';

const EMPTY = { company: '', role: '', round: '', interviewType: 'DSA', difficulty: 'INTERMEDIATE', questions: '', preparation: '', overall: '', advice: '' };

export default function ExperienceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/experiences/${id}`).then(({ experience }) => setForm({ ...EMPTY, ...Object.fromEntries(Object.entries(experience).filter(([k, v]) => k in EMPTY && v !== null)) })).catch(setError);
  }, [id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const err = (key) => error?.details?.[key];

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { experience } = id ? await api.patch(`/experiences/${id}`, form) : await api.post('/experiences', form);
      navigate(`/experiences/${experience.id}`);
    } catch (e2) {
      setError(e2);
      setBusy(false);
    }
  }

  const text = (key, label, props = {}) => (
    <Field label={label} error={err(key)} hint={props.hint}>
      <textarea className="input min-h-[100px]" value={form[key]} onChange={set(key)} required={props.required} />
    </Field>
  );

  return (
    <>
      <PageHeader title={id ? 'Edit experience' : 'Share an experience'} description="Describe your own interview honestly. Do not include confidential company material or personal details about others." />
      <form onSubmit={submit} className="max-w-2xl space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company" error={err('company')}><input className="input" value={form.company} onChange={set('company')} required /></Field>
          <Field label="Role" error={err('role')}><input className="input" value={form.role} onChange={set('role')} required /></Field>
          <Field label="Round" error={err('round')}><input className="input" placeholder="For example: Onsite round 2" value={form.round} onChange={set('round')} required /></Field>
          <Field label="Interview type"><select className="input" value={form.interviewType} onChange={set('interviewType')}>{INTERVIEW_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></Field>
          <Field label="Difficulty"><select className="input" value={form.difficulty} onChange={set('difficulty')}>{DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}</select></Field>
        </div>
        {text('questions', 'Questions you were asked', { required: true })}
        {text('preparation', 'How you prepared')}
        {text('overall', 'Overall experience', { required: true })}
        {text('advice', 'Advice for other candidates')}
        {error && !error.details && <p role="alert" className="text-sm text-danger">{error.message}</p>}
        <div className="flex gap-3">
          <Button variant="primary" loading={busy}>{id ? 'Save changes' : 'Publish experience'}</Button>
          <Link to={id ? `/experiences/${id}` : '/experiences'} className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </>
  );
}
