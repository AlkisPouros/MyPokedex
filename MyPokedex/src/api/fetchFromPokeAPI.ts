import { apilink, server_api_link } from "../components/PokeApiLinks";


export interface apiProps {
    results : [];
}
export interface spriteProps {
  front_sprite: string;
  back_sprite: string;
}

//Fetching from PokeAPI the pokemon sprites
export const getPokemonSprites = async (num: number, setspriteData: React.Dispatch<React.SetStateAction<spriteProps | null>>) => {
        try{
          
            const response =  await fetch(`${apilink}/${num + 1}?offest=10&limit=10`);
            const pokemonSprite = await response.json();
          
            // For testing purposes
            const PokemonSprites = {
              front_sprite: pokemonSprite["sprites"]["front_default"] as string,
              back_sprite: pokemonSprite["sprites"]["back_default"] as string,
            }
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
export const fetchDataFromApi = async (number: number, setApiData: React.Dispatch<React.SetStateAction<apiProps | null>>, apiData: apiProps | null, counter: number) => {
        try {
          const response = await fetch(apilink + `?offset=${number}&limit=10`)
          const PokeData = await response.json();
          // For testing purposes
          const pokemon = {
           results : PokeData?.results,
          };  
         
          setApiData(pokemon);
          console.log(apiData);
          console.log(PokeData);
          apiData?.results.map((info, index) => (
            console.log(index + counter, info[1])))
          
        }
        catch (error)
        {
          console.error("Something went wrong", error);
        }
        
        
      }

export const addToFavourites = async (number : number, name : string, sprite: string ) => {
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
        {
          console.log("Pokemon added");
        }
        else{
          console.error("Pokemon hasnt been added");
        }
      }