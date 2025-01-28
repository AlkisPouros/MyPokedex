import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputBase, Paper, Divider } from "@mui/material";

/* This is the searchBar component, when user searches a pokemon it lead to the pokeinfo page OR filter the pokemon list
   It handles searches based on user input, numeric or string
   Then performs search based on what the user is typing in real time
   If given numeric value or the full pokemon name then it will execute the handlesearch function which needs user to click on search icon to apply the navigation to pokeInfo page
   If given a string then it will filter the pokemon whose names match the typed input 
   If no value is given the search Icon as well as the enter button effects are disabled
**/

// Prop passing and type definition
type SearchBarProps = {
  searchValue: string;
  onInputChange: (value: string) => void;
  onSearchClick: () => void;
};

const SearchBar = ({
  searchValue,
  onInputChange,
  onSearchClick,
}: SearchBarProps) => {
  // Upon clicking enter, perform search of the value entered
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearchClick();
  };

  return (
    <>
      <Paper
        onSubmit={
          (e) =>
          /**Prevent page reloading for form resubmition*/
            e.preventDefault() 
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
          value={searchValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyPress}
        ></InputBase>
        <Divider sx={{ height: 20, m: 0.5 }} orientation="vertical" />
        {/**Navigate to the poke info page in case we click on the search icon and there is a full correct string value or a numeric one inside the specified range*/}

        <IconButton
          type="button"
          sx={{ p: "8px" }}
          aria-label="search"
          onClick={onSearchClick}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  );
};

export default SearchBar;
