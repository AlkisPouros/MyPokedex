import React from "react";
import { Modal, Button, Box } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AppProvider } from "@toolpad/core";
import "../index.css";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import PokeBallButton from "./PokeBallButton";

type AuthModalPropTypes = {
  login: (username: string, password: string) => void;
  signup: (username: string, password: string) => void;
};
export default function AuthModals({ login, signup }: AuthModalPropTypes) {
  const [openSignUp, setOpenSignUp] = React.useState<boolean>(false);
  const [openSignIn, setOpenSignIn] = React.useState<boolean>(false);

  const BRANDING = {
    logo: (
      <img
        src="./src/assets/Pokeball.png"
        alt="Pokemon logo"
        style={{ height: 24 }}
      />
    ),
    title: "MyPokedex",
  };

  const handleOpenSignUp = () => {
    setOpenSignUp(true);
  };

  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };
  const handleOpenSignIn = () => {
    setOpenSignIn(true);
  };
  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };

  const signIn = async (username: string, password: string) => {
    console.log(username + " " + password);
    await login(username, password);
  };

  const signUp = async (username: string, password: string) => {
    console.log(username + " " + password);
    await signup(username, password);
  };

  return (
    <>
      <div>
        <PokeBallButton handleOpenSignIn={handleOpenSignIn} />
        {openSignIn && !openSignUp && (
          <Modal
            open={openSignIn}
            onClose={handleCloseSignIn}
            disableScrollLock={true}
            sx={{
              "& .MuiBackdrop-root": {
                backgroundColor: "rgba(255, 255, 255, 0.94)",
                opacity: 0.8,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <AppProvider branding={BRANDING}>
                <Button
                  onClick={handleCloseSignIn}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "black",
                    borderRadius: 2,
                  }}
                >
                  <CloseRoundedIcon sx={{ color: "white" }} />
                </Button>
                <SignInForm
                  signIn={signIn}
                  handleOpenSignUp={handleOpenSignUp}
                />
              </AppProvider>
            </Box>
          </Modal>
        )}
        {openSignIn && openSignUp && (
          <Modal
            open={openSignUp}
            onClose={handleCloseSignUp}
            disableScrollLock={true}
            sx={{
              "& .MuiBackdrop-root": {
                backgroundColor: "rgba(255, 255, 255, 0.94)",
                opacity: 0.8,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <AppProvider branding={BRANDING}>
                <Button
                  onClick={() => {
                    handleCloseSignUp();
                    handleCloseSignIn();
                  }}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "black",
                    borderRadius: 2,
                  }}
                >
                  <CloseRoundedIcon sx={{ color: "white" }} />
                </Button>
                <SignUpForm
                  signUp={signUp}
                  handleCloseSignUp={handleCloseSignUp}
                  handleCloseSignIn={handleCloseSignIn}
                />
              </AppProvider>
            </Box>
          </Modal>
        )}
      </div>
    </>
  );
}
