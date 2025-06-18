const axios = require('axios');


const FLASK_LOCALTUNNEL_URL = "https://1f36-34-143-137-83.ngrok-free.app"

let getChatbotResponse = async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'No question provided' });
    }

    let response = null;
    try {
        response = await axios.post(`${FLASK_LOCALTUNNEL_URL}/chat`, { question });
    } catch (err) {
        return res.json({ err: err.toString() });
    }

    const answer = response.data.answer;
    return res.json({ answer });
};

module.exports = {
    getChatbotResponse
};