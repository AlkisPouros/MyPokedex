import toast from "react-hot-toast";
import { PokemonsData } from "./fetchFromPokeAPI";

const SERVER_POKE_RETRIEVAL_API_URL = import.meta.env
  .VITE_SERVER_POKE_RETRIEVAL_URL;

// Here we fetch our favevourite pokemon from the api via a GET request in order to display these pokemon inside the Favourites page
// This is done by connected to our Node server (index.ts)

export interface FavouritePokemon {
  id: number;
  name: string;
  sprite: string;
}

export const buildUpPokemonData = (
  FavouritePokemonID: number[],
  pokemonData: {
    dictionary: PokemonsData;
    orderList: number[];
  } | null
) => {
  const FavouritePokemon = pokemonData?.orderList
    .filter((id: number) => {
      if (FavouritePokemonID?.includes(id)) return id;
    })
    .map((id: number) => {
      return pokemonData?.dictionary[id];
    });
  console.log(pokemonData?.dictionary[1]);
  return FavouritePokemon;
};

// Asking the Node server if there are any favourite pokemon added. If there are, update the UI, UX accordingly (we need persistance for anything a user is done)
export const askServerForFavePomemon = async (
  sessionID: string,
  pokemonData: {
    dictionary: PokemonsData;
    orderList: number[];
  } | null
) => {
  console.log(SERVER_POKE_RETRIEVAL_API_URL + `?sessionId=${sessionID}`);
  const sessionId = encodeURIComponent(sessionID);
  try {
    const response = await fetch(
      SERVER_POKE_RETRIEVAL_API_URL + `?sessionId=${sessionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok && !sessionId) {
      toast.error(`Error fetching favourites: ${response.status}`);
    }
    const data = await response.json();
    if (data.responseCode === 200 && data.FavouritePokemon.length > 0) {
      const FavouritePokemonID = data.FavouritePokemon;
      const FavouritePokemon = buildUpPokemonData(
        FavouritePokemonID as number[],
        pokemonData
      );
      return { FavouritePokemon, FavouritePokemonID };
    }
    if (data.responseCode === 200) {
      console.log("No pokemon returned");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error("Failed to fetch favourites");
  }
};
