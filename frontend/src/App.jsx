import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Admissions from './pages/Admissions';
import Fees from './pages/Fees';
import Hostel from './pages/Hostel';
import Reports from './pages/Reports';
import './styles/App.css';
import './styles/animations.css';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="App erp-main-content">
        <Navbar />
        <main className="erp-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/hostel" element={<Hostel />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;