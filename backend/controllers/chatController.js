const fs = require('fs');
const mammoth = require('mammoth');
require('dotenv').config();
const OpenAI = require("openai");
const pdfParse = require('pdf-parse');

const openai = new OpenAI({
    apiKey: process.env.API_KEY || "ВАШ_API_KEY",
});

exports.sendMessageToChat = async (req, res) => {
    const { text } = req.body;
    const files = req.files;
    
    try {
        const messages = [];
        if (text) {
            messages.push({ role: 'user', content: text });
        }

        // Обрабатываем файлы, если они есть
        if (files && files.length > 0) {
            for (const file of files) {
                let content = '';

                if (file.mimetype.startsWith('text/') || file.mimetype === 'application/json') {
                    // Чтение текстовых файлов и JSON
                    content = fs.readFileSync(file.path, 'utf8');
                } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    // Чтение .docx файлов
                    const result = await mammoth.extractRawText({ path: file.path });
                    content = result.value;
                } else if (file.mimetype === 'application/pdf') {
                    // Чтение PDF файлов
                    const pdfBuffer = fs.readFileSync(file.path); // Чтение PDF в буфер
                    const pdfData = await pdfParse(pdfBuffer); // Извлечение текста из PDF
                    content = pdfData.text;
                } else {
                    content = `The file type "${file.mimetype}" is not supported.`;
                }
    
                messages.push({
                    role: 'user',
                    content: `File: ${file.originalname}\n${content}`,
                });

                await fs.promises.unlink(file.path);
            }
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'Ты юрист. Давай ответы только по юридическим вопросам. Пиши только на русском языке' },
                ...messages,
            ],
        });

        // Логируем весь ответ от OpenAI
        console.log("OpenAI Response:", response);

        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error('Empty response from OpenAI API');
        }

        res.status(200).send(response.choices[0].message.content);
    } catch (error) {
        console.error("Ошибка при запросе к OpenAI API:", error.message);
        res.status(500).send({ error: error.message });
    }
};


