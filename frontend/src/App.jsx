import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { Spinner } from './components/ui.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Interviews from './pages/Interviews.jsx';
import NewInterview from './pages/NewInterview.jsx';
import InterviewSession from './pages/InterviewSession.jsx';
import Experiences from './pages/Experiences.jsx';
import ExperienceForm from './pages/ExperienceForm.jsx';
import ExperienceDetail from './pages/ExperienceDetail.jsx';
import NotFound from './pages/NotFound.jsx';

// The code editor is large, so it only loads when the code review page is opened.
const CodeReview = lazy(() => import('./pages/CodeReview.jsx'));

function Protected({ children }) {
  const { user, restoring } = useAuth();
  if (restoring) return <div className="grid h-full place-items-center text-muted"><Spinner /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function GuestOnly({ children }) {
  const { user, restoring } = useAuth();
  if (restoring) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Suspense fallback={<div className="grid h-full place-items-center text-muted"><Spinner /></div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
        <Route element={<Protected><Layout /></Protected>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/interviews/new" element={<NewInterview />} />
          <Route path="/interviews/:id" element={<InterviewSession />} />
          <Route path="/code-review" element={<CodeReview />} />
          <Route path="/code-review/:id" element={<CodeReview />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experiences/new" element={<ExperienceForm />} />
          <Route path="/experiences/:id" element={<ExperienceDetail />} />
          <Route path="/experiences/:id/edit" element={<ExperienceForm />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
