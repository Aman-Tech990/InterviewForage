import { AlertCircle, Inbox } from 'lucide-react';

export function Button({ variant = 'default', className = '', loading, children, ...props }) {
  const styles = { default: 'btn', primary: 'btn btn-primary', ghost: 'btn btn-ghost' }[variant];
  return (
    <button className={`${styles} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function Spinner({ className = '' }) {
  return <span role="status" aria-label="Loading" className={`inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />;
}

export function Field({ label, hint, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-danger" role="alert">{error}</p> : hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-xl text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded bg-raised ${className}`} />;
}

export function ListSkeleton({ rows = 4 }) {
  return <div className="space-y-3" aria-busy="true">{Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-14" />)}</div>;
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-line-strong px-6 py-14 text-center">
      <Inbox className="mb-3 h-6 w-6 text-faint" aria-hidden="true" />
      <p className="font-medium">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-lg border border-danger/40 bg-danger/5 p-4">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
      <div className="text-sm">
        <p>{error?.message ?? 'Something went wrong.'}</p>
        {onRetry && <button onClick={onRetry} className="mt-2 text-brand hover:text-brand-hover">Try again</button>}
      </div>
    </div>
  );
}

export function Pagination({ pagination, onChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages } = pagination;
  return (
    <div className="mt-6 flex items-center justify-between text-sm text-muted">
      <span>Page {page} of {totalPages}</span>
      <div className="flex gap-2">
        <Button disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
        <Button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
}

const TYPE_LABELS = {
  DSA: 'Data structures and algorithms', SYSTEM_DESIGN: 'System design', CS_FUNDAMENTALS: 'CS fundamentals',
  AI_GENAI: 'AI and generative AI', BEHAVIORAL: 'Behavioral', MIXED: 'Mixed',
};
export const INTERVIEW_TYPES = Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }));
export const typeLabel = (type) => TYPE_LABELS[type] ?? type;
export const DIFFICULTIES = [
  { value: 'BEGINNER', label: 'Beginner' }, { value: 'INTERMEDIATE', label: 'Intermediate' }, { value: 'ADVANCED', label: 'Advanced' },
];
export const difficultyLabel = (d) => DIFFICULTIES.find((x) => x.value === d)?.label ?? d;
export const formatDate = (value) => new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export function ScoreBand({ score }) {
  if (score === null || score === undefined) return <span className="text-muted">No score</span>;
  const [label, color] = score >= 80 ? ['Strong', 'text-ok'] : score >= 60 ? ['Solid', 'text-accent'] : score >= 40 ? ['Developing', 'text-warn'] : ['Needs work', 'text-danger'];
  return <span className={color}>{label}</span>;
}
