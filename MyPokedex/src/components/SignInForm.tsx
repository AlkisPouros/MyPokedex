import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import PokeBall from "../assets/Pokeball.png";

type SignInFormProps = {
  signIn: (username: string, password: string) => Promise<void>;
  handleOpenSignUp: () => void;
};

const SignInForm = ({ signIn, handleOpenSignUp }: SignInFormProps) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (username && password) {
      signIn(username, password);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: 400,
          backgroundColor: "#000",
          padding: 3,
          borderRadius: 2,
          ml: 2,
          mr: 2,
        }}
      >
        <Box>
          <img src={PokeBall} height={28} width={28}></img>
          <Typography variant="h4" color="white" align="center" gutterBottom>
            Login
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Username"
          type="username"
          required
          variant="outlined"
          margin="normal"
          color="primary"
          placeholder="Enter your username"
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          required
          variant="outlined"
          margin="normal"
          color="primary"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            my: 2,
            backgroundColor: "red",
            color: "white",
            borderRadius: 2,
          }}
        >
          log in
        </Button>
        <Typography sx={{ color: "gray", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link
            onClick={handleOpenSignUp}
            sx={{ color: "#fff", textDecoration: "underline" }}
          >
            Sign Up
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default SignInForm;
