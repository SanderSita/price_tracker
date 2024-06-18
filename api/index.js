import express from 'express';
import cors from 'cors';

import { openURLmakeScreenshot } from './ocr.js';
import { sendTestEmail } from './mail.js';

const app = express();

app.use(cors());

app.get('/ocr', async (req, res) => {
  const url = req.query.url;
  try {
    const ocrData = await openURLmakeScreenshot(url);
    res.send(ocrData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/email', async (req, res) => {
  const email = req.query.email;
  try {
    await sendTestEmail(email);
    res.send({message: "email sent"});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3003, () => {
  console.log('Express server initialized');
});
