import express from "express";
import fetch from "node-fetch";
import pg from "pg";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";

import { GoogleGenerativeAI } from "@google/generative-ai";
const PROGRAMMING_INSTRUCTION = `You are a highly specialized AI assistant focused exclusively on programming, software development, algorithms, data structures, coding languages, debugging, and related technical topics.
- Provide clear, concise, and accurate programming advice, code examples, and explanations.
- If a query is NOT programming-related, politely decline to answer and state that you can only assist with programming topics.
- Do not engage in casual conversation, personal opinions, or non-technical discussions.
- Your responses should be professional and informative.
`;
const clistApiKey = process.env.CLIST_API_KEY;
const CODE_ANALYSIS_INSTRUCTION = `You are an expert Code Analyzer and Debugging Assistant. Your primary goal is to analyze provided code, estimate its time and space complexity, offer optimization hints, and assist in debugging errors.

Here's the information you will receive:
- **Language:** The programming language of the code.
- **Code:** The user's code.
- **JDoodle Output:** The standard output from running the code (if any).
- **Compilation Error:** Any compilation errors (if any).
- **Runtime Error:** Any runtime errors (if any).

Your response MUST be structured using Markdown.

**Analysis Steps:**
1.  **Initial Assessment (Always provide this):**
    * **Time Complexity:** Analyze the provided \`Code\` and describe its time complexity using Big O notation (e.g., O(N), O(N log N), O(N^2)). Briefly explain *why* it has this complexity.
    * **Space Complexity:** Analyze the provided \`Code\` and describe its space complexity using Big O notation (e.g., O(1), O(N), O(N^2)). Briefly explain *why* it has this complexity.
2.  **Code Improvement Hints (If applicable):**
    * If the code can be optimized for better time or space complexity, provide specific, actionable hints.
    * Suggest alternative algorithms or data structures.
    * Provide *brief* code snippets if they significantly clarify a hint. Do NOT rewrite the entire code unless it's a very simple example for demonstration.
3.  **Error Analysis (ONLY if Compilation Error or Runtime Error is present):**
    * If \`Compilation Error\` is provided: Explain what the error means, its likely cause, and how to fix it. Suggest specific line numbers if the error message provides them.
    * If \`Runtime Error\` is provided: Explain the nature of the runtime error, its common causes, and steps to debug it. Refer to the \`JDoodle Output\` if it contains a stack trace or error message.
    * If no errors are present and the code ran successfully, explicitly state "No compilation or runtime errors detected."

**Important Rules:**
- Be concise but informative.
- Use code blocks (\`\`\`language\`) for any code snippets you provide.
- If the query is not clearly a code-related task (e.g., "What is the weather?"), politely decline and state you are only for code analysis.
- If the provided code is incomplete or malformed to the point of being unanalyzable, state that it's unparsable and request valid code.
`;
const app = express();
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const port = 8000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "CodeTrack",
  password: "123",
  port: 5432,
});
await db.connect();
const JDOODLE_CLIENT_ID = process.env.JDOODLE_CLIENT_ID;
const JDOODLE_CLIENT_SECRET =
 process.env.JDOODLE_CLIENT_SECRET;

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY environment variable is not set.");
  console.error("Please set it before running the server.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const hostToDescription = (host) => {
  if (host.includes("codeforces")) return "Official Codeforces contest.";
  if (host.includes("leetcode"))
    return "A LeetCode contest to test your coding skills.";
  if (host.includes("ctftime"))
    return "Capture The Flag (CTF) cybersecurity challenge.";
  if (host.includes("midnightcodecup"))
    return "Finals of Midnight Code Cup hosted on midnightcodecup.org.";
  return `Contest hosted on ${host}`;
};
const formatTime = (date) => date.toISOString().split("T")[1].split(".")[0];

