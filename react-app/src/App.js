import React, { useState } from "react";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [id, setId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function fetchPokemons() {
    try {
      const res = await fetch("http://localhost:8888/api/v1/pokemons");
      console.log(res)
      if (!res.ok) throw new Error(`Failed to fetch pokemons: ${res.status}`);
      const dataAsString = await res.text();
      console.log(dataAsString)
      const data = JSON.parse(dataAsString);
      setPokemons(data);
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function fetchPokemon() {
    try {
      const res = await fetch(`/api/v1/pokemon?id=${id}`);
      if (!res.ok) throw new Error(`Failed to fetch pokemon: ${res.status}`);
      const data = await res.json();
      setPokemons(data);
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function addPokemon() {
    const data = { id: id };
    try {
      const res = await fetch("/api/v1/pokemon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error(`Failed to add pokemon: ${res.status}`);
      setId("");
      setErrorMsg("");
      fetchPokemons();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  return (
    <div>
      {errorMsg && <p>Error: {errorMsg}</p>}
      <h2>Pokemons</h2>
      <button onClick={fetchPokemons}>Fetch Pokemons</button>
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>{pokemon.name}</li>
        ))}
      </ul>
      <h2>Search Pokemon by ID</h2>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={fetchPokemon}>Search</button>
      <h3>Search Result</h3>
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>{pokemon.name}</li>
        ))}
      </ul>
      <h2>Add Pokemon</h2>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={addPokemon}>Add Pokemon</button>
    </div>
  );
}

export default App;
