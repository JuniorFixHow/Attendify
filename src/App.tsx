import './App.css'
import Session from './pages/session/Session'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ReactNode, useContext } from 'react'
import { AuthContext } from './context/AuthContext'

type ProtectedRouteProps = {
  children: ReactNode;
};

function App() {
  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    if (!user) {
      return <Navigate to="/login" />;
    } else {
      return children;
    }
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/sessions/:sessionId" element={
          <ProtectedRoute>
            <Session />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;