import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col justify-center px-6">
      <p className="text-sm text-muted">Interview Forage</p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Practice interviews that answer back.
      </h1>
      <p className="mt-5 max-w-xl text-muted">
        Run mock technical interviews with follow-up questions, get your code reviewed with reasons, and read what other candidates actually faced.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/register" className="btn btn-primary">Create account</Link>
        <Link to="/login" className="btn">Sign in</Link>
      </div>
    </div>
  );
}
