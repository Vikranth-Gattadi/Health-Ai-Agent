// Simple Express backend for Gemini and Serper API integration
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Gemini API endpoint (v1.5 flash)
app.post('/api/gemini', async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [{ parts: [{ text: query }] }],
      },
      {
        params: { key: process.env.GEMINI_API_KEY },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serper API endpoint
app.post('/api/serper', async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.post(
      'https://google.serper.dev/search',
      { q: query },
      {
        headers: { 'X-API-KEY': process.env.SERPER_API_KEY },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://curious-starlight-65db28.netlify.app', // no trailing slash
    'https://curious-starlight-65db28.netlify.app/' // with trailing slash for safety
  ],
  credentials: true
}));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
