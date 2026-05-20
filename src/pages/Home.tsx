import { useEffect, useState } from 'react';
import { getPokemonList, getPokemonDetails, getPokemonTypes, getPokemonsByType } from '../services/pokemon.service';
import { PokemonCard } from '../components/PokemonCard';
import type { PokemonListItem } from '../types/pokemon.interface';

export const Home = () => {

    const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const limit = 24;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [types, setTypes] = useState<{name: string}[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [showFavorites, setShowFavorites] = useState<boolean>(false);

    const fetchPaginationPokemons = async() => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPokemonList(limit, offset);
            setPokemonList(data.results);
        } catch (err) {
            setError('No se pudieron cargar los Pokémon.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isSearching && !showFavorites) {
            fetchPaginationPokemons();
        }

        const fetchTypes = async () => {
            try {
                const data = await getPokemonTypes();
                setTypes(data);
            } catch (error) {
                console.error('Error al obtener los tipos de Pokémon:', error);
            }
        };
        fetchTypes();
    },[offset, isSearching, setShowFavorites]);


    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        const term = searchTerm.trim().toLowerCase();
        if (!term) return;

        try {
            setLoading(true);
            setError(null);
            setIsSearching(true);
            const data = await getPokemonDetails(term);
            setPokemonList([{ name: data.name, url: `https://pokeapi.co/api/v2/pokemon/${data.name}` }]);

        } catch (err) {
            setPokemonList([]);
            setError('No se encontró el Pokémon.');
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        setSelectedType(type);
        setSearchTerm('');
        setShowFavorites(false);

        if (type === '') {
            setIsSearching(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setIsSearching(true);
            const data = await getPokemonsByType(type);
            setPokemonList(data);

        } catch (error) {
            setPokemonList([]);
            setError('No se pudieron cargar los Pokémon de ese tipo.');
        } finally {
            setLoading(false);
        }
    }

    const toggleFavoritesView = () => {
        if (showFavorites) {
            setShowFavorites(false);
            setIsSearching(false);
            setError(null);
        } else {
            setShowFavorites(true);
            setIsSearching(true);
            setSearchTerm('');
            setSelectedType('');
        
            const storedFavorites = JSON.parse(localStorage.getItem('pokedex_favorites') || '[]');
            
            if (storedFavorites.length === 0) {
                setPokemonList([]);
                setError("Aún no tienes Pokémon guardados en tus favoritos. ¡Haz clic en el corazón de cualquier tarjeta para agregarlos!");
            } else {
                setError(null);
                const favoritesList = storedFavorites.map((name: string) => ({ name, url: '' }));
                setPokemonList(favoritesList);
            }
        }
  };

    const clearSearch = () => {
        setSearchTerm('');
        setIsSearching(false);
        setError(null);
    };


    const handleNextPage = () => setOffset(prevOffset => prevOffset + limit);
    const handlePrevPage = () => setOffset(prevOffset => Math.max(prevOffset - limit, 0));

    return (
        <div className="home">
            <h1>Pokédex</h1>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap', gap: '15px' }}>

                <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
                    <input type="text" placeholder="Buscar pokemon por nombre o ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px', width: '300px', borderRadius: '8px', border: '1px solid #ccc' }}/>
                    
                    <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'rgb(3, 30, 82)', color: 'white', cursor: 'pointer' }}>
                        Buscar
                    </button>

                    <select value={selectedType} onChange={handleTypeChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', textTransform: 'capitalize' }}>
                        <option value="">Todos</option>
                        {types.map((t) => (
                        t.name !== 'unknown' && t.name !== 'stellar' && (
                            <option key={t.name} value={t.name}>
                            {t.name}
                            </option>
                        )
                        ))}
                    </select>
                    
                    {isSearching && !showFavorites && (
                    <button type="button" onClick={clearSearch} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#28aaae', color: 'white', cursor: 'pointer' }}>
                        Limpiar
                    </button>
                    )}
                </form>

                <button onClick={toggleFavoritesView} style={{ padding: '10px 20px', marginTop: '20px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #000000', backgroundColor: showFavorites ? '#ae0101' : '#ae0101', color: showFavorites ? 'white' : '#ffffff', cursor: 'pointer', fontWeight: 'bold'}}> 
                    {showFavorites ? '← Volver al listado' : 'Ver Favoritos'}
                </button>

            </div>

            {loading && <p style={{ textAlign: 'center' }}>Cargando Pokémon...</p>}
            {error && <p className="error" style={{ textAlign: 'center' }}>{error}</p>}

            {!loading && !error && (
                <>
                    <div className="pokemon-list">
                    {pokemonList.map((pokemon) => (
                        <PokemonCard key={pokemon.name} name={pokemon.name} />
                    ))}
                    </div>

                    {!isSearching && (
                        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                            <button onClick={handlePrevPage} disabled={offset === 0} style={{ padding: '10px 20px', cursor: offset === 0 ? 'not-allowed' : 'pointer', borderRadius: '8px', border: 'none', backgroundColor: offset === 0 ? '#ccc' : 'rgb(3, 30, 82)', color: 'white', fontWeight: 'bold' }}>
                                Anterior
                            </button>

                            <span style={{ fontSize: '18px', fontWeight: 'bold', padding: '10px 20px', color: 'rgb(3, 30, 82)' }}>    
                                Página {(offset / limit) + 1}
                            </span>

                            <button onClick={handleNextPage} disabled={pokemonList.length < limit} style={{ padding: '10px 20px', cursor: pokemonList.length < limit ? 'not-allowed' : 'pointer', borderRadius: '8px', border: 'none', backgroundColor: pokemonList.length < limit ? '#ccc' : 'rgb(3, 30, 82)', color: 'white', fontWeight: 'bold' }}>
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};