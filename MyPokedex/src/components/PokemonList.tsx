import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchDataFromApi,
  addToFavourites,
  apiProps,
  spriteProps,
  Pokemon,
} from "../api/fetchFromPokeAPI";
import { askServerForFavePomemon } from "../api/fetchFromAPI";
import SearchBar from "./SearchBar";
import PaginationOutlined from "./PaginationOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Grid from "@mui/material/Grid2";
import {
  Box,
  List,
  ListItem,
  Card,
  Typography,
  CardActionArea,
  CardMedia,
  Button,
  IconButton,
} from "@mui/material";
import "../index.css";

/*-This is the pokemon list component, the main screen of the application.
   Here After fetching the first 151 pokemon of the ,using the pokeAPI, we map the pokemon storing them inside an array in order to hanlde the PAGINATION EFFECT. 
   The users can navigate through the pokemon list, click on a pokemon and navigate to their info page forming the respective endpoint. They can also save a pokemon they like
   by clicking on the heart inside the capokemon cards and check through the heart/favourites link beside the search bar their favourite pokemon, if they have any.
   Latly there is the pokemon search bar which can be used to search a pokemon via name or ID. */

const PokemonList = () => {
  // React state initializations

  const [apiData, setApiData] = React.useState<apiProps | null>(null);
  const [spriteData, setspriteData] = React.useState<spriteProps | null>(null);
  const [counter, setCounter] = React.useState<number>(0);
  const [addedPokemon, setAddedPokemon] = React.useState<number[]>([]);
  const SearchAPIData = apiData || { results: [] };
  const [spriteDataMap, setSpriteDataMap] = React.useState<
    Map<number, spriteProps>
  >(new Map());
  const [filteredPokemon, setFilteredPokemon] = React.useState<Pokemon[]>([]);
  const [filterOffset, setFilterOffset] = React.useState<number>(0); //TO BE CHECKED

  // Fetching the pokemon from the PokeAPI
  // Using the useCallBackFunction in order to cache the response from the api between re-renders
  // !!!Important because we rely on many asynchronus operations to update states and operate on our Data Collections,
  // Which means that every time we perform a state change that might influence he UI, UX and app logic we need to perform changes to state values per render ONLY ONCE
  // Only when the apiData and spriteData change do we execute this, which means only on app entry and on refresh.

  const initializeData = React.useCallback(async () => {
    await fetchDataFromApi(
      0,
      setApiData,
      apiData,
      151,
      setspriteData,
      spriteDataMap,
      setSpriteDataMap
    );
  }, [apiData, spriteDataMap]);

  // On use Effect, on page render trigger the fetch, only on app entry and on refresh.

  React.useEffect(() => {
    if (!apiData) initializeData();
  }, [apiData, initializeData, spriteDataMap]);

  // On every app entry and refresh we should also maintain the state for favourite addition for consistency inside the UI.

  const fetchFavorites = async () => {
    try {
      await askServerForFavePomemon(setAddedPokemon);
    } catch (error) {
      toast.error(error + " Failed to fetch favorites");
    }
  };
  // On each render (only once)
  React.useEffect(() => {
    if (apiData) fetchFavorites();
  }, [apiData]);

  // Absorbing the filtered pokemon list from the search bar component and every time we perform a search the pokemonData change, the searchBar component executes this function setting the filtered
  // pokemon array accordigly and set offsets which define the pagination effect (for all and filtered pokemon lists respectively in order to render the results as needed)
  // The searchBar will receive data but can perform both live search with filtering and sequential search based on search icon click
  const handleDataFromSearchBar = (
    searchBarData: (Pokemon & {
      id: number;
      name?: string;
      sprite?: spriteProps;
    })[]
  ) => {
    setFilteredPokemon(searchBarData);
    setFilterOffset(0);
    setCounter(0);
  };

  // Add to favourite functionlity hanlder Also check if the pokemon included already exists.
  const handleAddToFavourites = (
    pokemonId: number,
    name: string,
    sprite: string
  ) => {
    addToFavourites(pokemonId, name, sprite, setAddedPokemon);

    // Update the state for pokemon addition
    setAddedPokemon((prev) => {
      // Check if Pokémon is already in the favorites
      if (prev.includes(pokemonId)) {
        // Remove it if it exists
        return prev.filter((id) => id !== pokemonId);
      } else {
        // Add it if it doesn't exist
        return [...prev, pokemonId];
      }
    });
  };

  return (
    <>
      {/** The UI, is writen using materialUI, a grid of three rows on large displays, 2 columns on medium and 1 on small display, */}
      <Box sx={{ width: "100%", maxWidth: 650 }}>
        <nav aria-label="main mailbox folders"></nav>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1} sx={{ m: 1.5, justifyContent: "center" }}>
            <SearchBar
              apiData={SearchAPIData}
              spriteDataMap={spriteDataMap}
              onPokemonData={handleDataFromSearchBar}
            />
            {/**If the serverisnnot available hen deny the navigation to the favourites page */}
            {addedPokemon.length !== 0 ? (
              <IconButton
                className="no-hover"
                sx={{ borderRadius: "5px", backgroundColor: "black", p: "5px" }}
              >
                <Link to={"/Favourites"} style={{ height: 24 }}>
                  <FavoriteIcon style={{ color: "red" }} />
                </Link>
              </IconButton>
            ) : (
              <IconButton
                className="no-hover"
                sx={{ borderRadius: "5px", p: "5px", backgroundColor: "black" }}
              >
                <FavoriteIcon style={{ color: "white" }} />
              </IconButton>
            )}
          </Grid>
        </Box>

        <List sx={{ flexGrow: 1, flexWrap: "wrap" }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
            size={{ xs: 5 }}
          >
            {/** If poke data are fetched check, as well as, assign the filtered poekmon array to the FILTERED VALUES IF SEARCH OCCURS otherwise to all of the pokemon fetched, then slice them based on the disaply offest for pagination and map the results  */}
            {(apiData?.results && filteredPokemon.length > 0
              ? filteredPokemon
              : apiData?.results || []
            )
              .slice(counter, counter + 12)
              .map((info, index) => {
                const pokemonId =
                  filteredPokemon.length > 0
                    ? parseInt(
                        filteredPokemon[counter + index].url.split("/")[6],
                        10
                      )
                    : parseInt(info.url.split("/")[6], 10);
                {
                  /** Mapping using the ID from the url of the filtered pokemon (poekmon type (see NOTES on fetchFromAPI.ts file) or from the full array of pokemon */
                }
                const sprite = spriteDataMap.get(pokemonId);
                const pokeName = info.name;

                return (
                  <Grid key={pokemonId} size={{ xs: 6, sm: 4, md: 4 }}>
                    <ListItem sx={{ width: "100%" }}>
                      {spriteData && (
                        <Card
                          className="card"
                          sx={{
                            alignItems: "center",
                            borderRadius: "8%",
                            width: "100%",
                          }}
                        >
                          {/**If the state for favorite pokemon has updated update the UI, define if the button is clickable on server availability or not also*/}
                          {addedPokemon.includes(pokemonId) ? (
                            <Box textAlign="right">
                              <Button variant="text">
                                <FavoriteIcon style={{ color: "red" }} />
                              </Button>
                            </Box>
                          ) : (
                            <Box textAlign="right">
                              <Button
                                sx={{ textAlign: "right" }}
                                variant="text"
                                onClick={() =>
                                  handleAddToFavourites(
                                    pokemonId,
                                    pokeName || "",
                                    sprite?.front_sprite || ""
                                  )
                                }
                              >
                                <FavoriteBorderIcon
                                  sx={{
                                    "@media (max-width:400px)": {
                                      fontSize: "130%",
                                    },
                                  }}
                                  style={{ color: "black" }}
                                />
                              </Button>
                            </Box>
                          )}
                          <Link
                            className="no-hover"
                            to={`/PokeInfo/${pokemonId}`}
                            state={{
                              id: pokemonId,
                              name: pokeName || "",
                              sprite: sprite?.front_sprite || "",
                              sprite_back: sprite?.back_sprite || "",
                            }}
                          >
                            <CardActionArea
                              sx={{ textAlign: "center", width: "100%" }}
                            >
                              <CardMedia
                                component="img"
                                image={sprite?.front_sprite}
                                alt={info.name}
                                style={{ width: "70%", margin: "auto" }}
                              />
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  sx={{
                                    "@media (max-width:400px)": {
                                      fontSize: "0.75rem",
                                    },
                                  }}
                                  variant="body1"
                                  component="div"
                                  className="card-text"
                                >
                                  PokéID: {pokemonId}
                                </Typography>
                                <Typography
                                  sx={{
                                    "@media (max-width:400px)": {
                                      fontSize: "0.80rem",
                                    },
                                  }}
                                  variant="body1"
                                  component="div"
                                  className="card-text"
                                >
                                  {pokeName?.toUpperCase()}
                                </Typography>
                              </Box>
                            </CardActionArea>
                          </Link>
                        </Card>
                      )}
                    </ListItem>
                  </Grid>
                );
              })}
          </Grid>
        </List>
      </Box>
      <Box
        sx={{
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <PaginationOutlined
          maxValue={apiData?.results.length}
          setCounter={setCounter}
          FilteredPokemonArraymaxLength={filteredPokemon.length}
        />
      </Box>
    </>
  );
};

export default PokemonList;
