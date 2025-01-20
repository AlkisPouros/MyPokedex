import { server_api_link } from "./PokeApiLinks";
import toast from 'react-hot-toast';

export interface pokemon {
    id: number;
    name: string;
    sprite: string;
}
export const fetchFromAPI = async (setFavePokemon: React.Dispatch<React.SetStateAction<pokemon[] | null>>) => {
    try {
        const response = await fetch(server_api_link);
        const data = await response.json();
        console.log(data as JSON);
        setFavePokemon(data);
        if(!response.ok)
        {
            toast.error(response.status + "Pokemon have not been fetched");
        }
    }
    catch(error) 
    {
        toast.error(error +" Unexpected error on fetching pokemon ");
    }
}
export const askServerForFavePomemon = async (setAddedPokemon : React.Dispatch<React.SetStateAction<number[]>>) => {
    try {
        const response = await fetch(server_api_link);
        const data = await response.json();
        console.log(data as JSON);
        // Extract the `id` field from each object in the response
        const favoritesArray = data.map((item: { id: number }) => item.id);
        setAddedPokemon(favoritesArray); // Update state with the array of IDs
   
        if(!response.ok)
        {
            toast.error(response.status+ " Pokemon not found");
        }
    }
    catch(error) {
        toast.error(error + " Your Favourite pokemon has not been delivered")
        setAddedPokemon([]);
    }
}

