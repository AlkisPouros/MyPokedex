import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getPokeDescription, speciesData } from '../api/fetchFromPokeAPI';


const PokeInfo = () => {

    const location = useLocation();
    const { id, name, sprite, sprite_back } = location.state || {};
    const [PokespeciesData, setPokeSpeciesData] = React.useState<speciesData | null>(null);
   
    React.useEffect(() => {
        getPokeDescription(id as number, setPokeSpeciesData);
    }, []);
    
    // Retrieving the first flavor text in English
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
            <h2>Pokemon ID: {id}</h2>
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