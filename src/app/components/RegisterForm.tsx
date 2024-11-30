"use client";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      if (!username || !email || !password) {
        throw new Error("Please fill out all fields");
      }
      if (res.ok) {
        router.push("/login");
      } else {
        const error = await res.json();
        setError(error.message);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Box
      boxShadow={"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}
      mx={"auto"}
      width={"20rem"}
      p={6}
      borderRadius={"30px"}
      mb={1}
      mt={4}
    >
      <Stack spacing={2}>
        <Typography variant="h3" color={"primary.main"} fontWeight={"600"}>
          Sign up
        </Typography>
        <Typography color={"#1c203d"}>Welcome ! Sign up below</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 15 }}
        >
          <TextField
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            size="small"
            name="password"
            label="Username"
          />
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            size="small"
            name="email"
            label="Email"
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            size="small"
            name="password"
            label="Password"
          />
          <Button typeof="submit" variant="outlined" type="submit">
            Sign up
          </Button>
        </form>
        {error && <Typography color={"red"}>{error}</Typography>}
        <Link href={"/login"}>Already have an account? Login here</Link>
      </Stack>
    </Box>
  );
};

export default RegisterForm;
