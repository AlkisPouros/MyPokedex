import React, { useState } from 'react';
import { apiProps, Pokemon, spriteProps } from "../api/fetchFromPokeAPI";
import { Link, useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputBase } from '@mui/material';
import toast  from 'react-hot-toast';


type SearchBarProps = {
    apiData: apiProps | null;   
    spriteDataMap: Map<number, spriteProps>;
    onPokemonData: (searchBarData: (Pokemon & {id: number;sprite?: spriteProps;})[]) => void;
};

const SearchBar =  ({apiData, spriteDataMap,onPokemonData}: SearchBarProps) => {

    const [ searchItem, setSearchQuery ] = useState("");
    const [ foundPokemonID, setFoundPokemonID ] = useState< string | null>(null);
    const [ foundPokeName, setFoundPokeName ] = useState<string>();
    const [ isFoundID, setFoundID ] = useState<boolean>(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log("Updated foundPokemonID:", foundPokemonID);
    }, [foundPokemonID]);

    React.useEffect(()=> {
        if(foundPokemonID)
        {
            //Could be entered inside a different function in order to make the code cleaner.  
            navigate(`/PokeInfo/${foundPokemonID}`, {
                state: {
                    id: Number(foundPokemonID),
                    name: foundPokeName,
                    sprite: spriteDataMap.get(Number(foundPokemonID))?.front_sprite as string,
                    sprite_back: spriteDataMap.get(Number(foundPokemonID))?.back_sprite as string,
                },
            });
        }   
    },[foundPokemonID, foundPokeName, navigate, spriteDataMap])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!apiData) return;
        const searchValue = e.target.value.trim().toLowerCase();
        setSearchQuery(searchValue);
        setFoundID(true)
        if(isNaN(Number(searchValue))){
            const filtered = apiData.results
                .map((pokemon) => {
                const pokeID = parseInt(pokemon.url.split("/")[6], 10);
                const sprite = spriteDataMap.get(pokeID);
                const pokeName = pokemon?.name;
                return { ...pokemon, id: pokeID, sprite, pokeName: pokeName };
            })
            .filter((pokemon) =>
                pokemon.pokeName?.toLowerCase().startsWith(searchValue.trim().toLowerCase())
            );
            console.log("Filtered Pokémon List in SearchBar:", filtered);
            onPokemonData(filtered);
        }
        else {
            onPokemonData([]);
           
        }
        if(searchValue === '')
            setFoundID(false);
       
    }
    
    const handleSearch = () => {
        const searchedItem = searchItem.trim();
        setSearchQuery(searchedItem);
        const foundPokemonByName = apiData?.results.find(
            (pokemon) => pokemon.name.toLowerCase() === searchedItem.toLowerCase()
        );
        if (!isNaN(Number(searchedItem))) {
            const id = Number(searchedItem);
            if ((id >= 1 && id <= 151) || searchItem === apiData?.results.find((pokemon)=> parseInt(pokemon.url.split("/")[6], 10) === id)?.name) { 
                setFoundPokemonID(searchedItem);
                setFoundPokeName(apiData?.results.find((pokemon)=> parseInt(pokemon.url.split("/")[6], 10) === id)?.name);
                setFoundID(true);
            } else {
                toast.error("No such Pokémon exists");
                setFoundPokemonID(null);
            }
        } 
        else if (foundPokemonByName){
            const id = parseInt(foundPokemonByName.url.split("/")[6], 10);
            setFoundPokemonID(String(id)); // Convert ID to string
            setFoundPokeName(foundPokemonByName.name);
            setFoundID(true);
        }
        else {
            toast.error("Enter a valid Pokémon Name");
            setFoundPokemonID(null);
        }        
    }
    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") 
            handleSearch();  
    };
    

    return(
            <>
                <Paper onSubmit={(e)=>e.preventDefault()} 
                    component = "form" sx={{p: '2px 2px', display: 'flex', alignItems: "center", width: 250, height: 28}}>
                    <InputBase sx = {{ml : 1, flex: 1}} placeholder='Give pokémon id or name' inputProps={{'aria-label': 'give pokemon name or id', style: {fontSize: 13}}} value={searchItem} onChange={handleSearchChange} onKeyDown={handleKeyPress}></InputBase>
                    <Divider sx = {{ height : 20, m: 0.5 }} orientation="vertical"/>
                    
                   <Link to = {foundPokemonID ? `/PokeInfo/${foundPokemonID}` : "#"} state = {{id: Number(foundPokemonID), name: foundPokeName, sprite: spriteDataMap.get(Number(foundPokemonID))?.front_sprite as string, sprite_back: spriteDataMap.get(Number(foundPokemonID))?.back_sprite as string}}>
                                        <IconButton type="button" sx = {{p: '8px'}} aria-label="search" onClick={handleSearch} disabled={!isFoundID}>
                                            <SearchIcon/>
                                        </IconButton>
                    </Link>
                            
                </Paper>  
            </>
        )
    }


export default SearchBar;