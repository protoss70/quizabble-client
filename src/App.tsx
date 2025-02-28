import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TestingPage from './pages/testing';
import HomePage from './pages/home';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Test1 from './pages/test1';
import Recorder from './pages/recorder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<TestingPage />} />
        <Route path="/test1" element={<Test1 />} />
        <Route path="/recorder" element={<Recorder />} />
      </Routes>
    </Router>
  );
}

export default App;
