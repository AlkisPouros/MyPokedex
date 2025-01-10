import { server_api_link } from "./PokeApiLinks";

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
        
    }
    catch(error) 
    {
        console.log("Pokemon has not been delivered ", error);
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
    }
    catch(error) {
        console.log("Your Favevorite pokemon has not been delivered", error)
        return [];
    }
}

export const isAvailable = () => {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, 300, 'Request timed out');
    });

    const request = fetch(server_api_link);
    return Promise
        .race([timeout, request])
        .then(response => console.log('Here is your favourite pokemon list'))
        .catch(error => alert('Error 505, Server down'));
}

