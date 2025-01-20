import toast from "react-hot-toast";
import { apilink, server_api_link, api_desc_link } from "./PokeApiLinks";

// Define the structure of a single Pokémon
export interface Pokemon {
  name: string;
  url: string;
}

export interface apiProps {
    results : Pokemon[];
}
export interface spriteProps {
  front_sprite: string;
  back_sprite: string;
}
export interface speciesData{
  flavor_text_entries: { language: { name: string }; flavor_text: string }[];
}

//Fetching from PokeAPI the pokemon sprites
export const getPokemonSprite = async (num: number, setspriteData: React.Dispatch<React.SetStateAction<spriteProps | null>>, spriteDataMap: Map<number, spriteProps>, setSpriteDataMap: React.Dispatch<React.SetStateAction<Map<number, spriteProps>>> ) => {
    try{
          
          
          const response =  await fetch(`${apilink}/${num}`);
          const pokemonSprite = await response.json();

          // For testing purposes
          const PokemonSprites = {
            front_sprite: pokemonSprite["sprites"]["front_default"] as string,
            back_sprite: pokemonSprite["sprites"]["back_default"] as string,
          }
            // Update the map with the sprite data
          spriteDataMap.set(num, PokemonSprites);

          // Update the state (force re-render if needed)
          setSpriteDataMap(new Map(spriteDataMap));

          console.log(pokemonSprite["sprites"]["front_default"]);
          console.log(pokemonSprite["sprites"]["back_default"] as string);
          setspriteData(PokemonSprites);
          
      }
      catch(error)
      {
        toast.error(error + " something went wrong");
      }
  }
//Fetching from PokeAPI the pokemon info 
export const fetchDataFromApi = async (number: number, setApiData: React.Dispatch<React.SetStateAction<apiProps | null>>, apiData: apiProps | null, counter: number, setSpriteData: React.Dispatch<React.SetStateAction<spriteProps | null>>, spriteDataMap: Map<number, spriteProps>, setSpriteDataMap : React.Dispatch<React.SetStateAction<Map<number, spriteProps>>>) => {
        try {
          if(apiData) return;
          const response = await fetch(apilink + `?offset=${number}&limit=${counter}`)
          const PokeData = await response.json();
          
          // Loop through each Pokémon and extract the ID from the URL
          
          PokeData.results.forEach((pokemon: Pokemon) => {
          // Extract the ID from the URL (assuming it's always the 6th part of the URL)
          const urlParts = pokemon.url.split('/');
          const pokemonId = parseInt(urlParts[6]);  // The ID is always at index 6

          // Call getPokemonSprites to fetch the sprite data for this Pokémon
          getPokemonSprite(pokemonId, setSpriteData, spriteDataMap, setSpriteDataMap);
        });          
          // For testing purposes
          const pokemon = {
           results : PokeData?.results,
        };  
         
          setApiData(pokemon);
          console.log(apiData);
          console.log(PokeData);
        }
        catch (error)
        {
          toast.error(error + " Something went wrong");
        }
       
        
      }

export const addToFavourites = async (number : number, name : string, sprite: string, setAddedPokemon:  React.Dispatch<React.SetStateAction<number[]>>) => { 
  try {
      const response = await fetch(server_api_link, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: number,
              name: name,
              sprite: sprite,
            }),
          });
          if(response.ok)
            toast.success(response.status + " Pokemon Added")
          else
          {
             toast.error(response.status + " Pokemon not added");
             setAddedPokemon((prev) => prev.filter((id) => id !== number));
          }
           
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }catch(error)
    {
      toast.error("503 Server is down");
      setAddedPokemon((prev) => prev.filter((id) => id !== number));
    }
    
 }

//Fetching from PokeAPI the pokemon description 
export const getPokeDescription = async (num : number) => {
    
      try {
          const response = await fetch(`${api_desc_link}/${num + 1}/`);
          const pokeDesc = await response.json();
          console.log(pokeDesc);
        
        if(!response.ok){toast.error(response.status + " server error")
          return; 
        }
        return pokeDesc;
          
       
      }
      catch(error)
      {
        toast.error(error+ " Something went wrong");
      }
}