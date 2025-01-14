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
export const getPokemonSprites = async (num: number, setspriteData: React.Dispatch<React.SetStateAction<spriteProps | null>>, spriteDataMap: Map<number, spriteProps>, setSpriteDataMap: React.Dispatch<React.SetStateAction<Map<number, spriteProps>>> ) => {
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

          setspriteData(PokemonSprites); 
          console.log(pokemonSprite["sprites"]["front_default"]);
          console.log(pokemonSprite["sprites"]["back_default"] as string);
          setspriteData(PokemonSprites);
          
      }
      catch(error)
      {
        console.error("something went wrong " + error);
      }
  }
//Fetching from PokeAPI the pokemon info 
export const fetchDataFromApi = async (number: number, setApiData: React.Dispatch<React.SetStateAction<apiProps | null>>, apiData: apiProps | null, counter: number, setSpriteData: React.Dispatch<React.SetStateAction<spriteProps | null>>, spriteDataMap: Map<number, spriteProps>, setSpriteDataMap : React.Dispatch<React.SetStateAction<Map<number, spriteProps>>>, pokeNameDataMap: Map<number, string>, setPokeNameDataMap: React.Dispatch<React.SetStateAction<Map<number, string>>>) => {
        try {
          const response = await fetch(apilink + `?offset=${number}&limit=${counter}`)
          const PokeData = await response.json();
          
          // Loop through each Pokémon and extract the ID from the URL
          PokeData.results.forEach((pokemon: Pokemon) => {
          // Extract the ID from the URL (assuming it's always the 6th part of the URL)
          const urlParts = pokemon.url.split('/');
          const pokemonId = parseInt(urlParts[6]);  // The ID is always at index 6

          // Call getPokemonSprites to fetch the sprite data for this Pokémon
          getPokemonSprites(pokemonId, setSpriteData, spriteDataMap, setSpriteDataMap);
        });          


          // For testing purposes
          const pokemon = {
           results : PokeData?.results,
          };  
         
          setApiData(pokemon);
          console.log(apiData);
          console.log(PokeData);
          apiData?.results.map((info, index) => (
            pokeNameDataMap.set(index + 1, Object.values(info)[0] as string)))
          
        }
        catch (error)
        {
          console.error("Something went wrong", error);
        }
        setPokeNameDataMap(pokeNameDataMap);
        
      }

export const addToFavourites = async (number : number, name : string, sprite: string) => { 
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
    }catch(error)
    {
      alert("Server is down " + error)
    }
    
 }

//Fetching from PokeAPI the pokemon description 
export const getPokeDescription = async (num : number, setPokeSpeciesData: React.Dispatch<React.SetStateAction<speciesData | null>>) => {
      
      try {
        const response = await fetch(`${api_desc_link}/${num + 1}/`);
        const pokeDesc = await response.json();
        console.log(pokeDesc);
        setPokeSpeciesData(pokeDesc);
        
      }
      catch(error)
      {
        alert("Something went wrong error "+ error);
      }
}