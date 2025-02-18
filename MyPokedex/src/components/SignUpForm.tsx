import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";

type SignUpFormProps = {
  signUp: (username: string, password: string) => void;
  handleCloseSignUp: () => void;
  handleCloseSignIn: () => void;
};
const SignUpForm = ({ signUp ,handleCloseSignUp, handleCloseSignIn }: SignUpFormProps) => {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setuserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = () => {
    const userNameValidation = validateuserName(userName);
    const passwordValidation = validatePassword(password);

    if (userNameValidation || passwordValidation) {
      setuserNameError(userNameValidation);
      setPasswordError(passwordValidation);
    } else {
      setuserNameError("");
      setPasswordError("");
      signUp(userName, password);
      handleCloseSignUp();
      handleCloseSignIn();
    }
  };
  const validateuserName = (userName: string) => {
    const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{1,10}$/;
    if (!usernameRegex.test(userName)) {
      return "Please enter a valid username.";
    }
    if (userName.length > 20) {
      return "username is too long.";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must contain at least 6 characters, including one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    return "";
  };

  return (
    <>
      <Box
        sx={{
          width: 400,
          backgroundColor: "#000",
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Box>
          <img src="./src/assets/Pokeball.png" height={28} width={28}></img>
          <Typography variant="h5" color="white" align="center" gutterBottom>
            Create an Account
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
          onChange={(e) => setuserName(e.target.value)}
          error={!!userNameError}
          helperText={userNameError}
        />
        <TextField
          fullWidth
          label="Create Password"
          type="password"
          required
          variant="outlined"
          margin="normal"
          color="primary"
          placeholder="Create a password"
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            my: 2,
            backgroundColor: "red",
            color: "white",
            borderRadius: 2,
          }}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
        <Typography sx={{ color: "gray", textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            onClick={handleCloseSignUp}
            sx={{ color: "#fff", textDecoration: "underline" }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default SignUpForm;
