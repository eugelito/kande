const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");

const app = express();

dotenv.config();

app.use(cors());

app.get("/cloudinary/images", async (req, res) => {
  const cloudName = process.env.VITE_CLOUDINARYCLOUDNAME;
  const apiKey = process.env.VITE_CLOUDINARYAPIKEY;
  const apiSecret = process.env.VITE_CLOUDINARYAPISECRET;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
    });
    res.json(response.data.resources);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Error fetching images" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