async function fetchAndStoreContests() {
  try {
    const clistRes = await axios.get(
      "https://clist.by/api/v4/contest/?upcoming=true",
      {
        headers: { Authorization: `ApiKey ${clistApiKey}` },
      }
    );

    const contests = clistRes.data.objects;

    for (const c of contests) {
      const start = new Date(c.start);
      const end = new Date(c.end);

      const contestData = {
        title: c.event,
        date: start.toISOString().split("T")[0],
        starttime: formatTime(start),
        endtime: formatTime(end),
        description: hostToDescription(c.host || c.resource),
      };

      // Insert if not already in DB
      await db.query(
        `INSERT INTO contests (title, date, starttime, endtime, description)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [
          contestData.title,
          contestData.date,
          contestData.starttime,
          contestData.endtime,
          contestData.description,
        ]
      );
    }

    console.log("✅ Contests stored successfully.");
  } catch (err) {
    console.error("❌ Error storing contests:", err.message);
  }
}

fetchAndStoreContests();
const createUsersTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    await db.query(`CREATE TABLE IF NOT EXISTS codingprofiles (
    profileid SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    leetcode VARCHAR(100),
    codechef VARCHAR(100),
    codeforces VARCHAR(100),
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
)`);
    await db.query(`CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  description VARCHAR(100000)
);`);
    await db.query(`CREATE TABLE IF NOT EXISTS contests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  starttime TIME NOT NULL,
  endtime TIME NOT NULL,
  description TEXT NOT NULL
);

`);
    await db.query(`CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  urgent INT DEFAULT 0,
  status TEXT NOT NULL,
  position INTEGER DEFAULT 0
);
`);
    await db.query(
      `CREATE TABLE IF NOT EXISTS probsolv(id SERIAL PRIMARY KEY,leetcode INT,codechef INT,codeforces INT,user_id INT REFERENCES users(id) ON DELETE CASCADE)`
    );
    await db.query(
      `CREATE TABLE IF NOT EXISTS leetcoderatng (
  contest_index SERIAL,
  rating FLOAT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, contest_index)
)`
    );
    await db.query(
      `CREATE TABLE IF NOT EXISTS codeforcesratng (
  contest_index SERIAL,
  rating INT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, contest_index)
)`
    );
    await db.query(
      `CREATE TABLE IF NOT EXISTS codechefratng (
    contest_index SERIAL,
  rating INT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, contest_index)
);`
    );

    console.log("✅ Users table created or already exists.");
  } catch (error) {
    console.error("❌ Error creating users table:", error.message);
  }
};

await createUsersTable();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authenticateUsers = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const result = await db.query(
      `SELECT id, email, username FROM users WHERE id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

app.post("/api/chat", async (req, res) => {
  console.log("Received request body:", req.body);
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const fullPrompt = `${PROGRAMMING_INSTRUCTION}\n\nUser query: ${userMessage}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (error.response) {
      console.error("Error response status:", error.response.status);
      try {
        const errorData = await error.response.json();
        console.error("Error response data:", errorData);
      } catch (parseError) {
        console.error(
          "Could not parse error response as JSON:",
          error.response.data
        );
      }
    }

    if (error.message.includes("API key not valid")) {
      res.status(401).json({ error: "Invalid or expired API Key." });
    } else if (error.message.includes("Quota exceeded")) {
      res
        .status(429)
        .json({ error: "Quota exceeded. Please try again later." });
    } else {
      res.status(500).json({
        error: "Failed to communicate with the AI. Please try again.",
      });
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await db.query(
      `SELECT * FROM users WHERE email = $1 AND password = $2`,
      [email, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: "2h" }
      );

      console.log("✅ Login successful");
      res.status(200).json({ message: "Login successful", token });
    } else {
      console.log("❌ Invalid credentials");
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("❌ DB query error:", err.message);
    res
      .status(500)
      .json({ message: "Database query failed", error: err.message });
  }
});

app.post("/api/signup", async (req, res) => {
  const { email, password, username, confirmPassword } = req.body;

  if (!email || !username || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    console.log("Inserting:", email, username, password);
    await db.query(
      `INSERT INTO users(email, username, password) VALUES ($1, $2, $3)`,
      [email, username, password]
    );
    console.log("✅ Insert successful");
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ DB insert error:", err.message);
    res
      .status(500)
      .json({ message: "Database insert failed", error: err.message });
  }
});

app.post("/api/coding", authenticateUsers, async (req, res) => {
  try {
    console.log(req.body);

    await db.query(
      `Insert INTO codingprofiles(userid,leetcode,codechef,codeforces) VALUES($1,$2,$3,$4) `,
      [req.user.id, req.body.leetcode, req.body.codechef, req.body.codeforces]
    );
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
app.get("/api/profiledetails", authenticateUsers, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM codingprofiles WHERE userid = $1",
      [req.user.id]
    );
    console.log(result.rows);
    console.log(req.user);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No profile found for this user." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/profile", authenticateUsers, async (req, res) => {
  res.status(200).json(req.user);
});

app.get("/api/daily-questions", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const seed = Array.from(today).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );

    function seededRandom(seed) {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    function shuffle(array, seed) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    const leetcodeData = JSON.parse(fs.readFileSync("questions.json", "utf-8"));
    const shuffledLeet = shuffle(leetcodeData, seed).slice(0, 3);
    const response = await fetch(
      "https://codeforces.com/api/problemset.problems"
    );
    if (!response.ok) throw new Error("Failed to fetch Codeforces problems");
    const cfData = await response.json();

    if (cfData.status !== "OK")
      throw new Error("Codeforces API returned non-OK");

    const problems = cfData.result.problems.filter(
      (p) => p.rating && p.name && p.contestId
    );
    const shuffledCF = shuffle(problems, seed + 1000).slice(0, 3);
    const formattedCF = shuffledCF.map((p) => ({
      name: p.name,
      difficulty:
        p.rating > 0 && p.rating <= 1200
          ? "Easy"
          : p.rating > 1200 && p.rating <= 2000
          ? "Medium"
          : "Hard",
      tags: p.tags,
      link: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
      platform: "CodeForces",
    }));

    const result = [
      ...shuffledLeet.map((q) => ({
        name: q.name,
        tags: q.topic,
        difficulty: q.difficulty,
        link: `https://leetcode.com/problems/${q.link_id}`,
        platform: "LeetCode",
      })),
      ...formattedCF,
    ];

    console.log("📅 Daily Questions:", result);
    res.status(200).json({ date: today, questions: result });
  } catch (err) {
    console.error("❌ Error fetching daily questions:", err.message);
    res.status(500).json({ error: "Failed to generate daily questions" });
  }
});

