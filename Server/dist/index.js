"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const allowedOrigins = (_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(",");
const corsOptions = {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
};
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)(corsOptions));
// Parsing JSON request bodies
app.use(express_1.default.json());
// Define the file path for the favourites JSON file
const favouritesFilePath = path_1.default.join(__dirname, "favourites.json");
// Helper function to read favourites from the file
const readFavouritesFromFile = () => {
    if (fs_1.default.existsSync(favouritesFilePath)) {
        const fileContent = fs_1.default.readFileSync(favouritesFilePath, "utf-8");
        return JSON.parse(fileContent);
    }
    else {
        return []; // Return an empty array if the file doesn't exist
    }
};
// Helper function to write favourites to the file
const writeFavouritesToFile = (favourites) => {
    fs_1.default.writeFileSync(favouritesFilePath, JSON.stringify(favourites, null, 2), "utf-8");
};
// POST function to a selected from user pokemon to the server. Avoid any duplicates by checking if the ID exists.
app.post("/api/favourites", (req, res) => {
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
    }
    catch (error) {
        res.status(501).send("Server Error");
        console.error("Error", error);
    }
});
// GET function to obtain the list of the user's favorite selected pokemon
app.get("/api/favourites", (req, res) => {
    try {
        const favourites = readFavouritesFromFile();
        res.status(200).json(favourites);
    }
    catch (error) {
        res.status(501).send("Server Error");
        console.log("Error", error);
    }
});
// DELETE function to remove a pokemon from the favorites list using its given ID.
app.delete("/api/favourites", (req, res) => {
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
    }
    catch (error) {
        res.status(501).send("Server error");
        console.error("Error ", error);
    }
});
app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${port}`);
});
