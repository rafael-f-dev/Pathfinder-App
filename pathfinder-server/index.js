require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT;
const openAiKey = process.env.OPENAI_API_KEY;
const geoapifyKey = process.env.GEOAPIFY_API_KEY;

app.use(cors());
app.use(express.json());

/////////////////////////////////////////////////////////////////////////

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.log('Error calling API:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/search-city', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  try {
    const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
      params: {
        text: query,
        apiKey: geoapifyKey,
        limit: 5,
      },
    });
  
    const validCities = response.data.features.filter(feature =>
      feature.properties.city
    );

    res.json({ results: validCities });
  } catch (error) {
    console.error('Error fetching city data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


/////////////////////////////////////////////////////////////////////////

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
  });