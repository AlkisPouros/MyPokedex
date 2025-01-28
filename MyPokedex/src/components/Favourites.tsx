import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFromAPI, FavouritePokemon } from "../api/fetchFromAPI";
import { removeFromFavourites } from "../api/removeFromFavourites";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
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

/**
 * This is the Favourites component
 * This page's data is served by using our node server for everything from addition, dispalying info, to removal of the pokemon.
 * Like mentioned inside the pokemonList component, if the server is not available then the component cannot be accessed and a message will be shown on the main list.
 */


const preloadImage = (url: string) => {
  const img = new Image();
  img.src = url;
};

const Favourites = () => {
  const [FavPokemon, setFavePokemon] = React.useState<
    FavouritePokemon[] | null
  >(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const FetchFavourites = React.useCallback(async () => {
    try {
      const data = (await fetchFromAPI()) as unknown as
        | FavouritePokemon[]
        | null;
      return data;
    } catch (error) {
      console.error(error);
      return;
    }
  }, []);

  // On each render of this component fetch the data from the server
  useEffect(() => {
    if (!FavPokemon && !isLoading) {
      setIsLoading(true);
      FetchFavourites().then((response) => {
        if (response) {
          setIsLoading(false);
          setFavePokemon(response);
          response?.forEach((FavePokemon: FavouritePokemon) => { preloadImage(FavePokemon.sprite); })
        }
      });
      
    }
  }, [FavPokemon, isLoading, FetchFavourites]);

  return (
    <>
      {/** If the favorite pokemon list is still loading render the skeleton */}
      
      {!isLoading ? (
        <>
          <List>
            {/** If theere no favorite pokemon display the below message */}
            {FavPokemon && FavPokemon.length === 0 && (
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
            {FavPokemon &&
              FavPokemon.map((info) => (
                <ListItem>
                  <Card
                    className="card"
                    sx={{ width: "50", m: "auto", borderRadius: "8%" }}
                  >
                    <CardActionArea
                      sx={{ flexgrow: 1, justifyContent: "center" }}
                    >
                      <Grid container spacing={2}>
                        <CardMedia
                          component="img"
                          sx={{ width: "50%", m: "auto" }}
                          image={Object.values(info)[2] as string}
                          alt={Object.values(info)[1] as string}
                          loading="lazy"
                        />
                        <Box textAlign="center" sx={{ mt: 1, width: "100%" }}>
                          <Typography
                            className="card-text"
                            variant="body1"
                            component="div"
                          >
                            #{Object.values(info)[0]}
                          </Typography>
                          <Typography
                            className="card-text"
                            variant="body1"
                            component="div"
                          >
                            {(Object.values(info)[1] as string).toUpperCase()}
                          </Typography>

                          <Button
                            variant="text"
                            onClick={() =>
                              removeFromFavourites(
                                Object.values(info)[0] as number,
                                setFavePokemon
                              )
                            }
                          >
                            Remove
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
          <Box>
            <Skeleton
              sx={{ mb: 2 }}
              variant="rectangular"
              width={277.03}
              height={236.04}
              animation="pulse"
            />
            <Skeleton
              variant="rectangular"
              animation="pulse"
              width={277.03}
              height={236.04}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default Favourites;
