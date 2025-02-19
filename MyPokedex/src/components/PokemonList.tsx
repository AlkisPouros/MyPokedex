import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchDataFromApi,
  addToFavourites,
  Pokemon,
  PokemonsData,
  getPokemonSprite,
  FIRST_POKEMON_ID,
  LAST_POKEMON_ID,
  PokemonDataIndexes,
} from "../api/fetchFromPokeAPI";
import { askServerForFavePomemon } from "../api/fetchFavouritesFromServer";
import PaginationOutlined from "./PaginationOutlined";
import Skeletons from "./Skeletons";
import { Box } from "@mui/material";
import "../index.css";
import { useAuth } from "../AuthProvider";
import MainPokemonListArea from "./MainPokemonListArea";
import { useQuery, useQueryClient } from "react-query";

/* This is the pokemon list component, the main screen of the application.
   Here After fetching the first 151 Kanto pokemon of the ,using the pokeAPI, we map the pokemon storing them inside an array in order to hanlde the PAGINATION EFFECT. 
   The users can navigate through the pokemon list, click on a pokemon and navigate to their info page forming the respective endpoint. They can also save a pokemon they like
   by clicking on the heart inside the capokemon cards and check through the heart/favourites link beside the search bar their favourite pokemon, if they have any.
   Lastly there is the pokemon search bar which can be used to search a pokemon via name or ID. */

