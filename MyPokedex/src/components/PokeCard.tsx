import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Stack,
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
  sprite_front,
  sprite_back,
  addedPokemon,
  isUserSignedIn,
  handleAddToFavourites,
}: PokeCardProps) {
  

  return (
    <>
      <Stack
        component={Card}
        className="card"
        sx={{
          borderRadius: "8%",
        }}
        alignItems="center"
        
      >
        <Box sx={{ alignSelf: "flex-end" }}>
          {addedPokemon &&
          addedPokemon?.includes(Number(pokemonId)) &&
          isUserSignedIn ? (
            <Button variant="text">
              <FavoriteIcon style={{ color: "red" }} />
            </Button>
          ) : (
            <Button
              variant="text"
              onClick={() => handleAddToFavourites(Number(pokemonId))}
            >
              <FavoriteBorderIcon style={{ color: "black" }} />
            </Button>
          )}
        </Box>
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
            sx={{
              textAlign: "center",
              minWidth: "15rem",
            }}
          >
            <CardMedia
              component="img"
              image={sprite_front}
              alt={pokeName}
              style={{ width: "9rem", margin: "auto" }}
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
      </Stack>
    </>
  );
}
