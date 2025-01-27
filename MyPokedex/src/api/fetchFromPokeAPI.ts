import toast from "react-hot-toast";
import { apilink, server_api_link, api_desc_link } from "./PokeApiLinks";

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

export interface apiProps {
  results: Pokemon[];
}
export interface spriteProps {
  front_sprite: string;
  back_sprite: string;
}
export interface speciesData {
  flavor_text_entries: { language: { name: string }; flavor_text: string }[];
}

export type PokemonsData = {
  [key: number]: Pokemon;
};

// PokemonData[1]
export type PokemonDataIndexes = number[];

// [1, 2, 3, 4, 5, 6, 7]

// {150: {name: 'Mewtwo', url: '...', sprites: [], id: 150 }

// TODO: We need to rethink the structure of pokemon data
// Define the structure of a single Pokémon

//Fetching from PokeAPI the pokemon sprites
export const getPokemonSprite = async (id: number) => {
  try {
    const response = await fetch(`${apilink}/${id}`);
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
//   TODO: Should just return something. Then manage the return value in react in any way you want
export const fetchDataFromApi = async (number: number, maxValue: number) => {
  try {
    const response = await fetch(
      apilink + `?offset=${number}&limit=${maxValue}`
    );
    const PokeData = await response.json();
    console.log(PokeData.results);
    return PokeData.results;
  } catch (error) {
    toast.error(error + " Something went wrong");
  }
};

export const addToFavourites = async (
  number: number,
  name: string,
  sprite: string
) => {
  const response = await fetch(server_api_link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: number,
      name: name,
      sprite: sprite,
    }),
  });
  return response;
};

//Fetching from PokeAPI the pokemon description
export const getPokeDescription = async (num: number) => {
  try {
    const response = await fetch(`${api_desc_link}/${num + 1}/`);
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
