import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // image processing
  app.get("/filteredimage", async (req, res) => {
    const imageURL = req.query.image_url;

    if (!imageURL) {
      return res.status(400).send("Image URL required!");
    }

    const imagePath = await filterImageFromURL(imageURL);

    if (!imagePath) {
      return res.status(422).send("Image isn't found!");
    }

    res.status(200).sendFile(imagePath, () => {
      deleteLocalFiles([imagePath]);
    });

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();