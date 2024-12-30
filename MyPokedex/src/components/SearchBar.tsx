import React, { useState } from 'react';
import { apiProps, spriteProps } from "../api/fetchFromPokeAPI";
import { Link } from "react-router-dom";


type SearchBarProps = {
    apiData: apiProps | null;  
    spriteData: spriteProps | null;
  };

const SearchBar =  ({apiData, spriteData}: SearchBarProps) => {

    const [ searchItem, setSearchQuery ] = useState("");
    const [ foundPokemon, setFoundPokemon ] = useState< string | null>(null);
    
    
    const handleSearch = () => {
        if(searchItem)
        {
            const isNumeric = !isNaN(Number(searchItem));
            const searchKey = isNumeric ? Number(searchItem): searchItem.toLowerCase();
            const foundPokemon = apiData?.results.find((pokemon)=> {
                const pokeID = pokemon.url.split("/")[6];
                return pokeID === searchKey.toString();
            })
        
        if(foundPokemon){
            const pokeID = foundPokemon.url.split("/")[6];
            setFoundPokemon(pokeID)
            console.log(pokeID);
        }else{
            alert("Pokemon not found");
            setFoundPokemon(null);
        }}
    }
    return(


        <>
            <div className="input-box">
                <input type="text" value={searchItem} name="search form" onChange={(e)=> setSearchQuery(e.target.value)} placeholder="Give pokemon name or id"></input>
                
                {foundPokemon ? (
                    <Link to = {`/PokeInfo/${foundPokemon}`} state = {{id: Number(foundPokemon), sprite: spriteData?.front_sprite as string, sprite_back: spriteData?.back_sprite as string}}><button>Search</button></Link>) : (<button onClick={handleSearch}>Search</button>)}
                
            </div>
        </>
    )
}


export default SearchBar