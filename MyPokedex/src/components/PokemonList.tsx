import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchDataFromApi,
  addToFavourites,
  Pokemon,
  PokemonsData,
  getPokemonSprite,
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
  Skeleton,
} from "@mui/material";
import "../index.css";

/* This is the pokemon list component, the main screen of the application.
   Here After fetching the first 151 pokemon of the ,using the pokeAPI, we map the pokemon storing them inside an array in order to hanlde the PAGINATION EFFECT. 
   The users can navigate through the pokemon list, click on a pokemon and navigate to their info page forming the respective endpoint. They can also save a pokemon they like
   by clicking on the heart inside the capokemon cards and check through the heart/favourites link beside the search bar their favourite pokemon, if they have any.
   Lastly there is the pokemon search bar which can be used to search a pokemon via name or ID. */

const PokemonList = () => {
  // React state initializations

  // EVERYTHING NECCESARY IS HERE!!!
  const [pokemonData, setPokemonData] = React.useState<{
    dictionary: PokemonsData;
    orderList: number[];
  } | null>(null);
  const [searchValue, setSearchValue] = React.useState("");

  const [filteredPokemon, setFilteredPokemon] = React.useState<Pokemon[]>([]);
  // TODO: What is the counter?
  const [counter, setCounter] = React.useState<number>(0);
  // TODO: Give this a more descriptive name
  const [addedPokemon, setAddedPokemon] = React.useState<number[]>([]);

  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

  const [screenSize, setScreenSize] = React.useState({
    columns: 3,
    cardWidth: 300,
    cardHeight: 100,
  });

  const { columns, cardWidth, cardHeight } = screenSize;
  const skeletonCount = columns * 4;

  const navigate = useNavigate();
  const location = useLocation();

  const preloadImage = (url: string) => {
    const img = new Image();
    img.src = url;
  };

  // Set the respective values for the values in order to determine per screen resolution, the grid and the sizes of the skeleton list cards.
  const updateScreenSize = () => {
    if (window.innerWidth >= 1100) {
      setScreenSize({ columns: 3, cardWidth: 173.78, cardHeight: 199.61 });
    } else if (window.innerWidth <= 1100 && window.innerWidth >= 900) {
      setScreenSize({ columns: 3, cardWidth: 173.98, cardHeight: 199.61 });
    } else if (window.innerWidth <= 768 && window.innerWidth >= 598) {
      setScreenSize({ columns: 2, cardWidth: 253, cardHeight: 247.02 });
    } else if (window.innerWidth <= 598 && window.innerWidth >= 420) {
      setScreenSize({ columns: 1, cardWidth: 320, cardHeight: 300 });
    } else {
      setScreenSize({ columns: 1, cardWidth: 223.19, cardHeight: 238.69 });
    }
  };

  // Fetching the pokemon from the PokeAPI
  // Using the useCallBackFunction in order to cache the response from the api between re-renders
  // !!!Important because we rely on many asynchronus operations to update states and operate on our Data Collections,
  // Which means that every time we perform a state change that might influence he UI, UX and app logic we need to perform changes to state values per render ONLY ONCE
  // Only when the apiData and spriteData change do we execute this, which means only on app entry and on refresh.

  const initializeData = React.useCallback(async () => {
    const data = await fetchDataFromApi(0, 151);
    console.log(data);
    const pokemonData = data.reduce(
      (
        accumulator: {
          dictionary: {
            id: number;
            sprites: { front: string; back: string };
            name: string;
            url: string;
          }[];
          orderList: number[];
        },
        pokemon: {
          url: string;
          id: number;
          name: string;
          sprites: {
            front: string;
            back: string;
          };
        }
      ) => {
        const urlParts = pokemon.url.split("/");
        // The ID is always at index 6
        const pokemonId = parseInt(urlParts[6]);
        accumulator.dictionary[pokemonId] = {
          ...pokemon,
          id: pokemonId,
          name: pokemon.name,
          url: pokemon.url,
          sprites: { front: "", back: "" },
        };
        accumulator.orderList.push(pokemonId);

        return accumulator;
      },
      { dictionary: {}, orderList: [] }
    );
    console.log(pokemonData);
    const spritePromises = pokemonData.orderList.map(async (id: number) => {
      // Call getPokemonSprites to fetch the sprite data for this Pokémon
      return getPokemonSprite(id);
    });
    const spritesList = await Promise.all(spritePromises);
    // Save the pokemon sprites data
    spritesList.forEach((spriteData) => {
      pokemonData.dictionary[spriteData.id].sprites.front = spriteData?.front;
      pokemonData.dictionary[spriteData.id].sprites.back = spriteData?.back;
    });
    setPokemonData(pokemonData);
    setFilteredPokemon(
      pokemonData.orderList.map((id: number) => pokemonData.dictionary[id])
    );
    pokemonData.orderList.map((id: number) => {
      preloadImage(pokemonData.dictionary[id].sprites.front);
      preloadImage(pokemonData.dictionary[id].sprites.back);
    });

    // Pagified list of pokemon persistance after navigating back to the pokemon list.
    // This is done using the counter state value, which determines the pagination list to be displayed.
    if (location?.state?.counter !== undefined) {
      setCounter(location.state.counter);
    } else {
      setCounter(0);
    }
    // Using the local storage o save it at every refresh.
    const savedCounter = localStorage.getItem("pokemonCounter");
    if (savedCounter !== null) {
      setCounter(Number(savedCounter));
    } else if (location?.state?.counter !== undefined) {
      setCounter(location.state.counter);
    } else {
      setCounter(0);
    }
    console.log(counter);
    if (data) return data;
  }, [location?.state?.counter, counter]);

  // Execute the update function on every render.
  React.useEffect(() => {
    if (isLoaded) {
      updateScreenSize();
      window.addEventListener("resize", updateScreenSize);
      return () => window.removeEventListener("resize", updateScreenSize);
    }
  }, [isLoaded]);

  // On use Effect, on page render trigger the fetch, only on app entry and on refresh.

  React.useEffect(() => {
    if (!pokemonData && !isLoaded) {
      setIsLoaded(true);
      initializeData().then((response) => {
        if (response) {
          setIsLoaded(false);
        }
      });
      console.log(pokemonData);
    }
  }, [pokemonData, initializeData, filteredPokemon, isLoaded]);

  // On every app entry and refresh we should also maintain the state for favourite addition for consistency inside the UI.

  const fetchFavorites = async () => {
    try {
      const favorites = await askServerForFavePomemon();
      if (Array.isArray(favorites)) {
        // Extract the `id` field from each object in the response
        setAddedPokemon(favorites.map((item: { id: number }) => item.id));
      } else {
        console.error("Unexpected response format from the server");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to fetch favourites");
      setAddedPokemon([]);
    }
  };
  // On each render (only once)
  React.useEffect(() => {
    if (pokemonData) fetchFavorites();
  }, [pokemonData]);

  // Add to favourite functionlity hanlder Also check if the pokemon included already exists.
  const handleAddToFavourites = (
    pokemonId: number,
    name: string,
    sprite: string
  ) => {
    addToFavourites(pokemonId, name, sprite)
      .then((res) => {
        if (res?.ok) {
          toast.success(res.status + " Pokemon Added");
        } else {
          toast.error(res?.status + " Pokemon not added");
          setAddedPokemon((prev) => prev.filter((id) => id !== pokemonId));
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((error) => {
        toast.error("503 Server is down");
        setAddedPokemon((prev) => prev.filter((id) => id !== pokemonId));
        console.log(error)
      });

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

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    if (!pokemonData) return;
    const searchValue = value.trim().toLowerCase();
    setCounter(0); // Reset pagination whenever a search is performed
    // If search value is a number, filter by IDi
    if (!isNaN(Number(searchValue)) && searchValue !== "") {
      const filteredById = pokemonData.orderList
        .filter((id) => id === Number(searchValue)) // Check if the ID matches
        .map((id) => pokemonData.dictionary[id]); // Map to Pokémon data

      setFilteredPokemon(filteredById);
      return;
    }

    // If search value is a string, filter by name
    if (searchValue !== "") {
      const filteredByName = pokemonData.orderList
        .filter((id) =>
          pokemonData.dictionary[id].name.toLowerCase().startsWith(searchValue)
        ) // Check if the name includes the search string
        .map((id) => pokemonData.dictionary[id]); // Map to Pokémon data

      setFilteredPokemon(filteredByName);
      return;
    }

    // If the input is empty, reset to the full list
    setFilteredPokemon(
      pokemonData.orderList.map((id) => pokemonData.dictionary[id])
    );
    if (searchValue === "") {
      setFilteredPokemon(
        pokemonData.orderList.map((id) => pokemonData.dictionary[id])
      );
      return;
    }
  };
  // Handle the input on click of the search button or by clicking keyboard key
  // This function executtes based on the input given numeric or string inside the search bar
  const handleInputClick = () => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue || trimmedValue === "") {
      toast.error("No value entered");
      return;
    }
    const ID = parseInt(trimmedValue, 10);
    const isNumeric = !isNaN(Number(trimmedValue));
    const id = isNumeric ? parseInt(trimmedValue, 10) : null;

    if (isNumeric && ID && pokemonData?.dictionary[ID]) {
      const pokemon = pokemonData?.dictionary[ID];
      navigate(`/PokeInfo/${id}`, {
        state: { id, name: pokemon.name, sprite: pokemon.sprites.front },
      });
    } else {
      const matchingPokemon = Object.values(pokemonData?.dictionary || {}).find(
        (pokemon) => pokemon.name.toLowerCase() === trimmedValue.toLowerCase()
      );
      // If there is a match navigate to the respective pokemon page.
      if (matchingPokemon) {
        navigate(`/PokeInfo/${matchingPokemon.id}`, {
          state: {
            id: matchingPokemon.id,
            name: matchingPokemon.name,
            sprite: matchingPokemon.sprites.front,
          },
        });
      } else {
        // otherwise raise a toast
        toast.error("No Pokémon found!");
      }
    }
  };

  // Function to sync the changes between the
  const handlePageChange = (page: number) => {
    setCounter(page);
  };

  React.useEffect(() => {
    const savedCounter = localStorage.getItem("pokemonCounter");
    if (savedCounter !== null) {
      setCounter(Number(savedCounter));
    }
  }, []);
  return (
    <>
      {/** The UI, is writen using materialUI, a grid of three rows on large displays, 2 columns on medium and 1 on small display, */}

      {!isLoaded ? (
        <>
          <Box sx={{ width: "100%", maxWidth: 650 }}>
            <nav aria-label="main mailbox folders"></nav>
            <Box sx={{ flexGrow: 1 }}>
              <Grid
                container
                spacing={1}
                sx={{ m: 1.5, justifyContent: "center" }}
              >
                <SearchBar
                  onInputChange={handleInputChange}
                  onSearchClick={handleInputClick}
                  searchValue={searchValue}
                />
                {/**If the server is not available then deny the navigation to the favourites page */}
                {addedPokemon.length !== 0 ? (
                  <IconButton
                    className="no-hover"
                    sx={{
                      borderRadius: "5px",
                      backgroundColor: "black",
                      p: "5px",
                    }}
                  >
                    <Link to={"/Favourites"} style={{ height: 24 }}>
                      <FavoriteIcon style={{ color: "red" }} />
                    </Link>
                  </IconButton>
                ) : (
                  <IconButton
                    className="no-hover"
                    sx={{
                      borderRadius: "5px",
                      p: "5px",
                      backgroundColor: "black",
                    }}
                  >
                    <FavoriteIcon style={{ color: "white" }} />
                  </IconButton>
                )}
              </Grid>
            </Box>
            {filteredPokemon.length > 0 ? (
              <List sx={{ flexGrow: 1, flexWrap: "wrap" }}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                  size={{ xs: 5 }}
                >
                  {/** If poke data are fetched check, as well as, assign the filtered poekmon array to the FILTERED VALUES IF SEARCH OCCURS otherwise to all of the pokemon fetched, then slice them based on the disaply offest for pagination and map the results  */}
                  {filteredPokemon
                    .slice(counter, counter + 12)
                    .map((pokemon) => {
                      const pokemonId = pokemon?.id;

                      {
                        /** Mapping using the ID from the url of the filtered pokemon (poekmon type (see NOTES on fetchFromAPI.ts file) or from the full array of pokemon */
                      }
                      const sprite_front =
                        pokemonData?.dictionary[pokemonId].sprites.front;
                      const pokeName = pokemonData?.dictionary[pokemonId].name;
                      const sprite_back =
                        pokemonData?.dictionary[pokemonId].sprites.back;
                      console.log(
                        filteredPokemon[pokemonId]?.id + " " + pokemonId
                      );
                      return (
                        <Grid
                          key={Number(pokemonId)}
                          size={{ xs: 8, sm: 6, md: 4, lg: 4 }}
                          width="100%"
                        >
                          <ListItem
                            sx={{ width: "100%", p: 2, alignItems: "center" }}
                          >
                            {sprite_front && (
                              <Card
                                className="card"
                                sx={{
                                  alignItems: "center",
                                  borderRadius: "8%",
                                  "@media (max-width:400px)": {
                                    width: "80%",
                                    ml: 3,
                                  },
                                  "@media ((min-width: 600px) and (max-width: 800px))":
                                    {
                                      width:
                                        filteredPokemon.length > 3
                                          ? "100%"
                                          : filteredPokemon.length === 1
                                          ? 600
                                          : 500,
                                      mr: 4,
                                    },
                                  "@media (min-width: 800px)": {
                                    width:
                                      filteredPokemon.length > 3
                                        ? "100%"
                                        : filteredPokemon.length === 1
                                        ? 600
                                        : 500,
                                  },
                                  "@media (max-width: 600px) and (min-width: 400px)":
                                    {
                                      width: "80%",
                                      ml: 5,
                                      mr: 5,
                                    },
                                }}
                              >
                                {/**If the state for favorite pokemon has updated update the UI, define if the button is clickable on server availability or not also*/}
                                {addedPokemon.includes(Number(pokemonId)) ? (
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
                                          Number(pokemonId),
                                          pokeName || "",
                                          pokemonData?.dictionary[
                                            Number(pokemonId)
                                          ].sprites.front || ""
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
                                  to={`/PokeInfo/${Number(pokemonId)}`}
                                  state={{
                                    id: pokemonId,
                                    name: pokeName || "",
                                    sprite: sprite_front || "",
                                    sprite_back: sprite_back || "",
                                    counter: counter,
                                  }}
                                >
                                  <CardActionArea
                                    sx={{ textAlign: "center", width: "100%" }}
                                  >
                                    <CardMedia
                                      component="img"
                                      image={sprite_front}
                                      alt={pokeName}
                                      style={{ width: "60%", margin: "auto" }}
                                    />
                                    <Box sx={{ mb: 2 }}>
                                      <Typography
                                        sx={{
                                          "@media (max-width:500px)": {
                                            fontSize: "0.80rem",
                                          },
                                          "@media (max-width:600px)": {
                                            fontSize: "1.10rem",
                                          },

                                          "@media (min-width: 600px)": {
                                            fontSize: "0.90rem",
                                          },
                                          "@media (max-width: 330px)": {
                                            fontSize: "0.90rem",
                                          },
                                        }}
                                        variant="body1"
                                        component="div"
                                        className="card-text"
                                      >
                                        #{Number(pokemonId)}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          "@media (max-width:500px)": {
                                            fontSize: "0.90rem",
                                          },

                                          "@media (max-width:600px)": {
                                            fontSize: "1.10rem",
                                          },

                                          "@media (min-width: 600px)": {
                                            fontSize: "0.90rem",
                                          },
                                          "@media (max-width: 330px)": {
                                            fontSize: "0.90rem",
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
            ) : (
              <>
                <ListItem sx={{ justifyContent: "center" }}>
                  <Box
                    textAlign="left"
                    sx={{
                      backgroundColor: "white",
                      borderStyle: "solid",
                      borderColor: "black",
                      p: 2,
                      borderRadius: 10,
                    }}
                  >
                    <Box sx={{ height: "50%", backgroundColor: "red" }}></Box>
                    <Typography p={{ pr: 1 }} style={{ color: "black" }}>
                      No Pokémon Found
                    </Typography>
                  </Box>
                </ListItem>
              </>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              overflow: "hidden",
              padding: filteredPokemon.length > 0 ? -0.5 : "auto",
              "@media (max-width: 360px)": {},
            }}
          >
            <PaginationOutlined
              maxValue={pokemonData?.orderList.length}
              counter={counter}
              FilteredPokemonArraymaxLength={filteredPokemon.length}
              onPageChange={handlePageChange}
            />
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ width: "100%", maxWidth: 650 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid
                container
                spacing={1}
                sx={{ m: 1.5, justifyContent: "center" }}
              >
                <Skeleton
                  variant="rectangular"
                  width={254}
                  height={32}
                  animation="pulse"
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton
                  variant="rounded"
                  width={34}
                  height={34}
                  sx={{ borderRadius: 2 }}
                  animation="pulse"
                />
              </Grid>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignItems: "center",
                maxWidth: 650,
                flexGrow: 2,
              }}
            >
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
              >
                {/** <Skeleton variant="rectangular" /> */}
                {Array.from({ length: skeletonCount }).map((_, index) => (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
                    key={index}
                    width="100%"
                  >
                    <Skeleton
                      variant="rectangular"
                      animation="pulse"
                      sx={{
                        width: cardWidth,
                        height: cardHeight,
                        borderRadius: "8%",
                        margin: "auto",
                        mt: 5,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default PokemonList;
