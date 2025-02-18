import {
  Box,
  Button,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import React from "react";

const Pokeball = styled(Box)(({ theme }) => ({
  display: "inline-block",
  margin: "20px",
  width: "100px",
  height: "80px",
  background: theme.palette.error.dark,
  borderRadius: "30%",
  boxShadow:
    "inset 0 -72px 0 -37px #fff, inset 0 -76px 0 -35px #000, 0 0 0 5px #000",
  position: "relative",
  transition: "0.4s",
  transformOrigin: "bottom center",
  "&:before": {
    content: '""',
    position: "absolute",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#fff",
    top: "40px",
    left: "40px",
    border: "1px solid rgba(0,0,0,.4)",
    boxShadow: "2px 0 0 0 rgba(0,0,0,0.2), 0 0 0 5px #fff, 0 0 0 10px #000",
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  "&:hover": {
    cursor: "pointer",
    animation: "anti-wiggle 1s ease-in-out",
  },
  "&:hover:after": {
    animation: "wiggle 1s ease-in-out",
  },
  "@keyframes wiggle": {
    "20%": { transform: "rotate(7deg)" },
    "40%": { transform: "rotate(-14deg)" },
    "60%": { transform: "rotate(4deg)" },
    "80%": { transform: "rotate(-2deg)" },
    "100%": { transform: "rotate(0deg)" },
  },
  "@keyframes anti-wiggle": {
    "20%": { transform: "translateX(4px) rotate(-7deg)" },
    "40%": { transform: "translateX(-8px) rotate(14deg)" },
    "60%": { transform: "translateX(2px) rotate(-4deg)" },
    "80%": { transform: "translateX(-1px) rotate(2deg)" },
    "100%": { transform: "translateX(0px) rotate(0deg)" },
  },
}));

type PokeBallButtonProps = {
  handleOpenSignIn: () => void;
};
const PokeBallButton = ({ handleOpenSignIn }: PokeBallButtonProps) => {
  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));
  return (
    <>
      <BootstrapTooltip
        disableInteractive
        enterDelay={300}
        leaveDelay={200}
        title={
          <React.Fragment>
            <Typography color="inherit">
              Please sign in to add a Pokemon
            </Typography>
          </React.Fragment>
        }
      >
        <Button
          sx={{
            padding: 0,
            minWidth: "auto",
            background: "transparent",
            "&:hover": { background: "transparent" },
          }}
          onClick={handleOpenSignIn}
        >
          <Pokeball />
        </Button>
      </BootstrapTooltip>
    </>
  );
};

export default PokeBallButton;
