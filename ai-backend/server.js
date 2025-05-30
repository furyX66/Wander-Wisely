const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const AIML_API_KEY = '327e036c1bfd43fc89fe785c306b02c5';

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    const payload = {
        model: 'gpt-4',
        messages: [
            {
                role: 'user',
                content: userMessage
            }
        ],
        temperature: 1,
        top_p: 1,
        max_tokens: 512,
        stream: false,
        response_format: {
            type: 'text'
        },
        modalities: ['text']
    };

    try {
        const response = await axios.post(
            'https://api.aimlapi.com/v1/chat/completions',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${AIML_API_KEY}`,
                    'Content-Type': 'application/json',
                    Accept: '*/*'
                }
            }
        );

        const aiMessage = response.data?.choices?.[0]?.message?.content || 'Brak odpowiedzi od AI';
        res.json({ reply: aiMessage });

    } catch (error) {
        console.error('Błąd z AIMLAPI:', error.response?.data || error.message);
        res.status(500).json({ error: 'Błąd komunikacji z AIMLAPI' });
    }
});

app.listen(3000, () => {
    console.log(`Serwer działa na http://localhost:3000`);
});
