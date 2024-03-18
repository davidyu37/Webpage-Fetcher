const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");
const urlModule = require("url");

const downloadFile = async (url, path) => {
  const writer = fs.createWriteStream(path);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const fetchAndMirror = async (url, basePath = "./mirror") => {
  console.log("!!", url);
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const baseHostname = new URL(url).hostname;

    // Collect all promises here
    const imageDownloadPromises = [];

    $("img").each((index, element) => {
      const src = $(element).attr("src");
      // If we can't get the image
      if (typeof src !== "string") {
        console.error(`Invalid src attribute found for an image: ${src}`);
        return; // Skip this iteration
      }
      const imageUrl = urlModule.resolve(url, src);
      const imageName = path.basename(src);
      if (!imageName) {
        console.error(
          `Could not determine a valid name for the image from src: ${src}`
        );
        return; // Skip this iteration
      }
      const imageFolderPath = path.join(basePath, baseHostname, "images");
      const imagePath = path.join(imageFolderPath, imageName);

      // Push promise to array
      const imageDownloadPromise = fs
        .ensureDir(imageFolderPath)
        .then(() => downloadFile(imageUrl, imagePath))
        .then(() => {
          const relativeImagePath = `images/${imageName}`;
          $(element).attr("src", relativeImagePath);
        });

      imageDownloadPromises.push(imageDownloadPromise);
    });

    // Wait for all image processing to complete
    await Promise.all(imageDownloadPromises);

    const modifiedHtml = $.html();
    const htmlPath = path.join(basePath, baseHostname, `${baseHostname}.html`);
    await fs.outputFile(htmlPath, modifiedHtml);
    console.log(`Page and assets mirrored at ${basePath}`);
  } catch (error) {
    console.error(`Error fetching or mirroring ${url}: ${error.message}`);
  }
};

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node mirror-copy.js <URL1> <URL2> ...");
  process.exit(1);
}

args.forEach((url) => {
  fetchAndMirror(url, "./mirror");
});
