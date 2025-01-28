import * as React from "react";
import { Pagination, Stack, PaginationItem } from "@mui/material";

type ChangePageProps = {
  maxValue: number | undefined;
  counter: number;
  FilteredPokemonArraymaxLength: number;
  onPageChange: (counter: number) => void;
};

/**
 * This is the Pagination component used inside the pokemonList component
 * This has a container of Pagination component from material UI
 * The component withholds an arrow function which renders multiple button items which allow users to navigate the paginated lists inside the main pokemon list
 */
export default function PaginationOutlined({
  maxValue,
  counter,
  FilteredPokemonArraymaxLength,
  onPageChange,
}: ChangePageProps) {
  const [page, setPage] = React.useState<number>(Math.ceil(counter / 12) + 1);

  // If the handleChnage occurs then update states for offset counter the value of the page given based on the item selected inside the pagination component
  // which aligns the page to item buttons.
  // Update the page value when the counter changes
  React.useEffect(() => {
    const expectedPage = Math.ceil((counter / 12) + 1);
    if (page !== expectedPage)
      setPage(expectedPage);
    console.log(page);
    console.log(counter);
  }, [counter,page]);
 
  // Update the page value as well as the counter to calculate the offest passin gthe chamges to the mapping inside the pokemonList

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    const maxItems =
      FilteredPokemonArraymaxLength > 0
        ? FilteredPokemonArraymaxLength
        : maxValue || 1;
    const newCounter = Math.min((value - 1) * 12, maxItems - 12);
    onPageChange(newCounter);
    localStorage.setItem("pokemonCounter", String(newCounter));
  };
  // If we have less pokemon (because of pokemonlist filtering) than what the pagination can display, then disable the pagination
  const isPaginationDisabled =
    FilteredPokemonArraymaxLength <= 12 && FilteredPokemonArraymaxLength >= 0;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "nowrap",
        width: "100%",
        mt: 2,
        "@media (max-width: 800px)": { maxWidth: 450 },
        "@media (min-width: 800px)": { maxWidth: 750 },
      }}
    >
      <Pagination
        count={Math.ceil(
          (FilteredPokemonArraymaxLength >= 0
            ? FilteredPokemonArraymaxLength
            : maxValue || 1) / 12
        )}
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
        disabled={isPaginationDisabled}
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: "1rem",
            minWidth: "40px",
            minHeight: "40px",
            flexShrink: 1,
            backgroundColor: "black",
            color: "white",
            "@media (max-width: 500px)": {
              fontSize: "0.75rem",
              minWidth: "30px",
              minHeight: "30px",
            },
            "@media (max-width: 400px)": {
              fontSize: "0.65rem",
              minWidth: "22px",
              minHeight: "22px",
              padding: "2px",
            },
          },
          "& .MuiPaginationItem-root:hover": {
            backgroundColor: "gray",
          },
          "& .Mui-selected": {
            backgroundColor: "white",
            color: "black",
          },
        }}
        renderItem={(item) => (
          <PaginationItem
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "gray",
              },
              "&.Mui-selected": {
                backgroundColor: "white",
                color: "black",
              },
            }}
            {...item}
          />
        )}
      />
    </Stack>
  );
}
