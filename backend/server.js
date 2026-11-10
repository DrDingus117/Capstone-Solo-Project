const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const JSON_FILE_PATH = path.join(__dirname, 'content.json');

app.use(cors());
app.use(express.json());

// Helper function to read the whole JSON file
const readFullData = () => {
  try {
    const fileData = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading file:", error);
    return { disclaimer: "", topics: [], resources: [] };
  }
};

// Helper function to write everything back
const writeFullData = (data) => {
  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// GET: Fetch just the topics array for your main list
app.get('/api/topics', (req, res) => {
  const fullData = readFullData();
  res.json(fullData.topics || []);
});

// GET: Fetch the disclaimer text if you want to display it
app.get('/api/disclaimer', (req, res) => {
  const fullData = readFullData();
  res.json({ disclaimer: fullData.disclaimer });
});

// POST: Add a new topic into the topics array
app.post('/api/topics', (req, res) => {
  const fullData = readFullData();
  if (!fullData.topics) fullData.topics = [];

  const newTopic = {
    id: req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : `topic-${Date.now()}`,
    title: req.body.title || "Untitled Topic",
    category: req.body.category || "General",
    summary: req.body.summary || "",
    body: req.body.body || [],
    sources: req.body.sources || []
  };

  fullData.topics.push(newTopic);
  writeFullData(fullData);

  res.status(201).json(newTopic);
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
