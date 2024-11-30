import React, { FormEvent, useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getAllPreformancesOfSongs } from "@/services/phishin";
import { songs } from "@/constants/songs";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { SongContext } from "@/context/SongContext";
import { style } from "@/lib/reusableStyles/styles";
import { ModalType } from "@/types/propTypes";
import CircularProgress from "@mui/material/CircularProgress";

interface DateSelectedType {
  date: string;
  venueName: string;
  venueLocation: string;
}

interface SongConstants {
  song: string;
  slug: string;
}

export default function SubmitPostModal({ isOpen, onClose }: ModalType) {
  const { paramValue, route, fetchSongSubmissions } = useContext(SongContext);
  const [songSelected, setSongSelected] = useState<SongConstants>();
  const [dateSelected, setDateSelected] = useState("");
  const [myVenueInfo, setMyVenueInfo] = useState<DateSelectedType | undefined>({
    date: "",
    venueName: "",
    venueLocation: "",
  });
  const [description, setDescription] = useState("");
  const [allDatesOfSong, setAllDatesOfSong] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const session = useSession();
  const userId = session.data?.user.userId;

  const username = session.data?.user.username;

  //TODO: I'm using this kinda of function frequently thought out the app, probably make a global func I can use instead of this wet code
  // hahah this is so gross I feel like, but I do like that we just have a single function to do all the work  now

  // The purpose of this weird function is to get the page to update when and display correct data after submitting a post in this modal
  const fetchSubmissions = async () => {
    if (route == "song") {
      fetchSongSubmissions("slug", paramValue);
    } else if (route == "user") {
      fetchSongSubmissions("userWhoPosted.username", paramValue);
    } else {
      fetchSongSubmissions("limit", "10");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (session.status == "unauthenticated") {
        throw new Error("Please login to submit a post");
      }
      const res = await fetch("http://localhost:8000/songSubmittion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songName: songSelected?.song,
          description,
          date: dateSelected,
          userWhoPosted: {
            username,
            userId,
          },
          venueLocation: myVenueInfo?.venueLocation,
          venueName: myVenueInfo?.venueName,
          slug: songSelected?.slug,
        }),
      });
      if (!description) {
        throw new Error("Please provide a description");
      }
      if (res.status === 400) {
        res.json().then((data) => {
          setError(data.message);
        });
      } else {
        fetchSubmissions();
        //TODO: some kind of success message?
        onClose();
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (songSelected) {
      setLoading(true);
      setAllDatesOfSong([]);
      const fetchData = async () => {
        try {
          const myData = await getAllPreformancesOfSongs(songSelected!.slug);
          // remove duplicates with new Set()
          const dates = [...new Set(myData.map((el) => el.date))];
          setAllDatesOfSong(dates);
          setLoading(false);
          if (dateSelected !== "") {
            const myDateData = myData.find((obj) => obj.date === dateSelected);
            setMyVenueInfo(myDateData);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [songSelected, dateSelected]);

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
            mb={2}
          >
            Submit a song
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={songs}
              getOptionLabel={(option) => option.song}
              onChange={(event, newValue) => {
                setSongSelected(newValue!);
              }}
              sx={{ backgroundColor: "white" }}
              renderInput={(params) => (
                <TextField sx={{ color: "white" }} {...params} label="Songs" />
              )}
            />

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              loading={loading}
              loadingText={<CircularProgress size={20} />}
              options={songSelected ? allDatesOfSong : []}
              onChange={(event, newValue) => {
                setDateSelected(newValue!);
              }}
              sx={{ backgroundColor: "white" }}
              renderInput={(params) => (
                <TextField sx={{ color: "white" }} {...params} label="Dates" />
              )}
            />
            <TextField
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              label="Description"
            ></TextField>
            <Button
              sx={{ borderRadius: 2 }}
              color={"primary"}
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          </form>
          {error && (
            <Typography color={"red"} mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
}
