import type { PokemonListResponse, Pokemon } from '../types/pokemon.interface';

const API_URL = 'https://pokeapi.co/api/v2/pokemon';

export const getPokemonList = async (limit = 20): Promise<PokemonListResponse> => {
    try{
        const response = await fetch(`${API_URL}?limit=${limit}`);

        if (!response.ok) {
            throw new Error(`Error al obtener la lista de Pokémon`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error al obtener la lista de Pokémon:', error);
        throw error;
    }
};

export const getPokemonDetails = async (Name: string): Promise<Pokemon> => {
    try {
        const response = await fetch(`${API_URL}/${Name}`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener los detalles del Pokémon: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error al obtener los detalles del Pokémon:', error);
        throw error;
    }
};