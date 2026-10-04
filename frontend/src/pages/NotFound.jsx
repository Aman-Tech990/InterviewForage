import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid h-full place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-2 text-xl font-semibold">That page does not exist</h1>
        <Link to="/dashboard" className="btn btn-primary mt-6">Go to dashboard</Link>
      </div>
    </div>
  );
}
