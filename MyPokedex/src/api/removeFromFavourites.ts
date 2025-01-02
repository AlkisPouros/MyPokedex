
import { pokemon } from "./fetchFromAPI";
import { server_api_link } from "./PokeApiLinks";

export const removeFromFavourites = async (number: number, setFavePokemon: React.Dispatch<React.SetStateAction<pokemon[] | null>>)=>
    {
         // Optimistically remove the Pokémon from the local state immediately
        setFavePokemon((prevFavourites) => 
        prevFavourites ? prevFavourites.filter(pokemon => pokemon.id !== number) : []
        );
        try {
            const response = await fetch(server_api_link, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: number,
                })
            })
            if(response.ok)
            {
                console.log("pokemon removed");
            }
            else {

                console.error("Pokemon isnt removed");
            }
        }catch(error)
        {
            console.log("Something went wrong", error)
        }

    }