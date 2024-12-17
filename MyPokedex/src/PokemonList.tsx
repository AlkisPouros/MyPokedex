import React from 'react'
import { apilink } from './PokeApiLinks';

interface apiProps{
    results : [];
}


const PokemonList = () => {
    const [apiData, setApiData] = React.useState<apiProps | null>(null);
      React.useEffect(() => {
        fetchDataApi();
      }, []);
    
      //Fetching form PokeAPI
      const fetchDataApi = async () => {
        try {
          const response = await fetch(apilink)
          const PokeData = await response.json();
          const pokemon = {
           results : PokeData?.results
          };  
         // For testing purposes
          setApiData(pokemon);
          console.log(apiData);
          console.log(PokeData);
          apiData?.results.map((info, index) => (
            console.log(index, info[1])))
        }
        catch (error)
        {
          console.error("Something went wrong", error);
        }
      }
    return (
        <table>
            <tbody>
                {apiData && apiData?.results.map((info, index) => (
                    <tr key = {index}>
                        <td>{index}</td>
                        <td>{Object.values(info)[0] as string}</td>
                    </tr>
             ))}
             </tbody>
            <input type="button" value = "next"></input>
        </table>
    )
}

export default PokemonList;