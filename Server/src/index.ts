import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const corsOptions = {
  origin: ["http://localhost:3000"],
};
const app = express();
const port = 5000;

app.use(cors(corsOptions));
// Parsing JSON request bodies
app.use(express.json());


// Define the file path for the favourites JSON file
const favouritesFilePath = path.join(__dirname, "favourites.json");

// Helper function to read favourites from the file
const readFavouritesFromFile = (): {
  id: number;
  name: string;
  sprite: string;
}[] => {
  if (fs.existsSync(favouritesFilePath)) {
    const fileContent = fs.readFileSync(favouritesFilePath, "utf-8");
    return JSON.parse(fileContent);
  } else {
    return []; // Return an empty array if the file doesn't exist
  }
};

// Helper function to write favourites to the file
const writeFavouritesToFile = (
  favourites: { id: number; name: string; sprite: string }[]
): void => {
  fs.writeFileSync(
    favouritesFilePath,
    JSON.stringify(favourites, null, 2),
    "utf-8"
  );
};
// POST function to a selected from user pokemon to the server. Avoid any duplicates by checking if the ID exists.
app.post("/api/favourites", (req: Request, res: Response) => {
  try {
    const { id, name, sprite } = req.body;
    const newFavourite = { id, name, sprite };

    const favourites = readFavouritesFromFile();
    const found = favourites.some((element) => element.id === id);
    if (!found) {
      favourites.push(newFavourite);
      // Write the updated favourites list to the file
      writeFavouritesToFile(favourites);
      res.status(204).json(newFavourite);
    }
  } catch (error) {
    res.status(501).send("Server Error");
    console.error("Error", error);
  }
});
// GET function to obtain the list of the user's favorite selected pokemon
app.get("/api/favourites", (req: Request, res: Response) => {
  try {
    const favourites = readFavouritesFromFile();
    res.status(200).json(favourites);
  } catch (error) {
    res.status(501).send("Server Error");
    console.log("Error", error);
  }
});
// DELETE function to remove a pokemon from the favorites list using its given ID.  
app.delete("/api/favourites", (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const removedPokemon = { id };
    let favourites = readFavouritesFromFile();
    // Remove the Pokémon with the given ID. 
    const updatedFavourites = favourites.filter((pokemon) => pokemon.id !== id);
    if (updatedFavourites.length !== favourites.length) {
      // If it has changed, write the updated list to the file
      writeFavouritesToFile(updatedFavourites);
      res.status(200).send("Pokemon deleted successfully");
    }
  } catch (error) {
    res.status(501).send("Server error");
    console.error("Error ", error);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
