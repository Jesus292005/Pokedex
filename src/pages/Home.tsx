import { useEffect, useState } from 'react';
import { getPokemonList } from '../services/pokemon.service';
import { PokemonCard } from '../components/PokemonCard';
import type { PokemonListItem } from '../types/pokemon.interface';

export const Home = () => {
    const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const fetchPokemons = async () => {
        try {
        setLoading(true);
        const data = await getPokemonList(20);
        setPokemonList(data.results);
        } catch (err) {
        setError('No se pudieron cargar los Pokémon.');
        } finally {
        setLoading(false);
        }
    };
    fetchPokemons();
    }, []);

    return (
        <div className="home">
            <h1>Pokédex</h1>
            <h3>Lista de 20 Pokemones</h3>
            
            {loading && <p>Cargando Pokémon...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <div className="pokemon-list">
                {pokemonList.map((pokemon) => (
                    <PokemonCard key={pokemon.name} name={pokemon.name} />
                ))}
                </div>
            )}
        </div>
    );
};