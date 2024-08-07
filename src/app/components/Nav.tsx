"use client";
import {
  Box,
  Avatar,
  Button,
  AppBar,
  Link,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Popover,
  IconButton,
  MenuItem,
  Divider,
  ListItemIcon,
  Menu,
} from "@mui/material";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import { songs } from "@/app/constants/songs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SubmitPostModal from "./SubmitPostModal";
import phishLogo from "../../../public/images/phishlogo.webp";
import Image from "next/image";

const Nav = () => {
  const session = useSession();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const date = new Date(String(session.data?.user.createdAt));
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  // const [openSongSearch, setOpenSongSearch] = useState(false);
  // const toggleSongsList = () => {
  //   setOpenSongSearch(!openSongSearch);
  // };

  const [songAnchorEl, setSongAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleSongClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSongAnchorEl(event.currentTarget);
  };
  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleSongClose = () => {
    setSongAnchorEl(null);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const openSongSearchMenu = Boolean(songAnchorEl);
  const openProfileMenu = Boolean(profileAnchorEl);

  return (
    <AppBar
      className={"animate__animated animate__fadeIn"}
      position="static"
      sx={{ backgroundColor: "white", boxShadow: "none" }}
    >
      <SubmitPostModal isOpen={isModalOpen} onClose={closeModal} />

      <Box
        component="ul"
        display="flex"
        justifyContent={"space-evenly"}
        p={0}
        overflow="hidden"
        sx={{ listStyleType: "none" }}
      >
        <Box display="flex" borderRadius={"35px"} px={2}>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src={phishLogo}
              height={100}
              width={100}
              alt="phishLogo"
              // style={{
              //   backgroundColor: "#fff",
              // }}
            />
          </Link>
        </Box>
        <Stack flexDirection={"row"} alignItems={"center"} gap={4}>
          <Button sx={{ textTransform: "none" }} onClick={handleSongClick}>
            <Typography color={"primary.main"} letterSpacing={"0.10rem"}>
              Search
            </Typography>
          </Button>
          <Popover
            open={openSongSearchMenu}
            anchorEl={songAnchorEl}
            onClose={handleSongClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={songs}
              sx={{ width: 300, height: 300, backgroundColor: "white" }}
              renderInput={(params) => (
                <TextField sx={{ color: "white" }} {...params} label="Songs" />
              )}
            />
          </Popover>
          {/* <Button sx={{ textTransform: "none" }}>
            <Typography color={"primary.main"} letterSpacing={"0.10rem"}>
              Search
            </Typography>
          </Button>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={songs}
            sx={{ width: 300, backgroundColor: "white" }}
            renderInput={(params) => (
              <TextField sx={{ color: "white" }} {...params} label="Songs" />
            )}
          /> */}
          <Button onClick={openModal} sx={{ textTransform: "none" }}>
            <Typography color={"primary.main"} letterSpacing={"0.10rem"}>
              Submit Song
            </Typography>
          </Button>
          <Button sx={{ textTransform: "none" }}>
            <Typography color={"primary.main"} letterSpacing={"0.10rem"}>
              Random Song
            </Typography>
          </Button>
        </Stack>
        <Stack justifyContent={"center"}>
          {session.status === "authenticated" && (
            // <Box
            //   p={1}
            //   borderLeft="solid 1px #bbb"
            //   sx={{
            //     backgroundColor: "grey",
            //   }}
            // >
            <>
              <IconButton
                onClick={handleProfileClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={openProfileMenu ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openProfileMenu ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {/* set loading state for this later */}
                  {session.data?.user.username ? session.data?.user.username[0] : ""}
                </Avatar>
              </IconButton>
              {/* <Avatar sx={{ bgcolor: "black" }}>CS</Avatar> */}
              {/* </Box> */}
              <Menu
                anchorEl={profileAnchorEl}
                id="account-menu"
                open={openProfileMenu}
                onClose={handleProfileClose}
                onClick={handleProfileClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleProfileClose}>
                  <Avatar /> Profile
                </MenuItem>
                <MenuItem onClick={handleProfileClose}>
                  <Avatar /> My account
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>{/* <PersonAdd fontSize="small" /> */}</ListItemIcon>
                  Add another account
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>{/* <Settings fontSize="small" /> */}</ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={() => signOut()}>
                  <ListItemIcon>{/* <Logout fontSize="small" /> */}</ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
          {session.status === "unauthenticated" && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => router.push("/register")}
              sx={{
                borderRadius: "35px",
                border: "1px solid lightgrey",
                textTransform: "none",
                color: "#F1F1F1",
                margin: 2,
                "&hover": {
                  backgroundColor: "#F1F1F1",
                },
              }}
            >
              <Typography color="#6273b3">Get Started</Typography>
            </Button>
          )}
        </Stack>
      </Box>
    </AppBar>
    // <Box
    //   display={"flex"}
    //   flexDirection="column"
    //   width={"100vw"}
    //   height={"100vh"}
    //   justifyContent={"center"}
    // >
    //   <SubmitPostModal isOpen={isModalOpen} onClose={closeModal} />
    //   <Box
    //     position={"absolute"}
    //     zIndex={999}
    //     borderRadius={"25px"}
    //     sx={{ backgroundColor: "primary.main" }}
    //     width={"250px"}
    //     height={"80%"}
    //     ml={1}
    //   >
    //     <List sx={{ width: "100%", color: "#fff" }}>
    //       <ListItem>
    //         <ListItemAvatar>
    //           <Avatar>{/* <ImageIcon /> */}</Avatar>
    //         </ListItemAvatar>
    //         <ListItemText
    //           primary={
    //             session.status == "authenticated"
    //               ? `${session.data.user.username}`
    //               : "Anonymous"
    //           }
    //           secondary={
    //             session.status == "authenticated"
    //               ? `Joined ${formattedDate}`
    //               : "Date joined?"
    //           }
    //           sx={{
    //             // kinda gross should fix this
    //             ".css-83ijpv-MuiTypography-root": {
    //               color: "#7c7c7c",
    //             },
    //           }}
    //         />
    //       </ListItem>
    //       <Divider variant="middle" sx={{ borderColor: "#fff" }} />
    //       <ListItem>
    //         <ListItemButton>
    //           {session.status == "unauthenticated" ? (
    //             <ListItemText primary="Sign In" onClick={() => router.push("/login")} />
    //           ) : (
    //             <ListItemText
    //               primary="Sign Out"
    //               onClick={() => signOut({ callbackUrl: "/login" })}
    //             />
    //           )}
    //         </ListItemButton>
    //       </ListItem>
    //       <ListItem>
    //         {/* this will only direct user to dynamic route to show submitions of the song seleted */}
    //         <ListItemButton>
    //           <ListItemText onClick={() => toggleSongsList()} primary="Songs" />
    //         </ListItemButton>
    //       </ListItem>
    //       <ListItem>
    //         <ListItemButton>
    //           <ListItemText primary="Search Shows" />
    //         </ListItemButton>
    //       </ListItem>
    //       <ListItem>
    //         <ListItemButton>
    //           <ListItemText primary="Submit a song" onClick={openModal} />
    //         </ListItemButton>
    //       </ListItem>
    //       <ListItem>
    //         <ListItemButton>
    //           <ListItemText primary="Random Song" />
    //         </ListItemButton>
    //       </ListItem>
    //     </List>
    //   </Box>

    //   <Box
    //     borderRadius={"25px"}
    //     sx={{
    //       backgroundColor: "#1c1c1c",
    //       transition: "all 0.5s ease",
    //       marginLeft: openSongSearch ? "250px" : 1,
    //     }}
    //     width={"250px"}
    //     height={"80%"}
    //   >
    //     <List sx={{ width: "100%", color: "#fff" }}>
    //       <ListItem>Phish Icon</ListItem>
    //       <Divider variant="middle" sx={{ borderColor: "#fff" }} />
    //       <ListItem color="#fff">
    //         <Autocomplete
    //           disablePortal
    //           id="combo-box-demo"
    //           options={songs}
    //           sx={{ width: 300, backgroundColor: "white" }}
    //           renderInput={(params) => (
    //             <TextField sx={{ color: "white" }} {...params} label="Songs" />
    //           )}
    //         />
    //       </ListItem>
    //     </List>
    //   </Box>
    // </Box>
  );
};

export default Nav;
