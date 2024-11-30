import { Box, Button, Modal, styled, Typography } from "@mui/material";
import React, { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { style } from "@/lib/reusableStyles/styles";
import { ModalType } from "@/types/propTypes";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadProfilePicModal = ({ isOpen, onClose }: ModalType) => {
  const [imageUpload, setImageUpload] = useState<Blob>();
  const [imagePreview, setImagePreview] = useState<string>();
  const session = useSession();
  const userId = session.data?.user.userId;

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setImageUpload(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Play round with this more. Do I need to be doing this new instantiation of FormData()?
    const formData = new FormData();
    formData.append("profilePicture", imageUpload!);
    try {
      await fetch(`http://localhost:8000/uploadProfilePic/${userId}`, {
        method: "PUT",
        body: formData,
      });
    } catch (error) {
      console.log(error, "error");
    } finally {
      onClose();
    }
  };

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
            mb={2}
            variant="overline"
          >
            Upload a profile picture below
          </Typography>
          <form
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <Button
              component={"label"}
              variant="outlined"
              startIcon={<CloudUploadIcon />}
            >
              Upload File
              <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
            </Button>

            {imageUpload ? (
              <Box
                width={300}
                height={240}
                sx={{
                  backgroundImage: `url(${imagePreview})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                }}
              />
            ) : null}
            {imageUpload ? (
              <Button
                sx={{ borderRadius: 2 }}
                color={"primary"}
                variant="contained"
                type="submit"
              >
                Submit
              </Button>
            ) : null}
          </form>
          {/* {error ? <Typography mt={2}>{error}</Typography> : null} */}
        </Box>
      </Modal>
    </div>
  );
};

export default UploadProfilePicModal;
