import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path, { resolve } from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { MongoClient, FindOptions } from "mongodb";

dotenv.config();

const dbUserName = encodeURIComponent("alkispouros");
const dbPassword = encodeURIComponent("HelloThere");

const uri = `mongodb+srv://${dbUserName}:${dbPassword}@mypokedexcluster.61scs.mongodb.net/?retryWrites=true&w=majority&appName=MyPokedexCluster`;
const client = new MongoClient(uri);

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

const app = express();
const port = process.env.PORT || 5000;

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
      res.status(201).json(newFavourite);
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
      res.status(202).send("Pokemon deleted successfully");
    }
  } catch (error) {
    res.status(501).send("Server error");
    console.error("Error ", error);
  }
});

// Handler function in order to entablish a DB conection

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("MYPokedexDB");
  } catch (error) {
    console.error("Database connection error", error);
    throw error;
  }
}

// POST function to sign up user by posting their credentials on the database.

app.post("/api/signup-service", async (request, response) => {
  console.log("Signup Service Activated");
  const { username, password } = request.body;

  if (!username || !password) {
    response
      .status(400)
      .json({ responseCode: 400, message: "Missing credentials" });
  }
  try {
    const db = await connectDB();
    const collection = client.db("MYPokedexDB").collection("UserInfo");
    const query = { username, password };
    const document = [{ username, password }];
    const options: FindOptions<Document> = {
      sort: { username: 1 },
      projection: {
        _id: 0,
        username: 1,
        password: 1,
      },
    };
    const users = await collection.find(query, options).toArray();
    if (users.length === 1) {
      response
        .status(409)
        .json({ ResponseCode: 409, message: "User already exists" });
    } else {
      const results = await collection.insertMany(document);
      response.status(201).json({
        ResponseCode: 201,
        message: "Successfully signed in",
        results,
      });
    }
  } catch (error) {
    console.error(error + " Error during DB access");
  }
});

// POST function to sign in user by accessing the database.

app.post("/api/login-service", async (request, response) => {
  console.log("Login Service Activated");
  const { username, password } = request.body;
  if (!username || !password) {
    response
      .status(400)
      .json({ responseCode: 400, message: "Missing credentials" });
  }

  try {
    const db = await connectDB();
    const collection = client.db("MYPokedexDB").collection("UserInfo");
    const query = { username, password };

    const options: FindOptions<Document> = {
      sort: { username: 1 },
      projection: {
        _id: 0,
        username: 1,
        password: 1,
      },
    };

    const users = await collection.find(query, options).toArray();

    if (users.length === 1) {
      response.status(200).json({
        ResponseCode: 200,
        sessionId: uuidv4(),
        username: username,
        password: password,
      });
    } else {
      response
        .status(401)
        .json({ ResponseCode: 401, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Error during DB access: ", error);
    response
      .status(500)
      .json({ responseCode: 500, message: "Internal Server error" });
  }
});

// POST function for a logged in user to add pokemon to their own collection of favourites, inside the database.

app.post(
  "/api/favourite-pokemon-addition-service",
  async (request, response) => {
    console.log("favourite pokemon addition service activated");
    const { name, id, front_sprite, back_sprite, sessionId, username } =
      request.body;
    if (!name || !id || !front_sprite || !back_sprite) {
      response
        .status(400)
        .json({ responseCode: 400, message: "No pokemon found" });
    }
    try {
      const db = await connectDB();
      const collection = await client
        .db("MYPokedexDB")
        .collection("AllConnectedUsers");
      const query = { username: username, currentSessionId: sessionId };
      const options: FindOptions<Document> = {
        sort: { username: 1 },
        projection: {
          _id: 0,
          username: 1,
          currentSessionId: 1,
        },
      };
      const user = await collection.find(query, options).toArray();
      if (user.length === 1) {
        const collection = await client
          .db("MYPokedexDB")
          .collection("FavouritePokemon");
        const pokemon = {
          pokeName: name,
          pokeId: id,
          pokeSprite_front: front_sprite,
          pokeSprte_back: back_sprite,
          FavouriteListHolderUserName: username,
          FavouriteListHolderSessionId: sessionId,
        };
        const result = await collection.insertOne(pokemon);
        console.log(result);
        console.log(result.acknowledged);
        if (result.acknowledged)
          response
            .status(201)
            .json({ responseCode: 201, message: "Pokemon Added" });
      } else {
        response
          .status(500)
          .json({ responseCode: 500, message: "Cannot add pokemon" });
      }
    } catch (error) {
      console.error("Error during DB access: ", error);
      response
        .status(500)
        .json({ responseCode: 500, message: "Internal Server error" });
    }
  }
);

// GET function for a logged in user retrieve their favourite pokemon from the database

app.get(
  "/api/favourite-pokemon-retrieval-service",
  async (request, response) => {
    console.log("pokemon retrieval service activated");
    const { username, sessionId } = request.body;
    if (!username || !sessionId) {
      response
        .status(400)
        .json({ responseCode: 400, message: "No pokemon found" });
    }
    try {
      const collection = await client
        .db("MYPokedexDB")
        .collection("AllConnectedUsers");
      const query = {
        username: username,
        currentSessionId: sessionId,
      };
      const options: FindOptions<Document> = {
        sort: { username: 1 },
        projection: {
          _id: 0,
          username: 1,
          currentSessionId: 1,
        },
      };
      const user = await collection.find(query, options).toArray();
      if (user.length === 1) {
        const collection = await client
          .db("MYPokedexDB")
          .collection("FavouritePokemon");
        const FavouritePokemon = await collection.find({
          $or: [
            { FavouriteListHolderUserName: username },
            { FavouriteListHolderSessionId: sessionId },
          ],
        }).toArray();
        console.log(FavouritePokemon);
        if (FavouritePokemon)
          response.status(200).json({responseCode: 200, message: "pokemon fetched successfully", FavouritePokemon})
      } else {
        response
          .status(500)
          .json({ responseCode: 500, message: "Cannot retrieve pokemon" });
      }
    } catch (error) {
      console.error("Error during DB access: ", error);
      response
        .status(500)
        .json({ responseCode: 500, message: "Internal Server error" });
    }
  }
);

// DELETE function for a logged in user to remove a pokemon from their favourites list. 

app.delete("/api/pokemon-removal-service" , async (request, response) => {
  console.log("pokemon removal service activated");

})
app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
