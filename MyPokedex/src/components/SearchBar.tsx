import React, { useState } from "react";
import { apiProps, Pokemon, spriteProps } from "../api/fetchFromPokeAPI";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputBase, Paper, Divider } from "@mui/material";
import toast from "react-hot-toast";

/* This is the searchBar component, when user searches a pokemon it lead to the pokeinfo page OR filter the pokemon list
   It handles searches based on user input, numeric or string
   Then performs search based on what the user is typing in real time
   If given numeric value or the full pokemon name then it will execute the handlesearch function which needs user to click on search icon to apply the navigation to pokeInfo page
   If given a string then it will filter the pokemon whose names match the typed input 
   If no value is given the search Icon as well as the enter button effects are disabled
**/

// Prop passing and type definition
type SearchBarProps = {
  apiData: apiProps | null;
  spriteDataMap: Map<number, spriteProps>;
  onPokemonData: (
    searchBarData: (Pokemon & { id: number; sprite?: spriteProps })[]
  ) => void;
};

const SearchBar = ({
  apiData,
  spriteDataMap,
  onPokemonData,
}: SearchBarProps) => {
  // React state delcarations

  const [searchItem, setSearchQuery] = useState("");
  const [foundPokemonID, setFoundPokemonID] = useState<string | null>(null);
  const [foundPokeName, setFoundPokeName] = useState<string>();
  const [isFoundID, setFoundID] = useState<boolean>(false);
  const navigate = useNavigate();

  // TO BE DELEETED
  React.useEffect(() => {
    console.log("Updated foundPokemonID:", foundPokemonID);
  }, [foundPokemonID]);

  // On every render () if there is an ID given by the user navigate to the pokeinfo page
  React.useEffect(() => {
    if (foundPokemonID) {
      // Could be entered inside a different function in order to make the code cleaner.
      navigate(`/PokeInfo/${foundPokemonID}`, {
        state: {
          id: Number(foundPokemonID),
          name: foundPokeName,
          sprite: spriteDataMap.get(Number(foundPokemonID))
            ?.front_sprite as string,
          sprite_back: spriteDataMap.get(Number(foundPokemonID))
            ?.back_sprite as string,
        },
      });
    }
  }, [foundPokemonID, foundPokeName, navigate, spriteDataMap]);

  // Live search function which triggers on an input change event and the it creates a new array of filtered pokemon, if the input is not numeric
  // Otherwise it will simply raise an error toast

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!apiData) return;
    const searchValue = e.target.value.trim().toLowerCase();
    setSearchQuery(searchValue);
    setFoundID(true);
    if (isNaN(Number(searchValue))) {
      const filtered = apiData.results
        .map((pokemon) => {
          // The POKEID is at the sixth position of the url string which is spliting, on the / character right before the ID on the url endpoint, the string into 2 and parse it to an integer
          // THIS IS A Pokemon TYPE SEE NOTES ON fetchFromAPIts file notes.
          const pokeID = parseInt(pokemon.url.split("/")[6], 10);
          const sprite = spriteDataMap.get(pokeID);
          const pokeName = pokemon?.name;
          return { ...pokemon, id: pokeID, sprite, pokeName: pokeName };
        }) // Filter the pokemon based on the string given and the all the pokemon names give as well. Then match them from characer to character.
        .filter((pokemon) =>
          pokemon.pokeName
            ?.toLowerCase()
            .startsWith(searchValue.trim().toLowerCase())
        );
      console.log("Filtered Pokémon List in SearchBar:", filtered);
      onPokemonData(filtered);
    } else {
      onPokemonData([]);
    }
    if (searchValue === "") setFoundID(false);
  };

  // Handle search, not in real time but on user enter click and searchIcon click.

  const handleSearch = () => {
    const searchedItem = searchItem.trim();
    setSearchQuery(searchedItem);
    // Define if the pokemon is found by name

    const foundPokemonByName = apiData?.results.find(
      (pokemon) => pokemon.name.toLowerCase() === searchedItem.toLowerCase()
    );
    // If the pokemon is a number then update the state for foundPokemon
    if (!isNaN(Number(searchedItem))) {
      const id = Number(searchedItem);
      if (
        (id >= 1 && id <= 151) ||
        searchItem ===
          apiData?.results.find(
            (pokemon) => parseInt(pokemon.url.split("/")[6], 10) === id
          )?.name
      ) {
        setFoundPokemonID(searchedItem);
        setFoundPokeName(
          apiData?.results.find(
            (pokemon) => parseInt(pokemon.url.split("/")[6], 10) === id
          )?.name
        );
        setFoundID(true);
      } else {
        toast.error("No such Pokémon exists"); // if numeric value is not inside the specified range then raise an error toast
        setFoundPokemonID(null);
      }
    } else if (foundPokemonByName) {
      // If the pokemon is found by name we can access the url end point to retreive the ID. Update the states
      //This is a pokemon type see NOTES on fetchFromAPI.ts file
      //Below we are accessing the url for pokemon type which endpoint ID is what we need to update the states with corect values and avigate to the info page.
      const id = parseInt(foundPokemonByName.url.split("/")[6], 10);
      setFoundPokemonID(String(id)); // Convert ID to string
      setFoundPokeName(foundPokemonByName.name);
      setFoundID(true);
    } else {
      // If a non matching string is entered raise an error toast.
      toast.error("Enter a valid Pokémon Name");
      setFoundPokemonID(null);
    }
  };
  // Handle Enter key press to trigger search execution
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <Paper
        onSubmit={
          (e) =>
            e.preventDefault() /**Prevent page reloading for form resubmition*/
        }
        component="form"
        sx={{
          p: "2px 2px",
          display: "flex",
          alignItems: "center",
          width: 250,
          height: 28,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Give pokémon id or name"
          inputProps={{
            "aria-label": "give pokemon name or id",
            style: { fontSize: 13 },
          }}
          value={searchItem}
          onChange={handleSearchChange}
          onKeyDown={handleKeyPress}
        ></InputBase>
        <Divider sx={{ height: 20, m: 0.5 }} orientation="vertical" />
        {/**Navigate to the poekinfo page in case we click on the search icon and there is a full correct string value or a numeric one inside the specified range*/}
        <Link
          to={foundPokemonID ? `/PokeInfo/${foundPokemonID}` : "#"}
          state={{
            id: Number(foundPokemonID),
            name: foundPokeName,
            sprite: spriteDataMap.get(Number(foundPokemonID))
              ?.front_sprite as string,
            sprite_back: spriteDataMap.get(Number(foundPokemonID))
              ?.back_sprite as string,
          }}
        >
          <IconButton
            type="button"
            sx={{ p: "8px" }}
            aria-label="search"
            onClick={handleSearch}
            disabled={!isFoundID}
          >
            <SearchIcon />
          </IconButton>
        </Link>
      </Paper>
    </>
  );
};

export default SearchBar;
