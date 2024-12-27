import React from 'react'
import { Link } from 'react-router-dom';
import { fetchDataFromApi, getPokemonSprites, addToFavourites, apiProps, spriteProps } from '../api/fetchFromPokeAPI';


const PokemonList = () => {
    const [apiData, setApiData] = React.useState<apiProps | null>(null);
    const [spriteData, setspriteData] = React.useState<spriteProps | null>(null);
    const [counter, setCounter] = React.useState<number>(0);

    React.useEffect(() => {
        fetchDataFromApi(counter, setApiData, apiData, counter);
      }, []);

    
      
      const getNext = (number: number)=>  {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const Nextnumber = number + 10;      
          setCounter(Nextnumber);
          fetchDataFromApi(Nextnumber, setApiData, apiData, counter);
      };
      
      
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
                        <td><input type="button" value = "view" onClick={()=>getPokemonSprites(index + counter, setspriteData)}></input></td>
                        <td><button type="button" onClick={()=> addToFavourites(index + counter, Object.values(info)[0] as string, spriteData?.front_sprite as string)}>Add</button></td>
                        <td>{spriteData && (<button type= "button"><Link to={`/PokeInfo/${index + counter}`} state = {{id: index + counter, name: Object.values(info)[0] as string, sprite: spriteData?.front_sprite as string, sprite_back: spriteData?.back_sprite as string}}>Info</Link></button>)}</td>
                    </tr>
             ))}
             
             </tbody>
            <input type="button" value = "next" onClick={() => getNext(counter)}></input>
            <button type="button"><Link to={'/Favourites'}>Favourites</Link></button>
        </table>
        </>
    )
}

export default PokemonList;