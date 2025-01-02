import { server_api_link } from "./PokeApiLinks";

export interface pokemon {
    id: number;
    name: string;
    sprite: string;
}

export const fetchFromAPI = async (FavPokemon: pokemon[] | null, setFavePokemon: React.Dispatch<React.SetStateAction<pokemon[] | null>>) => {
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

