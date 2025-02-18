import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { MongoClient, FindOptions, Filter } from "mongodb";
import bcrypt from "bcrypt";
import { mongo, ObjectId } from "mongoose";

const saltRounds = 12;

dotenv.config();

process.on("SIGINT", async () => {
  console.log(" Closing MongoDB connection due to app termination...");
  await closeDB();
  process.exit(0);
});

let isConnected = false;
const dbUserName = encodeURIComponent(process.env.DB_USERNAME as string);
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD as string);

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

// Handler function in order to entablish a DB conection

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    isConnected = true;
    return client.db("MYPokedexDB");
  } catch (error) {
    console.error("Database connection error", error);
    throw error;
  }
}
// Handler function to close the connection explicitly when needed
async function closeDB() {
  if (isConnected) {
    await client.close();
    isConnected = false;
    console.log("MongoDB connection closed.");
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

  const db = await connectDB();
  const collection = client.db("MYPokedexDB").collection("UserInfo");
  try {
    const FavouritePokemon: number[] = [];
    const hashedPassword = bcrypt.hash(
      password,
      saltRounds,
      (err: Error | undefined, hash: string) => {
        if (err) throw err;
        console.log("Hashed password:", hash);
      }
    );

    const document = [{ username, hashedPassword, FavouritePokemon }];
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
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
    const hashedPassword = bcrypt.hash(
      password,
      saltRounds,
      (error: Error | undefined, hash: string) => {
        if (error) throw error;
        console.log("Hashed password:", hash);
      }
    );
    const query = { username, hashedPassword };
    console.log(username);
    const options: FindOptions<Document> = {
      sort: { username: 1 },
      projection: {
        _id: 1,
        username: 1,
        password: 1,
      },
    };

    const users = await collection.findOne(query, options);

    if (users) {
      const sessionId = uuidv4();
      const collection = client.db("MYPokedexDB").collection("userSession");
      collection.insertOne({ userID: users._id, sessionId: sessionId });
      console.log(users._id);
      response.status(200).json({
        ResponseCode: 200,
        sessionId: sessionId,
        username: username,
        password: password,
      });
    } else {
      response
        .status(401)
        .json({ ResponseCode: 401, message: " Invalid Credentials" });
    }
  } catch (error) {
    console.error(" Error during DB access: ", error);
    response
      .status(500)
      .json({ responseCode: 500, message: " Internal Server error" });
  }
});

// POST function for a user to perform a successful logout and update their sessionID entry.

app.post("/api/logout-service", async (request, response) => {
  const { sessionId } = request.body;
  console.log(sessionId);
  if (!sessionId) response.status(400).json({ responseCode: 400, message: "" });
  try {
    const db = await connectDB();
    const sessionIDCollection = db.collection("userSession");
    const deleteResult = await sessionIDCollection.deleteMany({ sessionId });
    if (deleteResult.deletedCount === 1) {
      console.log(sessionId);
      response
        .status(200)
        .json({ responseCode: 200, message: "Logged out successfully" });
    } else {
      response
        .status(404)
        .json({ responseCode: 404, message: "Unsuccessful logout" });
    }
  } catch (error) {
    console.error("Error during DB access ", error);
  }
});

// POST function for a logged in user to add pokemon to their own collection of favourites, inside the database.

app.post(
  "/api/favourite-pokemon-addition-service",
  async (request, response) => {
    console.log("favourite pokemon addition service activated");
    const { id, sessionId } = request.body;

    // Check if id and sessionId are provided
    if (!id || !sessionId) {
      response
        .status(400)
        .json({ responseCode: 400, message: " Missing Pokémon or sessionId" });
    }
    // Find the user by sessionId
    try {
      const db = await connectDB();
      const collection = db.collection("userSession");
      const userID = await collection.find({ sessionId }).toArray();
      if (userID.length === 0) {
        response
          .status(404)
          .json({ responseCode: 404, message: "Session not found" });
      }
      const userId = userID[0].userID as ObjectId;
      const query = { _id: userId };
      const update = { $push: { FavouritePokemon: id } };

      // Ensure the update is performed on the correct user
      const result = await db.collection("UserInfo").updateOne(query, update);

      if (result.modifiedCount > 0) {
        response
          .status(201)
          .json({ responseCode: 201, message: " Pokémon successfully added" });
      } else {
        response
          .status(403)
          .json({ responseCode: 403, message: " Cannot add Pokémon" });
      }
    } catch (error) {
      console.error("Error during DB access: ", error);
      response
        .status(500)
        .json({ responseCode: 500, message: " Internal Server Error" });
    }
  }
);

// GET function for a logged in user retrieve their favourite pokemon from the database

app.get(
  "/api/favourite-pokemon-retrieval-service",
  async (request: Request, response: Response) => {
    const sessionId = request.query.sessionId as string;

    if (!sessionId) {
      response
        .status(400)
        .json({ responseCode: 400, message: " Unauthorized" });
    }

    try {
      const db = await connectDB();
      const collection = db.collection("userSession");
      const userID = await collection.find({ sessionId }).toArray();
      if (userID.length === 0) {
        response
          .status(404)
          .json({ responseCode: 404, message: "Could not find pokemon" });
      }
      const userId = userID[0].userID as ObjectId;
      const query = { _id: userId };
      const user = await db.collection("UserInfo").findOne(query, {
        projection: { _id: 0, sessionId: 1, FavouritePokemon: 1 },
      });

      if (user && user.FavouritePokemon) {
        response.status(200).json({
          responseCode: 200,
          message: "Pokémon fetched successfully",
          FavouritePokemon: user.FavouritePokemon as Number[],
        });
      } else {
        response
          .status(404)
          .json({ responseCode: 404, message: " No favourite Pokémon found" });
      }
    } catch (error) {
      console.error("Error during DB access: ", error);
      response
        .status(500)
        .json({ responseCode: 500, message: " Internal Server Error" });
    }
  }
);

// DELETE function for a logged in user to remove a pokemon from their favourites list.

app.delete(
  "/api/pokemon-removal-service",
  async (request: Request, response: Response) => {
    console.log("pokemon removal service activated");
    const sessionId = request.query.sessionId;
    const pokeId = Number(request.query.pokeId);
    if (!sessionId || !pokeId) {
      response
        .status(400)
        .json({ responseCode: 400, message: " No pokemon found" });
    }

    try {
      // TODO CHECK THIS TOO.
      const db = await connectDB();
      const collection = db.collection("UserInfo");
      const user = await db
        .collection("userSession")
        .find({ sessionId })
        .toArray();
      if (user.length === 0) {
        response.status(404).json({
          responseCode: 404,
          message: "Could not find any pokemon to delete",
        });
      }
      const userId = user[0].userID as ObjectId;
      const query = {
        _id: userId,
      };
      const update: Filter<Document> = { $pull: { FavouritePokemon: pokeId } };

      const result = await collection.updateOne(query, update);
      if (result.matchedCount === 0) {
        response
          .status(404)
          .json({ responseCode: 404, message: " User not found" });
      }

      if (result.modifiedCount === 0) {
        response.status(400).json({
          responseCode: 400,
          message: " Pokémon not found in favourites",
        });
      }

      response
        .status(200)
        .json({ responseCode: 200, message: " Pokémon successfully removed" });
    } catch (error) {
      console.error("Error during DB access: ", error);
      response
        .status(500)
        .json({ responseCode: 500, message: " Internal Server Error" });
    }
  }
);

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
