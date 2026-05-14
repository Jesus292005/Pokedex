import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PokemonDetailPage } from './pages/PokemonDetailPage';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App