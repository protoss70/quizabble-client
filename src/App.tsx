import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TestingPage from './pages/testing';
import HomePage from './pages/home';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Test1 from './pages/test1';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<TestingPage />} />
        <Route path="/test1" element={<Test1 />} />
      </Routes>
    </Router>
  );
}

export default App;
