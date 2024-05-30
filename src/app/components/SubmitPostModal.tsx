import React, { FormEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getAllPreformancesOfSongs } from "@/app/services/phishin";
import { songs } from "../constants/songs";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #fff",
  borderRadius: "25px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
};

interface modalTypes {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitPostModal({ isOpen, onClose }: modalTypes) {
  //TODO: form data (change into an object later on probably)
  const [songSelected, setSongSelected] = useState("");
  const [dateSelected, setDateSelected] = useState("");
  const [description, setDescription] = useState("");
  //TODO: add error to UI
  const [error, setError] = useState("");
  const router = useRouter();

  const [allDatesOfSong, setAllDatesOfSong] = useState<any[]>([""]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description) {
      setError("Please provide a quick description");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/songSubmittion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songName: songSelected,
          description,
          date: dateSelected,
        }),
      });
      if (res.status == 400) {
        setError(""); // set error that tells user if post is already made and link to the post or display user who posted it
      } else {
        // TODO: maybe close modal here?
        // router.replace("/dashboard"); // old code
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (songSelected !== null) {
      const apiFriendlyString = songSelected
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll("/", "-");
      const fetchData = async () => {
        try {
          if (songSelected !== "") {
            const myData = await getAllPreformancesOfSongs(apiFriendlyString);
            // TODO: filter through allDatesOfSongs and remove duplicates because there are some
            setAllDatesOfSong(myData);
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [songSelected]);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            textAlign={"center"}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Submit a song
          </Typography>
          <form onSubmit={handleSubmit}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={songs}
              onChange={(event, newValue) => {
                setSongSelected(newValue!); // Update state with the selected value
              }}
              sx={{ width: 300, backgroundColor: "white" }}
              renderInput={(params) => (
                <TextField sx={{ color: "white" }} {...params} label="Songs" />
              )}
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={songSelected ? allDatesOfSong : []}
              onChange={(event, newValue) => {
                setDateSelected(newValue!); // Update state with the selected value
              }}
              sx={{ width: 300, backgroundColor: "white" }}
              renderInput={(params) => (
                <TextField sx={{ color: "white" }} {...params} label="Dates" />
              )}
            />
            <TextField
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              label="Description"
            ></TextField>
            {/* TODO: close modal after submit */}
            <Button type="submit">Submit</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
