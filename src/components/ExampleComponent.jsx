import './ExampleComponent.css';
import React, { useEffect, useState } from "react";
import { SearchRounded } from "@material-ui/icons";
const POKEAPI_URL_POINT = 'https://pokeapi.co/api/v2/pokemon/';
const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';

function Pokemon({ id, name, img, verPokemon }) {
  return (
    <>
      <div className="pokemon_final p-2">
        <div role="button" className="card h-100 p-1 mt-3" onClick={verPokemon}>
          <img src={img} className='img-fluid' alt="..." />
          <div className="card-body bg-success bg-opacity-50 m-2 mt-4">
            <small className="card-text text-light badge bg-success">#{id}</small>
            <h5 className="card-title mt-2">{name}</h5>
          </div>
            <p className="text-muted text-center">Tap to open a card</p>
        </div>
      </div>
    </>
  );
};

function InfoPokemon({mostRar, pokemon, cerrar}) {
  return(
    <>
      <div className="info_pokemon_main position-fixed" onClick={cerrar} style={{ display: mostRar ? "grid" : "none" }}>
        <p role="button" className="text-light text-center">Tap To Close A Card</p>
        <div className="card mb-3">
          <div className="row g-0">
            <div className="col-md-6 text-center p-5">
              <img src={pokemon.img} className="img-fluid w-75 h-75" alt={pokemon.name} />
              {pokemon.types?.map(type => <div role="button" className="badge bg-success p-2 m-2">{type}</div>)}
            </div>
            <div className="col-md-6">
              <div className="card-body bg-success bg-opacity-50 m-3">
                <small role="button" className="badge bg-success p-2">#{pokemon.id}</small> 
                <h3 className="card-title m-1">{pokemon.name}</h3>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="ability text-center">
                    <h5 className="card-title">Ability</h5>
                    {pokemon.abilities?.map(ability => <div role="button" className="badge bg-success p-2 m-2">{ability}</div>)}
                  </div>
                </div>
                <h3 className="card-title m-1">Statistica</h3>
                <div className="row row-cols-1 row-cols-md-3 p-2">
                  {pokemon.stats?.map(stat => 
                    <section className="col text-center d-flex justify-content-center align-items-center p-2">
                      <div role="button" className="card">
                        <small>{stat.name}</small>
                        <h2>{stat.base}</h2>
                      </div>
                    </section>
                  )} 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function SearchPokemon({ pokSearch, setPokSearch, searchPokemon }) {
  return(
    <>
      <form onSubmit={searchPokemon} class="form-floating w-75 d-flex justify-content-center align-items-center">
        <input type="text" class="form-control w-75 h-25 m-2" id="floatingInput" placeholder="Search"
         value={pokSearch} 
         onChange={(e) => setPokSearch(e.target.value)} />
        <label for="floatingInput">Search id or name</label>
        <button type="submit" className="btn btn-success w-25 m-2"><SearchRounded /></button>
      </form>
    </>
  );
};

const ExampleComponent = () => {
  const [pokemon, setPokemon] = useState([]);
  const [signUrl, setSignUrl] = useState('');
  const [mostRar, setMostRar] = useState({ mostRar: false, pokemon: {} });
  const [pokSearch, setPokSearch] = useState('');

  const verPokemon = (pokemon) => setMostRar({ mostRar: true, pokemon });
  const noVerPokemon = () => {
    setMostRar({ mostRar: false, pokemon: {} });
    setPokSearch('');
  };

  const fetchPokemon = async (url) => {
    const response = await fetch(url);
    const pok = await response.json();

    const abilities = pok.abilities.map(a => a.ability.name);
    const stats = pok.stats.map(s => { return { name: s.stat.name, base: s.base_stat } });
    const types = pok.types.map(t => t.type.name );

    return {
      id: pok.id,
      name: pok.name,
      img: pok.sprites.other.dream_world.front_default || pok.sprites.front_default,
      abilities,
      stats,
      types
    }
  };

  const getPokemon = async (url = POKEAPI_URL) => {
    const response = await fetch(url);
    const resultPokemon = await response.json();
    const { next, results } = resultPokemon

    const FirstPokemon = await Promise.all(
      results.map((pokemon) => fetchPokemon(pokemon.url))
    )

    return{ next, FirstPokemon }
  };

  const receiverPokemon = async () => {
    const { next, FirstPokemon } = await getPokemon();
    setPokemon(FirstPokemon);
    setSignUrl(next);
  };

  const nextPokemon = async () => {
    const { next, FirstPokemon } = await getPokemon(signUrl);
    setPokemon(prev => [...prev, ...FirstPokemon]);
    setSignUrl(next);
  };

  const pokSearchSubmit = async (pokSearch) => {
    const url = `${POKEAPI_URL_POINT}${pokSearch.toLocaleLowerCase()}`;
    return await fetchPokemon(url);
  };

  const searchPokemon = async (e) => {
    e.preventDefault();

    if (!pokSearch) return

    const pokemon = await pokSearchSubmit(pokSearch);

    setMostRar({ mostRar: true, pokemon });
  };

  useEffect(() => { receiverPokemon() }, []);

  return (
    <>
      <div className="main">
        <div className="container">
          <div className="pokemon_main">
            <div className="search_bar p-4 d-flex justify-content-center align-items-center">
              <SearchPokemon pokSearch={pokSearch} setPokSearch={setPokSearch} pokSearchSubmit={pokSearchSubmit} searchPokemon={searchPokemon} />
            </div>
            <InfoPokemon { ...mostRar} cerrar={noVerPokemon} />
            <div className="row row-cols-1 row-cols-md-4 p-3">
              { pokemon.map(pokemon => <Pokemon {...pokemon} key={pokemon.id} verPokemon={() => verPokemon(pokemon)} /> )}
              <div className="btns d-flex justify-content-center align-items-center w-100">
                <button onClick={nextPokemon} className="btn btn-success w-25 mt-5 p-3">Load more</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExampleComponent;