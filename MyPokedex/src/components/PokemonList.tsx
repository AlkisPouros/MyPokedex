import React from 'react'
import { Link } from 'react-router-dom';
import { fetchDataFromApi, addToFavourites, apiProps, spriteProps } from '../api/fetchFromPokeAPI';
import SearchBar from './SearchBar';

const PokemonList = () => {
    const [apiData, setApiData] = React.useState<apiProps | null>(null);
    const [spriteData, setspriteData] = React.useState<spriteProps | null>(null);
    const [counter, setCounter] = React.useState<number>(0);
    const [addedPokemons, setAddedPokemons] = React.useState<Set<number>>(new Set()); 
    const SearchAPIData = apiData || {results: []};
    const currentPokemonList = apiData ? apiData.results.slice(counter, counter + 10) : [];
    const [spriteDataMap, setSpriteDataMap] = React.useState<Map<number, spriteProps>>(new Map());  

    React.useEffect(() => {
        fetchDataFromApi(0, setApiData, apiData, 151, setspriteData, spriteDataMap, setSpriteDataMap);
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
      <SearchBar apiData = {SearchAPIData} spriteDataMap={spriteDataMap}/>
        <table>
            <tbody>
                {apiData && currentPokemonList.map((info, index) => {
                  const pokemonId = index + counter;  // ID for the Pokémon (page-specific)
                  const sprite = spriteDataMap.get(pokemonId + 1);  // Get the sprite for the current Pokémon from the Map
                  return(
                    <tr key = {pokemonId}>
                        <img src={sprite?.front_sprite} alt={info.name} width="70" height="70" />
                        <td>{index + counter}</td>                       
                        <td>{Object.values(info)[0] as string}</td>
                        <td>
                          {addedPokemons.has(index) ? (
                            <span>Pokemon Added</span> 
                              ) : (
                              <button type="button" onClick={() => handleAddToFavourites(index + counter, Object.values(info)[0] as string, sprite?.front_sprite as string)}>Add</button>)}
                        </td>
                          
                        <td>{spriteData && (<button type= "button"><Link to={`/PokeInfo/${index + counter}`} state = {{id: index + counter, name: Object.values(info)[0] as string, sprite: sprite?.front_sprite as string, sprite_back: sprite?.back_sprite as string}}>Info</Link></button>)}</td>
                    </tr>
                    );
              })}
             
             </tbody>
             <div>
                <button onClick={getPrevious} disabled={counter === 0}>Previous</button>
                <button onClick={getNext} disabled={counter + 10 >= (apiData?.results.length || 0)}>Next</button>
            </div>

            <button type="button"><Link to={'/Favourites'} state>Favourites</Link></button>
        </table>
        </>
    )
}

export default PokemonList;