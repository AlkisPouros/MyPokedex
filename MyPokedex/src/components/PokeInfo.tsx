import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getPokeDescription, speciesData } from "../api/fetchFromPokeAPI";
import Item from "./Item";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Grid from "@mui/material/Grid2";
import Carousel from "react-material-ui-carousel";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Skeleton,
} from "@mui/material";

/**
 * This is the pokemonInfo component
 * Here after navigating from pokemonList either by clicking on the pokemon card or by searching and clickin the search icon
 * A simple card where there are details for the pokemon, like more sprites aligned inside a carousel, types as well as, a text in english language (for now) describing it.
 */
const PokeInfo = () => {
  const location = useLocation();
  const { id, name, sprite, sprite_back } = location.state || {};
  const [isLoading, setIsLoading] = React.useState(false);
  const [flavorText, setFlavorText] = React.useState<string | null>(null);
  const data = [sprite, sprite_back];

  // Fetching the text from pokeAPI. This requires the pokemonID to be fetched first. After that, we pass it to the callback function
  // This is needded in order to avoid re-renders from the
  const fetchText = React.useCallback(async () => {
    //fetch the pokemon description using the ID
    try {
      const data = (await getPokeDescription(
        id as number
      )) as unknown as speciesData | null;
      console.log(data);
      // In the etxt entries array returned search for the one that matches english (for now)
      if (data?.flavor_text_entries) {
        const firstEntry = data?.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        return firstEntry
          ? firstEntry?.flavor_text.replace(/\f/g, " ").trim()
          : null; // If found return the text without any blanks and squared utf symbols.
      } else {
        return null; // If not found then return nothing
      }
    } catch (error) {
      toast.error(error + " Failed to fetch Pokémon details."); //If an error occurs hanlde it and raise an error toast
    }
  }, [id]);

  React.useEffect(() => {
    if (id && !flavorText && !isLoading) {
      setIsLoading(true);
      fetchText().then((text) => {
        if (text) {
          setFlavorText(text as string);
          setIsLoading(false);
        }
      });
    }
  }, [fetchText, flavorText, id, isLoading]);
  console.log(isLoading);

  return (
    <>
      {/** If the  */}
      {!isLoading ? (
        <>
          {" "}
          <Card
            className="Info-Card"
            sx={{ width: "50%", borderRadius: "8%", m: "auto", boxShadow: 3 }}
          >
            <Box sx={{ flexGrow: 1, justifyContent: "center" }}>
              <Grid container spacing={2}>
                {/** Material UI carousel container for sprites */}
                <Carousel
                  className="Info-Carousel"
                  sx={{ width: "100%", m: "auto" }}
                  navButtonsAlwaysVisible
                >
                  {data.map((item, i) => (
                    <Item key={i} item={item as string} />
                  ))}
                </Carousel>
              </Grid>
              <Box sx={{ mt: 1 }}>
                <Typography
                  className="Info-Text"
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  PokéID: {id as number}
                </Typography>
                <Typography
                  className="Info-Text"
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  {name.toUpperCase()}
                </Typography>
              </Box>
              {/** If the poke description exist, then render the given text, otherwise display the below messeage */}
              <CardContent className="Card-Content">
                <Typography
                  variant="body2"
                  style={{ textWrap: "wrap" }}
                  sx={{ wordBreak: "break-word", color: "text.secondary" }}
                >
                  {flavorText}
                </Typography>
              </CardContent>
            </Box>
          </Card>
          {/** Head back to the PokemonList page */}
          <Button
            className="Routing-button"
            sx={{ m: 2, backgroundColor: "black" }}
            variant="text"
          >
            <Link style={{ height: 24 }} to="/">
              <KeyboardBackspaceIcon style={{ color: "white" }} />
            </Link>{" "}
          </Button>{" "}
        </>
      ) : (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={299.26}
          height={372.84}
          sx={{ borderRadius: "8%", m: "auto", boxShadow: 3 }}
        />
      )}
    </>
  );
};

export default PokeInfo;