const PokemonList = () => {
  // React state initializations
  const [pokemonData, setPokemonData] = React.useState<{
    dictionary: PokemonsData;
    orderList: number[];
  } | null>(null);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState("");
  // use the isUserSignedIn when needed.
  const { isUserSignedIn } = useAuth();
  const [filteredPokemon, setFilteredPokemon] = React.useState<Pokemon[]>([]);
  const [counter, setCounter] = React.useState<number>(0);
  // TODO: CHECK WHAT WILL BE DONE WITH THIS ONE
  const [addedPokemon, setAddedPokemon] = React.useState<number[] | undefined>(
    []
  );
  const queryClient = useQueryClient();
  const [userName, setuserName] = React.useState<string | null>(null);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const location = useLocation();

  // Fetching the pokemon from the PokeAPI
  // Using the useCallBackFunction in order to cache the response from the api between re-renders
  // Which means that every time we perform a state change that might influence he UI, UX and app logic we need to perform changes to state values per render ONLY ONCE
  // Only when the apiData and spriteData change do we execute this, which means only on app entry and on refresh.

  const { refetch } = useQuery({
    queryKey: ["apiData"],
    queryFn: async () =>
      await fetchDataFromApi(FIRST_POKEMON_ID, LAST_POKEMON_ID),
    onSuccess: (data: Pokemon[]) => {
      if (data) {
        initializeData(data as Pokemon[]);
      }
    },
    staleTime: 10 * (60 * 1000),
    cacheTime: 15 * (60 * 1000),
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const initializeData = React.useCallback(
    async (data: Pokemon[]) => {
      if (!data) return;
      console.log(data);
      const pokemonData: { dictionary: PokemonsData; orderList: PokemonDataIndexes } = data.reduce(
        (accumulator, pokemon) => {
          const urlParts = pokemon.url.split("/");
          const pokemonId = parseInt(urlParts[6]);
  
          // Ensure correct typing for dictionary
          accumulator.dictionary[pokemonId] = {
            ...pokemon,
            id: pokemonId,
            name: pokemon.name,
            url: pokemon.url,
            sprites: { front: "", back: "" },
          };
  
          accumulator.orderList.push(pokemonId);
          return accumulator;
        },
        { dictionary: {}, orderList: [] } as { dictionary: PokemonsData; orderList: PokemonDataIndexes } // Explicitly type the initial value
      );
  
      console.log(pokemonData);
  
      // Fetch sprites
      const spritePromises = pokemonData.orderList.map(async (id) => {
        return getPokemonSprite(id);
      });
  
      const spritesList = await Promise.all(spritePromises);
  
      // Ensure spriteData is properly typed
      spritesList.forEach((spriteData) => {
        const pokemonId = spriteData?.id as number;
        if (pokemonData.dictionary[pokemonId as number]) {
          pokemonData.dictionary[pokemonId].sprites.front = spriteData?.front as string;
          pokemonData.dictionary[pokemonId].sprites.back = spriteData?.back as string;
        }
      });
  
      setPokemonData(pokemonData);
      setFilteredPokemon(
        pokemonData.orderList.map((id) => pokemonData.dictionary[id])
      );
  
      // Handle pagination state
      const savedCounter = localStorage.getItem("pokemonCounter");
      setCounter(savedCounter ? Number(savedCounter) : location?.state?.counter || 0);
      setTimeout(() => setIsLoading(false), 200);
    },
    [location?.state?.counter]
  );

  const { data: favourites } = useQuery({
    queryKey: ["favourites", sessionId],
    queryFn: async () =>
      await askServerForFavePomemon(sessionId as string, pokemonData),
    onSuccess: (favourites) => {
      fetchFavourites(favourites?.FavouritePokemonID as number[]);
    },
    staleTime: 10 * (60 * 1000),
    cacheTime: 15 * (60 * 1000),
    refetchOnWindowFocus: true,
    enabled: !!sessionId,
  });
  React.useEffect(() => {
    const savedCounter = localStorage.getItem("pokemonCounter");
    if (savedCounter !== null) {
      setCounter(Number(savedCounter));
    }
  }, []);
  React.useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedSessionId = localStorage.getItem("sessionId");

    console.log("Stored userName:", storedUserName);
    console.log("Stored sessionId:", storedSessionId);
    console.log("isUserSignedIn:", isUserSignedIn);

    if (storedUserName) setuserName(storedUserName);
    if (storedSessionId) setSessionId(storedSessionId);
  }, [userName, sessionId, isUserSignedIn]);
  React.useEffect(() => {
    console.log(isLoading);
    if (isLoading) {
      refetch()
        .then(() => {
          if (filteredPokemon.length > 0) {
            setTimeout(() => setIsLoading(false), 200);
          }
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(true);
        });
      console.log(isLoading + " Fetching completed");
    }
  }, [refetch, isLoading, filteredPokemon]);

  // On every app entry and refresh we should also maintain the state for favourite addition for consistency inside the UI.

  const fetchFavourites = async (favourites: number[]) => {
    if (Array.isArray(favourites)) {
      // Extract the `id` field from each object in the response
      setAddedPokemon(favourites.map((id: number) => id));
      localStorage.setItem("addedPokemon", JSON.stringify(favourites));
    } else {
      console.error("Unexpected response format from the server");
      setAddedPokemon([]);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    if (!pokemonData) return;
    const searchValue = value.trim().toLowerCase();
    setCounter(0); // Reset pagination whenever a search is performed
    // If search value is a number, filter by IDi
    if (!isNaN(Number(searchValue)) && searchValue !== "") {
      const filteredById = pokemonData.orderList
        .filter((id) => id === Number(searchValue)) // Check if the ID matches
        .map((id) => pokemonData.dictionary[id]); // Map to Pokémon data

      setFilteredPokemon(filteredById);
      return;
    }

    // If search value is a string, filter by name
    if (searchValue !== "") {
      const filteredByName = pokemonData.orderList
        .filter((id) =>
          pokemonData.dictionary[id].name.toLowerCase().startsWith(searchValue)
        ) // Check if the name includes the search string
        .map((id) => pokemonData.dictionary[id]); // Map to Pokémon data

      setFilteredPokemon(filteredByName);
      return;
    }

    // If the input is empty, reset to the full list
    setFilteredPokemon(
      pokemonData.orderList.map((id) => pokemonData.dictionary[id])
    );
    if (searchValue === "") {
      setFilteredPokemon(
        pokemonData.orderList.map((id) => pokemonData.dictionary[id])
      );
      return;
    }
  };
  // Handle the input on click of the search button or by clicking keyboard key
  // This function executtes based on the input given numeric or string inside the search bar
  const handleInputClick = () => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue || trimmedValue === "") {
      toast.error("No value entered");
      return;
    }
    const ID = parseInt(trimmedValue, 10);
    const isNumeric = !isNaN(Number(trimmedValue));
    const id = isNumeric ? parseInt(trimmedValue, 10) : null;

    if (isNumeric && ID && pokemonData?.dictionary[ID]) {
      const pokemon = pokemonData?.dictionary[ID];
      navigate(`/PokeInfo/${id}`, {
        state: { id, name: pokemon.name, sprite: pokemon.sprites.front },
      });
    } else {
      const matchingPokemon = Object.values(pokemonData?.dictionary || {}).find(
        (pokemon) => pokemon.name.toLowerCase() === trimmedValue.toLowerCase()
      );
      // If there is a match navigate to the respective pokemon page.
      if (matchingPokemon) {
        navigate(`/PokeInfo/${matchingPokemon.id}`, {
          state: {
            id: matchingPokemon.id,
            name: matchingPokemon.name,
            sprite: matchingPokemon.sprites.front,
          },
        });
      } else {
        // otherwise raise a toast
        toast.error("No Pokémon found!");
      }
    }
  };

  // Add to favourite functionlity hanlder Also check if the pokemon included already exists.
  const handleAddToFavourites = (pokemonId: number) => {
    if (!isUserSignedIn) {
      toast.error("You need to sign in first");
      return;
    }

    // Optimistically update UI before the API request
    setAddedPokemon((prev) =>
      prev?.includes(pokemonId)
        ? prev?.filter((id) => id !== pokemonId)
        : [...(prev as number[]), pokemonId]
    );
    addToFavourites(pokemonId, sessionId as string)
      .then((res) => {
        if (res?.ok) {
          queryClient.invalidateQueries(["favourites", sessionId as string]);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((error) => {
        setAddedPokemon((favourites) =>
          favourites?.filter((id) => id !== pokemonId)
        );
        console.log(error);
        console.log(addedPokemon);
      });
  };

  // Function to sync the changes between the
  const handlePageChange = (page: number) => {
    setCounter(page);
  };

  return (
    <>
      {/** The UI, is writen using materialUI, a grid of three rows on large displays, 2 columns on medium and 1 on small display, */}

      {!isLoading ? (
        <>
            <MainPokemonListArea
              isUserSignedIn={isUserSignedIn}
              counter={counter}
              searchValue={searchValue}
              sessionId={sessionId as string}
              filteredPokemon={filteredPokemon}
              pokemonData={pokemonData}
              addedPokemon={favourites?.FavouritePokemonID as number[]}
              handleAddToFavourites={handleAddToFavourites}
              handleInputChange={handleInputChange}
              handleInputClick={handleInputClick}
            />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              overflow: "hidden",
              padding: filteredPokemon.length > 0 ? -0.5 : "auto",
              "@media (max-width: 360px)": {},
            }}
          >
            {filteredPokemon.length > 0 ? (
              <PaginationOutlined
                maxValue={pokemonData?.orderList.length}
                counter={counter}
                FilteredPokemonArraymaxLength={filteredPokemon.length}
                onPageChange={handlePageChange}
              />
            ) : (
              <></>
            )}
          </Box>
        </>
      ) : (
        <>
          <Skeletons skeletons={12} isUserSignedIn={isUserSignedIn} />
        </>
      )}
    </>
  );
};

export default PokemonList;
