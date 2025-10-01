import express from 'express';
import axios from 'axios';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Chat with Gemini Flash 2.5
router.post('/chat', [
  body('prompt').isString().isLength({ min: 1, max: 500 }),
  body('context').optional().isObject(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt, context = {} } = req.body;

    // Create a focused prompt for Gemini Flash 2.5
    const systemPrompt = `You are a helpful movie recommendation assistant. Keep responses concise (max 2-3 sentences). 
    Current context: ${JSON.stringify(context)}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
          topP: 0.8,
          topK: 40
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    res.json({
      response: generatedText,
      usage: {
        promptTokens: response.data.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.data.usageMetadata?.candidatesTokenCount || 0,
      }
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Get movie recommendations based on mood and context
router.post('/recommendations', [
  body('mood').isString().isLength({ min: 1, max: 100 }),
  body('context').optional().isObject(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mood, context = {} } = req.body;

    const prompt = `Based on the user's mood "${mood}" and context ${JSON.stringify(context)}, 
    recommend 5 movies with brief explanations. Format as JSON with title, year, and reason.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
          topP: 0.9,
          topK: 40
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    // Try to parse as JSON, fallback to plain text
    let recommendations;
    try {
      recommendations = JSON.parse(generatedText);
    } catch {
      recommendations = [{ title: 'Recommendation', reason: generatedText }];
    }

    res.json({
      recommendations,
      mood,
      context
    });
  } catch (error) {
    console.error('Gemini recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

export default router;
