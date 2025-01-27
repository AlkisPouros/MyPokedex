import { server_api_link } from "./PokeApiLinks";
import toast from 'react-hot-toast';


// Here we fetch our favevourite pokemon from the api via a GET request in order to display these pokemon inside the Favourites page
// This is done by communicating with our Node server



export interface FavouritePokemon  {
    id: number;
    name: string;
    sprite: string;

}


export const fetchFromAPI = async () => {
    try {
        const response = await fetch(server_api_link);
        const data = await response.json();
        console.log(data as JSON);
        if(!response.ok)
        {
            toast.error(response.status + " Pokemon have not been fetched");   // Raise an error toast with the respective response code in case of a failed fetch
        }
        else
        {
            return data;    
        }
    }
    catch(error) 
    {
        toast.error(error +" Unexpected error on fetching pokemon "); // Raise an error toast in case the server is down
    }
}


// ask server if there are any favourite pokemon added. If there are, update the UI, UX accordingly (we need persistance for anything a user is done)
// TODO: Should just return something
export const askServerForFavePomemon = async () => {
    
    try {
                const response = await fetch(server_api_link); // Make sure the API link is correct
                if (!response.ok) {
                toast.error(`Error fetching favorites: ${response.status}`);
                }
                const data = await response.json();
                return data; // Returning the parsed JSON data
                
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch favorites");
      }
        
      
}
