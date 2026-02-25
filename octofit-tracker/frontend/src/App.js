import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function NavBar() {
  const location = useLocation();
  const navItems = [
    { path: '/activities', label: 'Activities' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/teams', label: 'Teams' },
    { path: '/users', label: 'Users' },
    { path: '/workouts', label: 'Workouts' },
  ];
  return (
    <nav className="navbar navbar-expand-lg octofit-navbar mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">🏋️ OctoFit Tracker</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems.map(item => (
              <li className="nav-item" key={item.path}>
                <Link
                  className={`nav-link${location.pathname === item.path ? ' active' : ''}`}
                  to={item.path}
                >{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="octofit-hero">
      <h1>🏋️ OctoFit Tracker</h1>
      <p className="lead">Track activities, manage teams, and dominate the leaderboard!</p>
      <div className="row mt-4 g-3 justify-content-center">
        {[
          { path: '/activities', icon: '🏃', label: 'Activities' },
          { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
          { path: '/teams', icon: '👥', label: 'Teams' },
          { path: '/users', icon: '👤', label: 'Users' },
          { path: '/workouts', icon: '💪', label: 'Workouts' },
        ].map(item => (
          <div className="col-6 col-md-2" key={item.path}>
            <Link to={item.path} className="btn btn-outline-light w-100 py-3">
              <div style={{fontSize:'2rem'}}>{item.icon}</div>
              <div>{item.label}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
