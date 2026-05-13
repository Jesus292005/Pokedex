import './App.css'
import { useEffect, useState } from 'react'

// Conexión a la api de pokémon y mostrar los pokémon en la pantalla
function App() {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    // Conexión a la api de pokémon
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then(response => response.json())
      .then(data => {
        setPokemonList(data.results);
        console.log(data.results);
      })
      .catch(error => console.error('Error fetching Pokémon data:', error));
  }, []);


  return (
    <div className="app">
      <h1>Pokédex</h1>

      <h3>Lista de 20 Pokemones</h3>
      
      <div className="pokemon-list">
        {pokemonList.map((pokemon: any) => (
        <div key={pokemon.name} className="pokemon-item">
          <h3>{pokemon.url.split('/')[6]}.- {pokemon.name}</h3>
        </div>
      ))}
      </div>
    
    </div>
  );
}

export default App