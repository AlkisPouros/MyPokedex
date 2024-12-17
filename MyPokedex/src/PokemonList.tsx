import React from 'react'
import { apilink } from './PokeApiLinks';


const PokemonList = () => {
    const [apiData, setApiData] = React.useState();
      React.useEffect(() => {
        fetchDataApi();
      }, []);
    
      //Fetching form PokeAPI
      const fetchDataApi = async () => {
        try {
          const response = await fetch(apilink)
          const PokeData = await response.json();
          setApiData(PokeData);
          console.log(apiData);
        }
        catch (error)
        {
          console.error("Something went wrong", error);
        }
      }
    return (
        <div>
            <h1>Hello there</h1>
        </div>
    )
}

export default PokemonList;