app.get("/events", authenticateUsers, async (req, res) => {
  try {
    const userEventsRes = await db.query(
      "SELECT * FROM calendar_events WHERE userid = $1",
      [req.user.id]
    );

    const contestEventsRes = await db.query("SELECT * FROM contests");

    const combined = [...userEventsRes.rows, ...contestEventsRes.rows];

    res.status(200).json(combined);
  } catch (err) {
    console.error("Error fetching events:", err.message);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

app.post("/events", authenticateUsers, async (req, res) => {
  const { title, date, startTime, endTime, description } = req.body;
  console.log(req.body);

  if (!title || !date || !startTime || !endTime) {
    return res.status(400).json({ message: "Missing event fields" });
  }

  try {
    const result = await db.query(
      `INSERT INTO calendar_events (userid, title, date, startTime, endTime,description)
       VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`,
      [req.user.id, title, date, startTime, endTime, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting event:", err.message);
    res.status(500).json({ message: "Failed to create event" });
  }
});

app.get("/api/tasks", authenticateUsers, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY status, position",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/tasks", authenticateUsers, async (req, res) => {
  const userId = req.user.id;
  const { title, description, urgent, status } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT COUNT(*) AS cnt
     FROM tasks 
    WHERE user_id = $1
      AND status  = $2`,
      [req.user.id, status]
    );
    const nextPosition = parseInt(rows[0].cnt, 10);

    const result = await db.query(
      `INSERT INTO tasks
     (user_id, title, description, urgent, status, position)
   VALUES
     ($1,      $2,    $3,          $4,     $5,     $6)
   RETURNING *`,
      [userId, title, description, urgent, status, nextPosition]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/execute-code", async (req, res) => {
  const { script, stdin, language, versionIndex } = req.body;

  if (!script || !language || versionIndex === undefined) {
    return res.status(400).json({
      error: "Missing script, language, or version index in request.",
    });
  }

  const jdoodlePayload = {
    script,
    stdin,
    language,
    versionIndex,
    clientId: JDOODLE_CLIENT_ID,
    clientSecret: JDOODLE_CLIENT_SECRET,
  };

  let jdoodleResponseData;
  try {
    const jdoodleRes = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      jdoodlePayload
    );
    jdoodleResponseData = jdoodleRes.data;
    console.log("JDoodle Raw Response:", jdoodleResponseData);
  } catch (error) {
    console.error(
      "Error calling JDoodle API from backend:",
      error.response?.data || error.message
    );
    return res.status(error.response?.status || 500).json({
      error: "Failed to execute code via JDoodle.",
      details:
        error.response?.data ||
        error.message ||
        "An unknown error occurred with JDoodle.",
    });
  }

  let geminiAnalysisPrompt = `
Language: ${language}
Code:
\`\`\`${language === "cpp17" ? "cpp" : language}
${script}
\`\`\`
`;

  if (jdoodleResponseData.output) {
    geminiAnalysisPrompt += `JDoodle Output:\n\`\`\`
${jdoodleResponseData.output}
\`\`\`
`;
  }
  if (jdoodleResponseData.compilationError) {
    geminiAnalysisPrompt += `Compilation Error:\n\`\`\`
${jdoodleResponseData.compilationError}
\`\`\`
`;
  }
  if (jdoodleResponseData.error) {
    geminiAnalysisPrompt += `Runtime Error:\n\`\`\`
${jdoodleResponseData.error}
\`\`\`
`;
  }

  const fullGeminiPrompt = `${CODE_ANALYSIS_INSTRUCTION}\n\n${geminiAnalysisPrompt}`;

  try {
    const result = await model.generateContent(fullGeminiPrompt);
    const geminiResponse = await result.response;
    const analysisText = geminiResponse.text();

    res.json({ analysis: analysisText, jdoodle: jdoodleResponseData });
  } catch (error) {
    console.error(
      "Error calling Gemini API for code analysis:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to get AI analysis.",
      details:
        error.response?.data ||
        error.message ||
        "An unknown error occurred with Gemini.",
    });
  }
});

app.put("/api/tasks/desc", authenticateUsers, async (req, res) => {
  const userId = req.user.id;
  const { id, desc } = req.body;
  try {
    const result = await db.query(
      "UPDATE tasks SET description = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [desc, id, userId]
    );
    console.log(result.rows[0]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Task not found or not authorized" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("error updating", err);
    res.status(500).json({ error: "Error" });
  }
});

app.put("/api/tasks/:id", authenticateUsers, async (req, res) => {
  const userId = req.user.id;
  const { status, position } = req.body;
  const id = req.params.id;
  try {
    const result = await db.query(
      `UPDATE tasks SET status=$1,position=$2 where id=$3 and user_id=$4`,
      [status, position, id, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("error updating", err);
    res.status(500).json({ error: "Error" });
  }
});

app.get("/api/leetcode", authenticateUsers, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT * FROM codingprofiles WHERE userid = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const { leetcode, codeforces, codechef } = result.rows[0];

    const [lcRes, cfRes, ccRes] = await Promise.allSettled([
      axios.get(`https://leetcode-api-pied.vercel.app/user/${leetcode}`),
      axios.get(`http://localhost:5000/codeforces/${codeforces}`),
      axios.get(`http://localhost:5000/codechef-python/${codechef}`),
    ]);

    const allFulfilled = [lcRes, cfRes, ccRes].every(
      (res) => res.status === "fulfilled"
    );

    if (allFulfilled) {
      const countleetcode =
        lcRes.value.data.submitStats.acSubmissionNum[0].count;
      const countcodeforces = cfRes.value.data.solvedCount;
      const codechefsolved = ccRes.value.data.total_problems_solved;

      const existing = await db.query(
        `SELECT * FROM probsolv WHERE user_id = $1`,
        [userId]
      );

      if (existing.rows.length === 0) {
        await db.query(
          `INSERT INTO probsolv (leetcode, codechef, codeforces, user_id) VALUES ($1, $2, $3, $4)`,
          [countleetcode, codechefsolved, countcodeforces, userId]
        );
      } else {
        await db.query(
          `UPDATE probsolv SET leetcode = $1, codechef = $2, codeforces = $3 WHERE user_id = $4`,
          [countleetcode, codechefsolved, countcodeforces, userId]
        );
      }

      res.json({
        leetcode: countleetcode,
        codeforces: countcodeforces,
        codechef: codechefsolved,
      });
    } else {
      const fallback = await db.query(
        `SELECT leetcode, codechef, codeforces FROM probsolv WHERE user_id = $1`,
        [userId]
      );

      if (fallback.rows.length === 0) {
        return res
          .status(500)
          .json({ error: "Unable to fetch data and no fallback found" });
      }

      res.json(fallback.rows[0]);
    }
  } catch (err) {
    console.error("Error fetching or updating data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/contestlu", authenticateUsers, async (req, res) => {
  const userId = req.user.id;

  try {
    const profileResult = await db.query(
      `SELECT leetcode, codeforces, codechef FROM codingprofiles WHERE userid = $1`,
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: "Coding profiles not found." });
    }

    const { leetcode, codeforces, codechef } = profileResult.rows[0];

    let leetRatings = [];
    let cfRatings = [];
    let ccRatings = [];

    // ------------------------ LeetCode ------------------------
    try {
      const leetRes = await axios.get(
        `http://localhost:5000/api/leetcode/${leetcode}`
      );
      const history = leetRes.data.userContestRankingHistory || [];
      const result = await db.query(
        `SELECT COUNT(*) FROM leetcoderatng WHERE user_id = $1`,
        [userId]
      );
      const ratingCount = parseInt(result.rows[0].count);
      const newContests = history.filter((h) => h.attended);

      if (newContests.length > ratingCount) {
        for (let i = ratingCount; i < newContests.length; i++) {
          const rating = Math.round(newContests[i].rating);
          await db.query(
            `INSERT INTO leetcoderatng (rating, user_id) VALUES ($1, $2)`,
            [rating, userId]
          );
        }
      }

      const stored = await db.query(
        `SELECT contest_index, rating FROM leetcoderatng WHERE user_id = $1 ORDER BY contest_index`,
        [userId]
      );
      leetRatings = stored.rows;
    } catch (err) {
      console.warn("LeetCode fetch failed");
      const stored = await db.query(
        `SELECT contest_index, rating FROM leetcoderatng WHERE user_id = $1 ORDER BY contest_index`,
        [userId]
      );
      leetRatings = stored.rows;
    }

    // ------------------------ Codeforces ------------------------
    try {
      const cfRes = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${codeforces}`
      );
      const contests = cfRes.data.result || [];
      const result = await db.query(
        `SELECT COUNT(*) FROM codeforcesratng WHERE user_id = $1`,
        [userId]
      );
      const ratingCount = parseInt(result.rows[0].count);

      if (contests.length > ratingCount) {
        for (let i = ratingCount; i < contests.length; i++) {
          const rating = contests[i].newRating;
          await db.query(
            `INSERT INTO codeforcesratng (rating, user_id) VALUES ($1, $2)`,
            [rating, userId]
          );
        }
      }

      const stored = await db.query(
        `SELECT contest_index, rating FROM codeforcesratng WHERE user_id = $1 ORDER BY contest_index`,
        [userId]
      );
      cfRatings = stored.rows;
    } catch (err) {
      console.warn("Codeforces fetch failed");
      const stored = await db.query(
        `SELECT contest_index, rating FROM codeforcesratng WHERE user_id = $1 ORDER BY contest_index`,
        [userId]
      );
      cfRatings = stored.rows;
    }

    // ------------------------ CodeChef ------------------------
    try {
      const ccRes = await axios.get(
        `https://codechef-api.vercel.app/handle/${codechef}`
      );
      const contests = ccRes.data.ratingData || [];
      const result = await db.query(
        `SELECT COUNT(*) FROM codechefratng WHERE user_id = $1`,
        [userId]
      );
      const ratingCount = parseInt(result.rows[0].count);

      if (contests.length > ratingCount) {
        for (let i = ratingCount; i < contests.length; i++) {
          const rating = parseInt(contests[i].rating);
          await db.query(
            `INSERT INTO codechefratng (rating, user_id) VALUES ($1, $2)`,
            [rating, userId]
          );
        }
      }

      const stored = await db.query(
        `SELECT contest_index, rating FROM codechefratng WHERE user_id = $1 ORDER BY contest_index`,
        [userId]
      );
      ccRatings = stored.rows;
    } catch (err) {
      console.warn("CodeChef fetch failed");
      const stored = await db.query(
        `SELECT contest_index, rating FROM codechefratng WHERE user_id = $1 ORDER BY contest_index`,
        [userId]
      );
      ccRatings = stored.rows;
    }

    // ------------------------ Final Response ------------------------
    return res.json({
      leetcodeRatings: leetRatings,
      codeforcesRatings: cfRatings,
      codechefRatings: ccRatings,
    });
  } catch (err) {
    console.error("Error in /api/contestlu:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
