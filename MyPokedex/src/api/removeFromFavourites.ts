import toast from "react-hot-toast";
import { Pokemon } from "./fetchFromPokeAPI";

const SERVER_POKE_REMOVAL_URL = import.meta.env.VITE_SERVER_POKE_REMOVAL_URL;

export const removeFromFavourites = async (sessionID: string, pokeId: number) => {
  // Remove from localStorage immediately
  let updatedFavourites = JSON.parse(
    localStorage.getItem("favouritePokemons") || "[]"
  );
  updatedFavourites = updatedFavourites.filter((id: number) => id !== pokeId);

  // Update localStorage with the new list
  localStorage.setItem("favouritePokemons", JSON.stringify(updatedFavourites));

  updatedFavourites = updatedFavourites
    ? updatedFavourites.filter(
        (addedPokemon: Pokemon) => addedPokemon.id !== pokeId
      )
    : [];
  
  try {
    console.log(SERVER_POKE_REMOVAL_URL + `?sessionId=${sessionID}&pokeId=${pokeId.toString()}`);
    const sessionId = encodeURIComponent(sessionID);
    const response = await fetch(SERVER_POKE_REMOVAL_URL + `?sessionId=${sessionId}&pokeId=${pokeId.toString()}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.responseCode === 200) {
      toast.success(response.status + " " + data.message);
    } else toast.error(response.status + " " + data.message);
  } catch (error) {
    console.error(error + " Something went wrong");
  }
  return;
};
