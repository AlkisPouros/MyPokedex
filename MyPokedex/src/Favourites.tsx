import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';


interface pokemon {
    id: number;
    name: string;
    sprite: string;
}
const Favourites = () => {
    
    const [FavPokemon, setFavePokemon ] = React.useState<pokemon[] | null>(null);
    
    const fetchFromAPI = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/favourites');
            const data = await response.json();
            console.log(data as JSON);
            setFavePokemon(data);
        }
        catch(error) 
        {
            console.log("Pokemon has not been delivered ", error);
        }
    }
    useEffect(()=> {
        fetchFromAPI();
    },[])
    const removeFromFavourites = async (number: number)=>
    {
         // Optimistically remove the Pokémon from the local state immediately
        setFavePokemon((prevFavourites) => 
        prevFavourites ? prevFavourites.filter(pokemon => pokemon.id !== number) : []
        );
        try {
            const response = await fetch(`http://localhost:5000/api/favourites`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: number,
                })
            })
            if(response.ok)
            {
                console.log("pokemon removed");
            }
            else {

                console.error("Pokemon isnt removed");
            }
        }catch(error)
        {
            console.log("Something went wrong", error)
        }

    }
    return (

        <>
            <table>
                <tbody>
                    {FavPokemon && FavPokemon.map((info, index)=>(
                        <tr key = {index + 1}>
                            <td>{Object.values(info)[0] as number}</td>
                            <td>{Object.values(info)[1] as string}</td>
                            <td><img src={Object.values(info)[2] as string}></img></td>
                            <td><input type="button" value="Remove" onClick={()=> removeFromFavourites(Object.values(info)[0] as number)}></input></td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
            <button type="button"><Link to="/">Back</Link> </button>

        </>
    )


}

export default Favourites