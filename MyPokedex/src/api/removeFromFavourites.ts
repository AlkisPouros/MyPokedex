import toast from "react-hot-toast";
import { FavouritePokemon } from "./fetchFromAPI";
import { server_api_link } from "./PokeApiLinks";

export const removeFromFavourites = async (
  number: number,
  setFavePokemon: React.Dispatch<
    React.SetStateAction<FavouritePokemon[] | null>
  >
) => {
  // Remove from localStorage immediately
  let updatedFavourites = JSON.parse(
    localStorage.getItem("favouritePokemons") || "[]"
  );
  updatedFavourites = updatedFavourites.filter((id: number) => id !== number);

  // Update localStorage with the new list
  localStorage.setItem("favouritePokemons", JSON.stringify(updatedFavourites));
  // Optimistically remove the Pokémon from the local state immediately
  setFavePokemon((prevFavourites) =>
    prevFavourites
      ? prevFavourites.filter((pokemon) => pokemon.id !== number)
      : []
  );
  try {
    const response = await fetch(server_api_link, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: number,
      }),
    });
    if (response.ok) toast.success(response.status + " pokemon removed");
    else toast.error(response.status + " Pokemon isnt removed");
  } catch (error) {
    toast.error(error + " Something went wrong");
  }
};
