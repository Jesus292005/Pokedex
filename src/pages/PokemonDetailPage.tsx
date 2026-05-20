import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPokemonDetails } from '../services/pokemon.service';
import type { Pokemon } from '../types/pokemon.interface';
import { useFavorites } from '../hooks/useFavorites';

export const PokemonDetailPage = () => {
    const { name } = useParams<{ name: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { isFavorite, toggleFavorite } = useFavorites(name || '');

    useEffect(() => {
        const fetchPokemon = async () => {
            if (!name) return;
            try {
            const data = await getPokemonDetails(name);
            setPokemon(data);
            setLoading(false);
            }
            catch (error) {
            console.error('Error fetching Pokémon details:', error);
            setError('Error al cargar los detalles del Pokémon');
            setLoading(false);
            }
        };
        fetchPokemon();
    }, [name]);

    if (loading) return <div>Cargando detalles de {name}...</div>;
    if (error || !pokemon) return <div>Error al cargar el Pokémon. <Link to="/">Volver</Link></div>;

    return (
    <div className="pokemon-detail-page">
      <Link to="/">← Volver al listado</Link>
      
      <div className="detail-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <h1>{pokemon.name.toUpperCase()} #{pokemon.id}</h1>
        <button 
          onClick={toggleFavorite} 
          style={{ background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer' }}
          title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
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