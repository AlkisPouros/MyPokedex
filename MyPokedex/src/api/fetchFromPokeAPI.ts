import toast from "react-hot-toast";


const API_POKE_DESC = import.meta.env.VITE_API_DESC_URL;
const API_URL = import.meta.env.VITE_API_URL;
const SERVER_POKE_ADDITION_URL = import.meta.env.VITE_SERVER_POKE_ADDITION_URL;
export const FIRST_POKEMON_ID = import.meta.env.VITE_FIRST_POKEMON_ID;
export const LAST_POKEMON_ID = import.meta.env.VITE_LAST_POKEMON_ID;

// Define the structure of a single Pokémon
export interface Pokemon {
  url: string;
  id: number;
  name: string;
  sprites: {
    front: string;
    back: string;
  };
}

export interface speciesData {
  flavor_text_entries: { language: { name: string }; flavor_text: string }[];
}

export type PokemonsData = {
  [key: number]: Pokemon;
};

export type PokemonDataIndexes = number[];

// Example of the structure of a single Pokémon based on the given Type
// [1, 2, 3, 4, 5, 6, 7]

// {150: {name: 'Mewtwo', url: '...', sprites: [], id: 150 }


//Fetching from PokeAPI the pokemon sprites
export const getPokemonSprite = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const pokemonSprite = await response.json();

    const PokemonSprites = {
      id,
      front: pokemonSprite["sprites"]["front_default"] as string,
      back: pokemonSprite["sprites"]["back_default"] as string,
    };

    return PokemonSprites;
  } catch (error) {
    console.error(error + " something went wrong");
  }
};
//Fetching from PokeAPI the pokemon info
export const fetchDataFromApi = async (number: number, maxValue: number) => {
  try {
    const response = await fetch(
      API_URL + `?offset=${number}&limit=${maxValue}`
    );
    const PokeData = await response.json();
    console.log(typeof PokeData.results);
    return PokeData.results;
  } catch (error) {
    toast.error(error + " Something went wrong");
  }
};

// POST Request to add a specific pokemon to the favourites list.
export const addToFavourites = async (
  number: number,
  sessionId: string,
) => {
  const response = await fetch(SERVER_POKE_ADDITION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: number,
      sessionId : sessionId,
    }),
  });
  const data = await response.json();
  if (data.responseCode === 201)
    toast.success(data.message);
  else
    toast.error(data.message);
  return response;
};

//Fetching from PokeAPI the pokemon description
export const getPokeDescription = async (num: number) => {
  try {
    const response = await fetch(`${API_POKE_DESC}/${num}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const pokeDesc = await response.json();
    console.log(pokeDesc);

    if (!response.ok) {
      toast.error(response.status + " server error");
      return;
    }
    return pokeDesc;
  } catch (error) {
    toast.error(error + " Something went wrong");
  }
};
