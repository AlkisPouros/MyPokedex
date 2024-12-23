import React from 'react'
import { apilink } from './PokeApiLinks';
import { Link } from 'react-router-dom';

interface apiProps {
    results : [];
}
interface spriteProps {
  front_sprite: string;
  back_sprite: string;
}

//const pokemonCount = 151;


const PokemonList = () => {
    const [apiData, setApiData] = React.useState<apiProps | null>(null);
    const [spriteData, setspriteData] = React.useState<spriteProps | null>(null);
    const [counter, setCounter] = React.useState<number>(0);
    React.useEffect(() => {
        fetchDataFromApi(counter);
      }, []);

    //Fetching from PokeAPI the pokemon sprites
      const getPokemonSprites = async (num: number) => {
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
      //Fetching from PokeAPI
      const fetchDataFromApi = async (number: number) => {
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
      
      const getNext = (number: number)=>  {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const Nextnumber = number + 10;      
          setCounter(Nextnumber);
          fetchDataFromApi(Nextnumber);
      };
      const addToFavourites = async (number : number, name : string, sprite: string ) => {
        const response = await fetch('http://localhost:5000/api/favourites', {
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
      
    return (
      <>
      <table>
        <tbody>
          <tr>
            <td>
            <div><img src = {spriteData?.front_sprite as string}></img></div>
            </td>
          </tr>
        </tbody>
      </table>
        <table>
            <tbody>
                {apiData && apiData?.results.map((info, index) => (
                    <tr key = {index + 1}>
                        <td>{index + counter}</td>
                        <td>{Object.values(info)[0] as string}</td>
                        <td><input type="button" value = "view" onClick={()=>getPokemonSprites(index + counter)}></input></td>
                        <td><button type="button" onClick={()=> addToFavourites(index + counter, Object.values(info)[0] as string, spriteData?.front_sprite as string)}>Add</button></td>
                        <td><button type="button"><Link to={'/Favourites'}>Favourites</Link></button></td>
                        
                    </tr>
             ))}
             
             </tbody>
            <input type="button" value = "next" onClick={() => getNext(counter)}></input>
        </table>
        </>
    )
}

export default PokemonList;