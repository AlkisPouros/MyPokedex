import React, { useState } from 'react';
import { apiProps, spriteProps } from "../api/fetchFromPokeAPI";
import { Link } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputBase } from '@mui/material';


type SearchBarProps = {
    apiData: apiProps | null;   
    spriteDataMap: Map<number, spriteProps>;
  };

const SearchBar =  ({apiData, spriteDataMap}: SearchBarProps) => {

    const [ searchItem, setSearchQuery ] = useState("");
    const [ foundPokemonID, setFoundPokemonID ] = useState< string | null>(null);
    const [ foundPokeName, setFoundPokeName ] = useState< string | null>(null);
    
    const handleSearch = () => {
        
        const foundPokemon = apiData?.results.find((pokemon)=> {
            const pokeID = pokemon.url.split("/")[6];
            const pokeName = pokemon?.name;
            return pokeID === searchItem.toString() || pokeName === searchItem;
        })
        if(foundPokemon){
            const pokeID = foundPokemon.url.split("/")[6];
            setFoundPokemonID(pokeID);
            setFoundPokeName(foundPokemon?.name)
            console.log(pokeID);
        }else{
            alert("Pokemon not found");
            setFoundPokemonID(null);
        }
       
    }
    return(
        <>
            <Paper
                component = "form" sx={{p: '2px 2px', display: 'flex', alignItems: "center", width: 250, height: 28}}>
                <InputBase sx = {{ml : 1, flex: 1}} placeholder='Give pokemon id or name' inputProps={{'aria-label': 'give pokemon name or id', style: {fontSize: 13}}} value={searchItem} onChange={(e)=> setSearchQuery(e.target.value)}></InputBase>
                <Divider sx = {{ height : 20, m: 0.5 }} orientation="vertical"/>
                {foundPokemonID ? (<Link to = {`/PokeInfo/${foundPokemonID}`} state = {{id: Number(foundPokemonID) - 1, name: foundPokeName, sprite: spriteDataMap.get(Number(foundPokemonID))?.front_sprite as string, sprite_back: spriteDataMap.get(Number(foundPokemonID))?.back_sprite as string}}>
                                    <IconButton type="button" sx = {{p: '8px'}} aria-label="search">
                                        <SearchIcon/>
                                    </IconButton>
                                </Link>): 
                                (<IconButton type="button" sx = {{p: '8px'}} aria-label="search" onClick={(handleSearch)}>
                                    <SearchIcon/>
                                </IconButton>)}
            </Paper>  
        </>
    )
}


export default SearchBar