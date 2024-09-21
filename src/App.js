import React, { useState, useEffect } from 'react';
import PokemonList from './components/PokemonList';
import './App.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(response => response.json())
      .then(data => {
        const fetches = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        Promise.all(fetches).then(pokemonData => setPokemons(pokemonData));
      });
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Autocomplete suggestions
    if (value) {
      const filteredSuggestions = pokemons
        .filter(pokemon => pokemon.name.toLowerCase().startsWith(value.toLowerCase()))
        .map(pokemon => pokemon.name);
      setSuggestions(filteredSuggestions.slice(0, 5)); // Limit suggestions to 5
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Pokémon List</h1>
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <ul className="suggestions">
        {suggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
      <PokemonList pokemons={filteredPokemons} />
    </div>
  );
}

export default App;
