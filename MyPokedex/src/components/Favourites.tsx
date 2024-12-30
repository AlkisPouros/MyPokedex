import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFromAPI, pokemon } from '../api/fetchFromAPI';
import { removeFromFavourites } from '../api/removeFromFavourites';


const Favourites = () => {
    
    const [FavPokemon, setFavePokemon ] = React.useState<pokemon[] | null>(null);
    
    useEffect(()=> {
        fetchFromAPI(FavPokemon, setFavePokemon);
    },[])

    return (

        <>
            <table>
                <tbody>
                    {FavPokemon && FavPokemon.length === 0 && (
                    <tr>
                        <td>No Pokémon Added</td>
                    </tr>
                    )}
                    {FavPokemon && FavPokemon.map((info, index)=>(
                        <tr key = {index + 1}>
                            <td>{Object.values(info)[0] as number}</td>
                            <td>{Object.values(info)[1] as string}</td>
                            <td><img src={Object.values(info)[2] as string}></img></td>
                            <td><input type="button" value="Remove" onClick={()=> removeFromFavourites(Object.values(info)[0] as number, setFavePokemon)}></input></td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
            <button type="button"><Link to="/">Back</Link> </button>

        </>
    )


}

export default Favourites