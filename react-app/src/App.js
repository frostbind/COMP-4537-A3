import React, { useState } from "react";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [id, setId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const TOKEN_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDMzMjVhMzY3ZmZkY2YyNmExODc5N2YiLCJpYXQiOjE2ODEwOTgwOTB9.DWGpoqzqxRM6VbnboAVpgOsRszGLegANWZMIGGOZVVg'

  async function fetchPokemons() {
    try {
      console.log("Token: " + TOKEN_SECRET)
      const res = await fetch("http://localhost:8888/api/v1/pokemons", {
        method: "GET",
        headers: {
          'Authorization': TOKEN_SECRET,
          "Content-Type": "application/json"
        }
      });
      console.log(res)
      if (!res.ok) throw new Error(`Failed to fetch pokemons: ${res.status}`);
      const dataAsString = await res.text();
      console.log(dataAsString)
      const data = JSON.parse(dataAsString);
      console.log(data)
      setPokemons(data);
      console.log(pokemons)
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function fetchPokemon() {
    try {


      const res = await fetch(`/api/v1/pokemon?id=${id}`, {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + process.env.TOKEN_SECRET,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error(`Failed to fetch pokemon: ${res.status}`);

      const data = await res.json();

      setPokemons(data);
      console.log(pokemons)
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

  fetchPokemons();
  return (
    <div>
      {errorMsg && <p>Error: {errorMsg}</p>}
      {/* <h2>Pokemons</h2>
      <button onClick={fetchPokemons}>Fetch Pokemons</button>
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>{pokemon.name.english}</li>
        ))}
      </ul> */}
      <h2>Search Pokemon by ID</h2>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={fetchPokemon}>Search</button>
      {/* <h3>Search Result</h3> */}
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>
            <h3>{pokemon.name.english}</h3>
            <div>{pokemon.image}</div>
          </li>
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
