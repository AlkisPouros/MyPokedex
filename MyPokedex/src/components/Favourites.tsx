import React from "react";
import { Link, useLocation } from "react-router-dom";
import { askServerForFavePomemon } from "../api/fetchFavouritesFromServer";
import { removeFromFavourites } from "../api/removeFromFavourites";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  CardActionArea,
  CardMedia,
  Button,
  Box,
  Card,
  Typography,
  List,
  ListItem,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Pokemon, PokemonsData } from "../api/fetchFromPokeAPI";
import { useQuery, useQueryClient } from "react-query";

/**
 * This is the Favourites component
 * This page's data is served by using our node server for everything from addition, dispalying info, to removal of the pokemon.
 * Like mentioned inside the pokemonList component, if the server is not available then the component cannot be accessed and a message will be shown on the main list.
 */

const Favourites = () => {
  const location = useLocation();
  const { FavPokeArrayLength, sessionId, pokemonData } = location.state || {};
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const queryClient = useQueryClient(); 
  
  const { data: favourites } = useQuery({
    queryKey: ["favourites"],
    queryFn: async () => await askServerForFavePomemon(sessionId as string, pokemonData as {
        dictionary: PokemonsData;
        orderList: number[];
      } | null ),
    onSuccess: () => {
      setIsLoading(false);
    }
  })


  const RemoveFromFavouritePokeList = async (sessionId: string, id: number) => {
    await removeFromFavourites(sessionId, id);
    queryClient.invalidateQueries(["favourites"]);
  };

  const [screenSize, setScreenSize] = React.useState({
    columns: 1,
    cardWidth: 300,
    cardHeight: 100,
  });

  const { columns, cardWidth, cardHeight } = screenSize;
  const skeletonCount = columns * FavPokeArrayLength;

  const updateScreenSize = () => {
    setScreenSize({ columns: 1, cardWidth: 225, cardHeight: 207 });
  };
  
  // Execute the update function on every render.
  React.useEffect(() => {
    if (isLoading) {
      updateScreenSize();
      window.addEventListener("resize", updateScreenSize);
      return () => window.removeEventListener("resize", updateScreenSize);
    }
  }, [isLoading]);

  return (
    <>
      {/** If the favourite pokemon list is still loading render the skeleton */}

      {!isLoading ? (
        <>
          <List>
            {/** If there are no favorite pokemon display the below message */}
            {favourites?.FavouritePokemon && (favourites?.FavouritePokemon as Pokemon[]).length === 0 && (
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
                    No Pokémon Added
                  </Typography>
                </Box>
              </ListItem>
            )}
            {/** From the favorite pokemon list render the pokemon fetched from the server*/}
            {favourites?.FavouritePokemon &&
              (favourites?.FavouritePokemon as Pokemon[]).map((info) => (
                <ListItem>
                  <Card
                    className="card"
                    sx={{ m: "auto", borderRadius: "8%", minWidth: 230 }}
                  >
                    <CardActionArea
                      sx={{ flexgrow: 1, justifyContent: "center" }}
                    >
                      <Grid container spacing={2}>
                        <CardMedia
                          component="img"
                          sx={{ width: "50%", m: "auto" }}
                          image={Object.values(info)[3].front as string}
                          alt={Object.values(info)[0] as string}
                          loading="lazy"
                        />
                        <Box textAlign="center" sx={{ mt: 1, width: "100%" }}>
                          <Typography
                            className="card-text"
                            variant="body1"
                            component="div"
                          >
                            #{Object.values(info)[2]}
                          </Typography>
                          <Typography
                            className="card-text"
                            variant="body1"
                            component="div"
                          >
                            {(Object.values(info)[0] as string).toUpperCase()}
                          </Typography>

                          <Button
                            sx={{ backgroundColor: "transparent", m : 1 }}
                            onClick={() =>
                              RemoveFromFavouritePokeList(
                                sessionId as string,
                                Object.values(info)[2] as number
                              )
                            }
                          >
                            <DeleteIcon style={{color: "black"}} />
                          </Button>
                        </Box>
                      </Grid>
                    </CardActionArea>
                  </Card>
                </ListItem>
              ))}
          </List>

          <Button
            className="Routing-button"
            type="button"
            sx={{ backgroundColor: "black" }}
          >
            <Link style={{ height: 24 }} to="/">
              <KeyboardBackspaceIcon style={{ color: "white" }} />
            </Link>
          </Button>
        </>
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              maxWidth: 650,
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <Grid key={index} width="100%">
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
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default Favourites;
