import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { api_desc_link } from './PokeApiLinks';

// Define a type for the flavor text entries
interface FlavorTextEntry {
    flavor_text: string;
    language: { name: string };
  }
  
  // Define the speciesData interface with the correct structure
  interface speciesData {
    flavor_text_entries: FlavorTextEntry[];  // An array of FlavorTextEntry
  }

const PokeInfo = ()=> {

    const location = useLocation();
    const { id, name, sprite, sprite_back } = location.state || {};
    const [PokespeciesData, setPokeSpeciesData] = React.useState<speciesData | null>(null);
   
    React.useEffect(() => {
        getPokeDescription(id as number);
    }, []);
     //Fetching from PokeAPI the pokemon description 
    const getPokeDescription = async (num : number) => {
      
      try {
        const response = await fetch(`${api_desc_link}/${num + 1}/`);
        const pokeDesc = await response.json();
        console.log(pokeDesc);
      
        setPokeSpeciesData(pokeDesc);
        
      }
      catch(error)
      {
        console.error("Something went wrong error "+ error);
      }
    }
    // Retrieve the first flavor text in English
    const getFirstFlavorText = () => {
        if (PokespeciesData?.flavor_text_entries) {
        // Find the first entry with language 'en'
        const firstEntry = PokespeciesData.flavor_text_entries.find(
            (entry) => entry.language.name === 'en'
        );
            return firstEntry?.flavor_text;
        }
            return null;
        };

    return(

        <>
            
            <h2>{name}</h2>
            <img src={sprite}></img>
            <img src={sprite_back}></img>
            <h2>Pokemon ID: {id + 1}</h2>
            <button type="button"><Link to="/">Back</Link> </button>
            {getFirstFlavorText() ? (
                <div>
                    <p>{getFirstFlavorText()}</p>
                </div>
                ) : (
                    <div>No English description available</div>
                )}
        </>
    )
}


export default PokeInfo;