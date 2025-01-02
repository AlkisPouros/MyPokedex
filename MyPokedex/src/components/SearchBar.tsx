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
            <Paper
                component = "form" sx={{p: '2px 2px', display: 'flex', alignItems: "center", width: 250, height: 28}}>
                <InputBase sx = {{ml : 1, flex: 1}} placeholder='Give pokemon id or name' inputProps={{'aria-label': 'give pokemon name or id', style: {fontSize: 13}}} value={searchItem} onChange={(e)=> setSearchQuery(e.target.value)}></InputBase>
                <Divider sx = {{ height : 20, m: 0.5 }} orientation="vertical"/>
                {foundPokemon ? (<Link to = {`/PokeInfo/${foundPokemon}`} state = {{id: Number(foundPokemon), sprite: spriteDataMap.get(Number(foundPokemon))?.front_sprite as string, sprite_back: spriteDataMap.get(Number(foundPokemon))?.back_sprite as string}}>
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