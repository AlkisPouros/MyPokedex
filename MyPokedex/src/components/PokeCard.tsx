import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";
import { Pokemon } from "../api/fetchFromPokeAPI";


type PokeCardProps = {
  pokemonId: number;
  pokeName: string | undefined;
  counter: number;
  filteredPokemon: Pokemon[];
  sprite_front: string;
  sprite_back: string | undefined;
  addedPokemon: number[];
  isUserSignedIn: boolean;
  handleAddToFavourites: (id: number) => void;
};

export default function PokeCard({
  pokemonId,
  pokeName,
  counter,
  filteredPokemon,
  sprite_front,
  sprite_back,
  addedPokemon,
  isUserSignedIn,
  handleAddToFavourites,
}: PokeCardProps) {

  
  return (
    <>
      <Card
        className="card"
        sx={{
          width: "100%",
          alignItems: "center",
          borderRadius: "8%",
          "@media ((min-width: 600px) and (max-width: 800px))": {
            width:
              filteredPokemon.length > 3
                ? "100%"
                : filteredPokemon.length === 1
                  ? 250
                  : 250,
            ml: filteredPokemon.length === 1 ? -3 : 0,
          },
          "@media (min-width: 800px) and (max-width: 900px)": {
            width:
              filteredPokemon.length > 3
                ? "100%"
                : filteredPokemon.length === 1
                  ? 300
                  : 300,
            ml: filteredPokemon.length === 1 ? -6 : 0,
          },
          "@media (min-width: 900px)": {
            width:
              filteredPokemon.length > 3
                ? 200
                : filteredPokemon.length === 1
                  ? 200
                  : 200,
            ml : filteredPokemon.length === 2 ? -4.5 : filteredPokemon.length === 1 ? -4 : 0,
          },
          "@media (max-width: 600px) and (min-width: 400px)": {
            width: "80%",
            ml : filteredPokemon.length === 1 ? 3 : 4,
          },
        }}
      >
        {addedPokemon && addedPokemon?.includes(Number(pokemonId)) && isUserSignedIn ? (
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
              onClick={() => handleAddToFavourites(Number(pokemonId))}
            >
              <FavoriteBorderIcon style={{ color: "black" }} />
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
          <CardActionArea sx={{ textAlign: "center", width: "100%" }}>
            <CardMedia
              component="img"
              image={sprite_front}
              alt={pokeName}
              style={{ width: "60%", margin: "auto" }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" component="div" className="card-text">
                #{Number(pokemonId)}
              </Typography>
              <Typography variant="body1" component="div" className="card-text">
                {pokeName?.toUpperCase()}
              </Typography>
            </Box>
          </CardActionArea>
        </Link>
      </Card>
    </>
  );
}
