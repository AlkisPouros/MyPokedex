import {
  Box,
  Button,
  IconButton,
  ListItem,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import SearchBar from "./SearchBar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Pokemon, PokemonsData } from "../api/fetchFromPokeAPI";
import AuthModals from "./AuthModals";
import PokeCard from "./PokeCard";
import { useAuth } from "../AuthProvider";

type MainPokemonListAreaProps = {
  isUserSignedIn: boolean;
  addedPokemon: number[];
  sessionId: string;
  counter: number;
  searchValue: string;
  filteredPokemon: Pokemon[];
  pokemonData: {
    dictionary: PokemonsData;
    orderList: number[];
  } | null;
  handleAddToFavourites: (id: number) => void;
  handleInputChange: (input: string) => void;
  handleInputClick: () => void;
};

export default function MainPokemonListArea({
  isUserSignedIn,
  addedPokemon,
  counter,
  searchValue,
  filteredPokemon,
  sessionId,
  pokemonData,
  handleAddToFavourites,
  handleInputChange,
  handleInputClick,
}: MainPokemonListAreaProps) {
  const { username, signup, login, logout } = useAuth();
  
  
  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  return (

    <>
          <Box sx={{ width: "100%", maxWidth: 650 }}>
            <nav aria-label="main mailbox folders"></nav>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1} sx={{ m: 1.5, justifyContent: "center" }}>
                <SearchBar
                  onInputChange={handleInputChange}
                  onSearchClick={handleInputClick}
                  searchValue={searchValue}
                />
                {addedPokemon && addedPokemon?.length !== 0 && isUserSignedIn ? (
                  <IconButton
                    className="no-hover"
                    sx={{ borderRadius: "5px", backgroundColor: "black", p: "5px" }}
                  >
                    <Link
                      to={"/Favourites"}
                      style={{ height: 24 }}
                      state={{
                        FavPokeArrayLength: addedPokemon?.length,
                        sessionId: sessionId as string,
                        pokemonData: pokemonData,
                      }}
                    >
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
                <Box
                  sx={{
                    width: "100%",
                    height: "50%",
                    maxWidth: 650,
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      flexGrow: 1,
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {isUserSignedIn ? (
                      <>
                        <Box
                          sx={{
                            backgroundColor: "white",
                            borderStyle: "solid",
                            borderColor: "black",
                            p: 2,
                            borderRadius: 2,
                            width: "50%",
                          }}
                        >
                          <Typography
                            p={{ pr: 1 }}
                            sx={{ textAlign: "center", wordBreak: "break-word" }}
                            style={{ color: "black" }}
                          >
                            Welcome {username}
                          </Typography>
                        </Box>
                        <BootstrapTooltip
                          disableInteractive
                          enterDelay={300}
                          leaveDelay={200}
                          title={<Typography color="inherit">Log out</Typography>}
                        >
                          <Button
                            sx={{
                              backgroundColor: "black",
                              borderRadius: 2,
                              flexGrow: 0.1,
                              m: 1,
                            }}
                            onClick={() => logout()}
                          >
                            <KeyboardBackspaceIcon style={{ color: "white" }} />
                          </Button>
                        </BootstrapTooltip>
                      </>
                    ) : (
                      <>
                        <AuthModals login={login} signup={signup} />
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Box>
           {filteredPokemon.length > 0 ? (
              <Grid
                container
                spacing={filteredPokemon.length === 2 ? 0 : 2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  p: 2,
                  gap: filteredPokemon.length === 2 ? "70px" : "14px", 
                }}
                size={{ xs: 5 }}
              >
                {filteredPokemon.slice(counter, counter + 12).map((pokemon) => {
                  const pokemonId = pokemon?.id;
                  const sprite_front =
                    pokemonData?.dictionary[pokemonId]?.sprites.front;
                  const pokeName = pokemonData?.dictionary[pokemonId]?.name;
                  const sprite_back =
                    pokemonData?.dictionary[pokemonId]?.sprites.back;

                  return (
                    
                      <Grid
                        key={Number(pokemonId)}
                        size={{ xs: 8, sm: 6, md: 4, lg: 4 }}                      
                      >
                        {sprite_front && (
                          <PokeCard
                            pokemonId={pokemonId}
                            pokeName={pokeName}
                            counter={counter}
                            sprite_front={sprite_front}
                            filteredPokemon={filteredPokemon}
                            sprite_back={sprite_back}
                            addedPokemon={addedPokemon}
                            isUserSignedIn={isUserSignedIn}
                            handleAddToFavourites={handleAddToFavourites}
                          />
                        )}
                      </Grid>
                  );
                })}
            </Grid>
            ) : (
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
            )}
          </Box>
          
    </>
  );
}
