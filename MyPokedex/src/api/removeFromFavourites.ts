import toast from "react-hot-toast";
import { FavouritePokemon } from "./fetchFromAPI";

const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const removeFromFavourites = async (number: number) => {
  // Remove from localStorage immediately
  let updatedFavourites = JSON.parse(
    localStorage.getItem("favouritePokemons") || "[]"
  );
  updatedFavourites = updatedFavourites.filter((id: number) => id !== number);

  // Update localStorage with the new list
  localStorage.setItem("favouritePokemons", JSON.stringify(updatedFavourites));

  updatedFavourites = updatedFavourites
    ? updatedFavourites.filter(
        (addedPokemon: FavouritePokemon) => addedPokemon.id !== number
      )
    : [];
  
  try {
    const response = await fetch(SERVER_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: number,
      }),
    });
    if (response.ok) {
      toast.success(response.status + " pokemon removed");
    } else toast.error(response.status + " Pokemon isnt removed");
  } catch (error) {
    toast.error(error + " Something went wrong");
  }
  return;
};
