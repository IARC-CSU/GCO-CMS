require('dotenv').config();
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// /auth route for Decap CMS
app.post('/auth', async (req, res) => {
  const { code } = req.body; // GitHub sends authorization code

  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    // Exchange code for GitHub access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) return res.status(400).json({ error: 'No access token received' });

    // Optionally, create a JWT for CMS to use instead
    const cmsToken = jwt.sign({ github_token: access_token }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token: cmsToken }); // CMS will store this and use for commits
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

app.listen(3000, () => console.log('OAuth proxy running on port 3000'));
