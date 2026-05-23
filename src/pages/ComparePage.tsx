import { useState } from 'react';
import { getPokemonDetails } from '../services/pokemon.service';
import type { Pokemon } from '../types/pokemon.interface';

export const ComparePage = () => {

    const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
    const [search1, setSearch1] = useState<string>('');
    const [loading1, setLoading1] = useState<boolean>(false);
    const [error1, setError1] = useState<string | null>(null);

    const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
    const [search2, setSearch2] = useState<string>('');
    const [loading2, setLoading2] = useState<boolean>(false);
    const [error2, setError2] = useState<string | null>(null);

    const handleSearch1 = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!search1.trim()) return;

        try {
            setLoading1(true);
            setError1(null);
            const data = await getPokemonDetails(search1.trim().toLowerCase());
            setPokemon1(data);
        
        } catch (error) {
            setPokemon1(null);
            setError1('No se encontró el Pokémon. Intenta con otro nombre o ID.');
        } finally {
            setLoading1(false);
        }
    };

    const handleSearch2 = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!search2.trim()) return;

        try {
            setLoading2(true);
            setError2(null);
            const data = await getPokemonDetails(search2.trim().toLowerCase());
            setPokemon2(data);
        
        } catch (error) {
            setPokemon2(null);
            setError2('No se encontró el Pokémon. Intenta con otro nombre o ID.');
        } finally {
            setLoading2(false);
        }
    };

    const getStatColor = (myStat: number, opponentStat: number | undefined) => {
        if (myStat > (opponentStat || 0)) return '#00ff0d';
        if (myStat < (opponentStat || 0)) return '#ff0000';
        return '#c7c7c7';
    };

    return (

    <div className="compare-page">

        <div style={{ alignItems: 'center', marginBottom: '30px' }}>

            <h1 style={{ backgroundColor: 'rgb(3, 30, 82)', color: 'white', margin: 0, padding: '20px', fontSize: '40px', textAlign: 'center',  }}>Comparador de Pokemones</h1>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '45px', padding: '20px 60px' }}>
            
            <div className="compare-slot" style={{ border: '2px solid #093b64', padding: '30px', borderRadius: '15px', backgroundColor: '#1e91f042' }}>
            <h2 className="compare-slot-title" style={{ fontSize: '32px', textAlign: 'center', marginTop: 0, marginBottom: '15px', color: '#093b64' }}>Pokémon 1</h2>
            <form onSubmit={handleSearch1} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                type="text" placeholder="Ej. charizard..." value={search1} onChange={(e) => setSearch1(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #1369af' }}
                />
                <button type="submit" style={{ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#0a588d', color: 'white', cursor: 'pointer' }}>Buscar</button>
            </form>

            {loading1 && <p>Buscando...</p>}
            {error1 && <p style={{ color: 'red' }}>{error1}</p>}

            {pokemon1 && (
                <div style={{ textAlign: 'center', color: '#093b64' }}>
                    <img src={pokemon1.sprites.other?.['official-artwork']?.front_default} alt={pokemon1.name} width="200" />
                    <h3 style={{ textTransform: 'uppercase' }}>{pokemon1.name}</h3>
                    
                    <div style={{ marginTop: '20px', textAlign: 'left', backgroundColor: '#0f689b', color: 'white', padding: '15px 50px', borderRadius: '10px' }}>
                            <h4 style={{ fontSize: '24px', textAlign: 'center', marginTop: '0px', marginBottom: '10px' }}>Estadísticas Base</h4>
                            {pokemon1.stats.map((stat, index) => {
                            const rivalStat = pokemon2?.stats[index]?.base_stat;
                            
                            return (
                                <div key={stat.stat.name} style={{ backgroundColor: '#0f689b', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #ffffff' }}>
                                <span style={{ textTransform: 'uppercase', fontSize: '20px', fontWeight: 'bold' }}>{stat.stat.name}</span>
                                <span style={{ 
                                    fontWeight: 'bold',
                                    fontSize: '24px', 
                                    color: getStatColor(stat.base_stat, rivalStat) 
                                }}>
                                    {stat.base_stat}
                                </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            </div>

            <div className="compare-slot" style={{ border: '2px solid #640964', padding: '30px', borderRadius: '15px', backgroundColor: '#f01ef042' }}>
                <h2 className="compare-slot-title" style={{ fontSize: '32px', textAlign: 'center', marginTop: 0, marginBottom: '15px',  }}>Pokémon 2</h2>
                <form onSubmit={handleSearch2} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input 
                    type="text" placeholder="Ej. blastoise..." value={search2} onChange={(e) => setSearch2(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #a213af' }}
                    />
                    <button type="submit" style={{ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#b310b9', color: 'white', cursor: 'pointer' }}>Buscar</button>
                </form>

                {loading2 && <p>Buscando...</p>}
                {error2 && <p style={{ color: 'red' }}>{error2}</p>}

                {pokemon2 && (
                    <div style={{ textAlign: 'center' }}>
                        <img src={pokemon2.sprites.other?.['official-artwork']?.front_default} alt={pokemon2.name} width="200" />
                        <h3 style={{ textTransform: 'uppercase' }}>{pokemon2.name}</h3>
                        
                        <div style={{ marginTop: '20px', textAlign: 'left', backgroundColor: '#9b0f94', color: 'white', padding: '15px 50px', borderRadius: '10px' }}>
                            <h4 style={{ fontSize: '24px', textAlign: 'center', marginTop: '0px', marginBottom: '10px' }}>Estadísticas Base</h4>
                            {pokemon2.stats.map((stat, index) => {
                            const rivalStat = pokemon1?.stats[index]?.base_stat;
                            
                            return (
                                <div key={stat.stat.name} style={{ backgroundColor: '#9b0f94', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #ffffff' }}>
                                <span style={{ textTransform: 'uppercase', fontSize: '20px', fontWeight: 'bold' }}>{stat.stat.name}</span>
                                <span style={{ 
                                    fontWeight: 'bold',
                                    fontSize: '24px', 
                                    color: getStatColor(stat.base_stat, rivalStat) 
                                }}>
                                    {stat.base_stat}
                                </span>
                                </div>
                            );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};