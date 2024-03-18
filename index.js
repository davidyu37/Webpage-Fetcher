const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");

const fetchPage = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const numLinks = $("a").length;
    const images = $("img").length;
    const lastFetch = new Date().toISOString();

    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const filename = `${hostname}.html`;

    fs.writeFileSync(filename, response.data);
    console.log(`Saved: ${filename}`);
    console.log(
      `site: ${hostname}\nnum_links: ${numLinks}\nimages: ${images}\nlast_fetch: ${lastFetch}`
    );
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
  }
};

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node . <URL1> <URL2> ...");
  process.exit(1);
}

args.forEach(fetchPage);
