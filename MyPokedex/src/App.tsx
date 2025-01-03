
import './App.css'
import  PokemonList  from './components/PokemonList.tsx'
import PokeInfo from './components/PokeInfo.tsx'
import { Route, Routes } from 'react-router-dom';
import Favourites from './components/Favourites.tsx';
import pokedexLogo from "./assets/pokedex-logo.png"
import Box from '@mui/material/Box'

function App() {

  return (
    <>
       <Box sx ={{padding: 2}}>
        <img src = {pokedexLogo} height={80}  alt="Pokedex"/>
       </Box>
        <Routes>
          <Route path="/" element={<PokemonList/>}/>
          <Route path="/PokeInfo/:id" element={<PokeInfo/>}/>
          <Route path="/Favourites" element={<Favourites/>}/>
        </Routes>

    </>
  )
}

export default App
