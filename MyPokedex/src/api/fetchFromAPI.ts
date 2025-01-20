import { server_api_link } from "./PokeApiLinks";
import toast from 'react-hot-toast';


// NOTES!!!
// this is the interface for the pokemon type
// The pokeAPI is structured in a way that it doesn't give you the basic pokeInfo like the IDs, names and sprites at a single call.
// The main call contains info retured in an array API_RESPONSE.RESULTS which will return a set with index and json object which holds the properties name and url
// SO we create a type which can absorb such data and pass them inside our components

export interface pokemon {
    id: number;
    name: string;
    sprite: string;
}


// Here we fetch our favevourite pokemon from the api via a GET request in order to display these pokemon inside the Favourites page
// This is done by communicating with our Node server
export const fetchFromAPI = async (setFavePokemon: React.Dispatch<React.SetStateAction<pokemon[] | null>>) => {
    try {
        const response = await fetch(server_api_link);
        const data = await response.json();
        console.log(data as JSON);
        setFavePokemon(data);
        if(!response.ok)
        {
            toast.error(response.status + "Pokemon have not been fetched");   // Raise an error toast with the respective response code in case of a failed fetch
        }
    }
    catch(error) 
    {
        toast.error(error +" Unexpected error on fetching pokemon "); // Raise an error toast in case the server is down
    }
}


// ask server if there are any favourite pokemon added. If there are, update the UI, UX accordingly (we need persistance for anything a user is done)

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
            toast.error(response.status+ " Pokemon not found");   // In case of a failed fetch then raise an error toast according to the http error code returned
        }
    }
    catch(error) {
        toast.error(error + " Your Favourite pokemon has not been delivered")  // In case the node server is not available raise a toast error.
        setAddedPokemon([]);
    }
}

