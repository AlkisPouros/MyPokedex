import React from 'react'
import { Link } from 'react-router-dom';
import { fetchDataFromApi, getPokemonSprites, addToFavourites, apiProps, spriteProps } from '../api/fetchFromPokeAPI';
import SearchBar from './SearchBar';

const PokemonList = () => {
    const [apiData, setApiData] = React.useState<apiProps | null>(null);
    const [spriteData, setspriteData] = React.useState<spriteProps | null>(null);
    const [counter, setCounter] = React.useState<number>(0);
    const [addedPokemons, setAddedPokemons] = React.useState<Set<number>>(new Set()); 
    const SearchAPIData = apiData || {results: []};
    const currentPokemonList = apiData ? apiData.results.slice(counter, counter + 10) : [];
    

    React.useEffect(() => {
        fetchDataFromApi(0, setApiData, apiData, 151);
      }, []);

    
      
    const getNext = ()=>  {
      setCounter(prevCounter => prevCounter + 10);  // Increment counter by 10
    };
      
    // Handle pagination: display previous 10 Pokémon
    const getPrevious = () => {
      setCounter(prevCounter => prevCounter - 10);  // Decrement counter by 10
    };

    const handleAddToFavourites = (index: number, name: string, sprite: string) => {
      addToFavourites(index, name, sprite, setAddedPokemons);
    };
    
    return (
      <>
      <SearchBar apiData = {SearchAPIData} spriteData={spriteData}/>
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
                {apiData && currentPokemonList.map((info, index) => (
                    <tr key = {index + 1}>
                        <td>{index + counter}</td>
                        <td>{Object.values(info)[0] as string}</td>
                        <td><input type="button" value = "view" onClick={()=>getPokemonSprites(index + counter, setspriteData)}></input></td>
                        <td>
                          {addedPokemons.has(index) ? (
                            <span>Pokemon Added</span> 
                              ) : (
                              <button type="button" onClick={() => handleAddToFavourites(index, Object.values(info)[0] as string, spriteData?.front_sprite as string)}>Add</button>)}
                        </td>
                          
                        <td>{spriteData && (<button type= "button"><Link to={`/PokeInfo/${index + counter}`} state = {{id: index + counter, name: Object.values(info)[0] as string, sprite: spriteData?.front_sprite as string, sprite_back: spriteData?.back_sprite as string}}>Info</Link></button>)}</td>
                    </tr>
             ))}
             
             </tbody>
             <div>
                <button onClick={getPrevious} disabled={counter === 0}>Previous</button>
                <button onClick={getNext} disabled={counter + 10 >= (apiData?.results.length || 0)}>Next</button>
            </div>

            <button type="button"><Link to={'/Favourites'}>Favourites</Link></button>
        </table>
        </>
    )
}

export default PokemonList;