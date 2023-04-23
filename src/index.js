const express = require("express");
const upload = require("../uploader/upload");
const Image = require("./model/image");
require("../src/mongoose/db");

const app = express();
const PORT = 4000 || process.env.PORT;

app.post(
  "/upload-image",
  upload.single("image"),
  async (req, res) => {
    try {
      const buffer = req.file.buffer;
      const image = new Image({
        image: buffer,
      });
      await image.save();
      res.send({ message: "Image is uploaded", id: image._id });
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.get("/get-image/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const image = await Image.findById(id);
    if (!image) {
      throw new Error("Image not found");
    }
    res.set("Content-Type", "Image/jpg");
    res.send(image.image);
  } catch (e) {
    res.status(404).send({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running in the port ${PORT}`);
});
