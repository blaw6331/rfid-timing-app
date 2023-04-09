import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import RaceLoader from './componets/raceLoader';
import './App.css';
import '@cloudscape-design/global-styles/index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RaceLoader />} />
      </Routes>
    </Router>
  );
}
