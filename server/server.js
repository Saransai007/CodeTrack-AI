import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";
import fetch from "node-fetch";
import https from "https";
import puppeteer from "puppeteer";

import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const httpsAgent = new https.Agent({ family: 4 });

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

/**
 * Codeforces scraper - using official API
 */
const scrapeCodeForceUser = async (username) => {
  const url = `https://codeforces.com/api/user.status?handle=${username}`;
  try {
    const { data } = await axios.get(url);

    if (data.status !== "OK") {
      throw new Error("API error or user not found");
    }

    const submissions = data.result;
    const solvedSet = new Set();

    submissions.forEach((submission) => {
      if (submission.verdict === "OK") {
        const problem = submission.problem;
        const uniqueId = `${problem.contestId}-${problem.index}`;
        solvedSet.add(uniqueId);
      }
    });

    return {
      handle: username,
      solvedCount: solvedSet.size,
    };
  } catch (err) {
    console.error(
      `Error fetching Codeforces data for ${username}:`,
      err.message
    );
    return { error: "Failed to fetch Codeforces data" };
  }
};

/**
 * LeetCode route - fetch contests data from third party API
 */
app.get("/api/leetcode/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const response = await fetch(
      `https://leetcode-api-pied.vercel.app/user/${username}/contests`
    );

    if (!response.ok) {
      console.error(`LeetCode API error for ${username}`);
      return res.status(500).json({ error: "Failed to fetch LeetCode data" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(`Error fetching LeetCode data for ${username}:`, err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Puppeteer CodeChef scraper - scraping profile data from CodeChef site
 */
async function scrapeCodechefUser(username) {
  const url = `https://www.codechef.com/users/${username}`;
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      if (["image", "stylesheet", "font"].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    page.setDefaultNavigationTimeout(30_000);
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/114.0.0.0 Safari/537.36"
    );
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    await page.waitForSelector("header .user-details-header h2", {
      timeout: 30_000,
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    return {
      name: $("header .user-details-header h2").text().trim(),
      rating: $("div.rating-number").text().trim(),
      stars: $("span.rating-star").text().trim(),
      country: $("span.user-country-name").text().trim(),
      problemsSolved: $("section.rating-data-section.problems-solved")
        .text()
        .trim(),
    };
  } catch (err) {
    console.error(`Error scraping CodeChef for ${username}:`, err);
    return { error: "Unable to fetch CodeChef profile." };
  } finally {
    await browser.close();
  }
}

/**
 * CodeChef scraper route using Puppeteer
 */
app.get("/codechef/:username", async (req, res) => {
  const { username } = req.params;
  const profileData = await scrapeCodechefUser(username);
  res.json(profileData);
});

/**
 * CodeChef scraper route using Python subprocess
 * Python script must print valid JSON string
 */
app.get("/codechef-python/:username", (req, res) => {
  const { username } = req.params;
  const scriptPath = path.join(__dirname, "codechef_scraper.py"); // adjust path if needed

  const python = spawn("python", [scriptPath, username]);

  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  python.on("close", (code) => {
    if (code !== 0 || errorOutput) {
      console.error("Python script error:", errorOutput);
      return res.status(500).json({ error: "Python script failed" });
    }
    try {
      const json = JSON.parse(output);
      res.json(json);
    } catch (err) {
      console.error("Failed to parse Python output:", output);
      res.status(500).json({ error: "Invalid JSON from Python script" });
    }
  });
});

/**
 * Codeforces route
 */
app.get("/codeforces/:username", async (req, res) => {
  const { username } = req.params;
  const profileData = await scrapeCodeForceUser(username);
  res.json(profileData);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
