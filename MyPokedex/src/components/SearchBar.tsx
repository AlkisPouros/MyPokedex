import React, { useState } from 'react';
import { apiProps, Pokemon, spriteProps } from "../api/fetchFromPokeAPI";
//import { Link } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
//import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputBase } from '@mui/material';


type SearchBarProps = {
    apiData: apiProps | null;   
    spriteDataMap: Map<number, spriteProps>;
    onPokemonData: (searchBarData: (Pokemon & {id: number;sprite?: spriteProps;})[]) => void;
    pokeNameDataMap: Map<number, string>;
};

const SearchBar =  ({apiData, spriteDataMap,onPokemonData,pokeNameDataMap}: SearchBarProps) => {

    const [ searchItem, setSearchQuery ] = useState("");
    // const [ foundPokemonID, setFoundPokemonID ] = useState< string | null>(null);
   // const [ filteredPokemon, setFilteredPokemon ] = React.useState<Pokemon[]>([]);
    

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!apiData) return;
        const searchValue = e.target.value.trim().toLowerCase();
        setSearchQuery(searchValue);
        if(isNaN(Number(searchItem))){
            const filtered = apiData.results
                .map((pokemon) => {
                const pokeID = parseInt(pokemon.url.split("/")[6], 10);
                const sprite = spriteDataMap.get(pokeID);
                const pokeName = pokeNameDataMap.get(pokeID)
                return { ...pokemon, id: pokeID, sprite, pokeName: pokeName };
            })
            .filter((pokemon) =>
                pokemon.pokeName?.toLowerCase().startsWith(searchValue.trim().toLowerCase())
            );
            console.log("Filtered Pokémon List in SearchBar:", filtered);
            onPokemonData(filtered);
        }
        
        console.log("here i am");
    }
    /** 
    const handleSearch = () => {
        
        setSearchQuery(searchItem);
        if (!isNaN(Number(searchItem))) {
            const id = Number(searchItem);
            if (id >= 1 && id <= 151) { 
                setFoundPokemonID(searchItem);
            } else {
                alert("No such Pokemon exists");
                setFoundPokemonID(null);
            }
        } else {
            alert("Enter a valid Pokémon ID");
            setFoundPokemonID(null);
        }*/
       
    
    return(
        <>
            <Paper
                component = "form" sx={{p: '2px 2px', display: 'flex', alignItems: "center", width: 250, height: 28}}>
                <InputBase sx = {{ml : 1, flex: 1}} placeholder='Give pokemon id or name' inputProps={{'aria-label': 'give pokemon name or id', style: {fontSize: 13}}} value={searchItem} onChange={handleSearchChange}></InputBase>
                <Divider sx = {{ height : 20, m: 0.5 }} orientation="vertical"/>
                {/**
                {foundPokemonID ? (<Link to = {`/PokeInfo/${foundPokemonID}`} state = {{id: Number(foundPokemonID), name: pokeNameDataMap.get(Number(foundPokemonID)), sprite: spriteDataMap.get(Number(foundPokemonID))?.front_sprite as string, sprite_back: spriteDataMap.get(Number(foundPokemonID))?.back_sprite as string}}>
                                    <IconButton type="button" sx = {{p: '8px'}} aria-label="search" onClick={handleSearch}>
                                        <SearchIcon/>
                                    </IconButton>
                                </Link>): 
                                (<IconButton type="button" sx = {{p: '8px'}} aria-label="search">
                                    <SearchIcon onClick={handleSearch}/>
                                </IconButton>)} */}
            </Paper>  
        </>
    )
}


export default SearchBar