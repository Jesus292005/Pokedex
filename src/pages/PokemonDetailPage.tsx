import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPokemonDetails } from '../services/pokemon.service';
import type { Pokemon } from '../types/pokemon.interface';

export const PokemonDetailPage = () => {
    const { name } = useParams<{ name: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            if (!name) return;
            try {
            const data = await getPokemonDetails(name);
            setPokemon(data);
            }
            catch (error) {
            console.error('Error fetching Pokémon details:', error);
            }
        };
        fetchPokemon();
    }, [name]);

    return (
    <div className="pokemon-detail-page">
      <Link to="/">← Volver al listado</Link>
      
      <div className="detail-header">
        <h1>{pokemon?.name?.toUpperCase()} #{pokemon?.id}</h1>
      </div>

      <img 
        src={pokemon?.sprites?.other?.['official-artwork']?.front_default} 
        alt={pokemon?.name} 
        width="250"
      />

      <div className="detail-info">
        <p><strong>Tipos:</strong> {pokemon?.types?.map(t => t.type.name).join(', ')}</p>
        <p><strong>Peso:</strong> {pokemon?.weight ? pokemon.weight / 10 : 0} kg</p>
        <p><strong>Altura:</strong> {pokemon?.height ? pokemon.height / 10 : 0} m</p>

        <div>
          <strong>Habilidades:</strong>
          <ul>
            {pokemon?.abilities?.map((a, index) => (
              <li key={a.ability?.name || index}>
                {a.ability?.name} {a.is_hidden ? '(Oculta)' : ''}
              </li>
            ))}
          </ul>
        </div>

        <div className="stats-section">
          <strong>Estadísticas Base:</strong>
          <ul>
            {pokemon?.stats?.map((s, index) => (
              <li key={s.stat?.name || index}>
                {s.stat?.name.toUpperCase()}: {s.base_stat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}