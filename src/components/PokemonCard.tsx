import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPokemonDetails } from "../services/pokemon.service";
import  type { Pokemon } from "../types/pokemon.interface";

interface PokemonCardProps {
    name: string;
}

export const PokemonCard = ({ name }: PokemonCardProps) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const data = await getPokemonDetails(name);
                setPokemon(data);
            } catch (error) {
                console.error('Error al obtener los detalles del Pokémon:');
            }
        };
        fetchPokemonDetails();
    }, [name]);

    if (!pokemon) {
        return <div>Cargando...</div>;
    }

    return (
        <Link to={`/pokemon/${pokemon.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="pokemon-item card">
                <div className="card-header">
                    <span className="pokemon-id">#{pokemon.id}</span>
                    <h3>{pokemon.name.toUpperCase()}</h3>
                </div>

                <img 
                    src={pokemon.sprites.other?.['official-artwork']?.front_default} 
                    alt={pokemon.name} 
                    width="150"
                />
                
                <div className="pokemon-types">
                    {pokemon.types.map((t) => (
                        <span key={t.type.name} className="type-badge" style={{ marginRight: '5px' }}>
                        {t.type.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
  );
};
