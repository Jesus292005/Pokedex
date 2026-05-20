import type { PokemonListResponse, Pokemon, PokemonListItem } from '../types/pokemon.interface';

const API_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (limit = 24, offset = 0): Promise<PokemonListResponse> => {
    try{
        const response = await fetch(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);

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
        const response = await fetch(`${API_URL}/pokemon/${Name}`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener los detalles del Pokémon: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error al obtener los detalles del Pokémon:', error);
        throw error;
    }
};


export const getPokemonTypes = async (): Promise<{name: string, url: string}[]> => {
    try {
        const response = await fetch(`${API_URL}/type`);
        if (!response.ok) throw new Error(`Error al obtener los tipos de Pokémon`)
        const data = await response.json();
        
        return data.results;

    } catch (error) {
        console.error('Error al obtener los tipos de Pokémon:', error);
        throw error;
    }
}

export const getPokemonsByType = async (type: string): Promise<PokemonListItem[]> => {
    try {
        const response = await fetch(`${API_URL}/type/${type}`);
        if (!response.ok) throw new Error(`Error al obtener los Pokémon por tipo: ${type}`);
        const data = await response.json();

        return data.pokemon.map((item: any) => item.pokemon);
    
    } catch (error) {
        console.error('Error al obtener los Pokémon por tipo:', error);
        throw error;
    }
}
