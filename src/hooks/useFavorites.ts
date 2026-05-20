import { useState, useEffect } from 'react';

export const useFavorites = (pokemonName: string) => {
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('pokedex_favorites') || '[]');
        setIsFavorite(storedFavorites.includes(pokemonName));
    }, [pokemonName]);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();

        const storedFavorites = JSON.parse(localStorage.getItem('pokedex_favorites') || '[]');
        let newFavorites;

        if (storedFavorites.includes(pokemonName)) {
            newFavorites = storedFavorites.filter((name: string) => name !== pokemonName);
            setIsFavorite(false);
        }
        else {
            newFavorites = [...storedFavorites, pokemonName];
            setIsFavorite(true);
        }
        localStorage.setItem('pokedex_favorites', JSON.stringify(newFavorites));
    };

    return { isFavorite, toggleFavorite };
}

