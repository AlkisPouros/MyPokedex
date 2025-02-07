import PokemonList from "./components/PokemonList.tsx";
import PokeInfo from "./components/PokeInfo.tsx";
import { Route, Routes } from "react-router-dom";
import Favourites from "./components/Favourites.tsx";
import pokedexLogo from "./assets/pokedex-logo.png";
import Box from "@mui/material/Box";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { useEffect } from "react";

const preloadImage = (url: string) => {
  const img = new Image();
  img.src = url;
};


function App() {
  useEffect(() => {
    preloadImage(pokedexLogo);
  }, []);

  return (
    <>
        <Box
          style={{
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
          }}
        > {/** Setting the toaster for the entire application's notifications */}
          <Toaster position="top-center" reverseOrder={false} />
        </Box>
        <Box sx={{ padding: 2 }}>
          <img src={pokedexLogo} height={80} alt="Pokedex" />
        </Box>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/PokeInfo/:id" element={<PokeInfo />} />
          <Route path="/Favourites" element={<Favourites />} />
        </Routes>
      </>
    
  );
}

export default App;
