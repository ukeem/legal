const fs = require('fs');
const mammoth = require('mammoth');
require('dotenv').config();
const OpenAI = require("openai");
const pdfParse = require('pdf-parse');

const openai = new OpenAI({
	apiKey: process.env.API_KEY || "ВАШ_API_KEY",
});



exports.sendMessageToChat = async (req, res) => {
	const { text, threadId } = req.body;
	const files = req.files;

	// console.log(threadId)

	try {
		const messages = [];

		if (text && (!files || files.length === 0)) {
			messages.push({
				role: 'user',
				content: text,
			});
		}

		if (text && files && files.length > 0) {
			let content = ''; // Переменная для хранения содержимого всех файлов

			for (const file of files) {
				try {
					let fileContent = '';

					if (file.mimetype.startsWith('text/') || file.mimetype === 'application/json') {
						// Чтение текстовых файлов и JSON
						fileContent = await fs.promises.readFile(file.path, 'utf8');
					} else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
						// Чтение .docx файлов
						const result = await mammoth.extractRawText({ path: file.path });
						fileContent = result.value || 'Ошибка при извлечении текста из .docx файла.';
					} else if (file.mimetype === 'application/pdf') {
						// Чтение PDF файлов
						const pdfBuffer = fs.readFileSync(file.path); // Чтение PDF в буфер
						const pdfData = await pdfParse(pdfBuffer); // Извлечение текста из PDF
						fileContent = pdfData.text || 'Ошибка при извлечении текста из PDF файла.';
					} else {
						fileContent = `Тип файла "${file.mimetype}" не поддерживается.`;
					}

					// Добавляем содержимое текущего файла в общий контент
					content += `\n--- Содержимое файла: ${file.originalname} ---\n${fileContent}\n`;
				} catch (error) {
					console.error(`Ошибка при обработке файла ${file.path}:`, error.message);
					content += `\n--- Ошибка при обработке файла "${file.originalname}": ${error.message} ---\n`;
				} finally {
					// Удаляем файл
					try {
						await fs.promises.unlink(file.path);
					} catch (unlinkError) {
						console.error(`Ошибка при удалении файла ${file.path}:`, unlinkError.message);
					}
				}
			}

			// Добавляем общий контент из файлов в сообщение
			messages.push({
				role: 'user',
				content: `Данные из файлов: \n${content}\n\nМой вопрос или указание: ${text}`,
			});
		}



		const assistant = await openai.beta.assistants.retrieve(
			"asst_JQvVzXJ5sJqRuPtD4oqjiTdK"
		);

		// const thread = await openai.beta.threads.create();
		const thread = await openai.beta.threads.retrieve(
			threadId
		);

		const threadMessages = await openai.beta.threads.messages.create(
			thread.id,
			...messages
		);

		const run = await openai.beta.threads.runs.create(
			thread.id,
			{ assistant_id: assistant.id }
		);

		async function checkStatus(thread_id, run_id) {
			let status = '';
			let resp; // Переменная объявлена здесь, чтобы быть доступной вне блока do-while
			do {
				resp = await openai.beta.threads.runs.retrieve(
					thread_id,
					run_id
				);
				status = resp.status;
				// console.log(`Current status: ${status}`);
				if (status !== 'completed') {
					await new Promise(resolve => setTimeout(resolve, 1000)); // Ждать 1 секунду перед повторной проверкой
				}
			} while (status !== 'completed');

			return resp;
		}


		const resp = await checkStatus(thread.id, run.id);
		let response;
		// После завершения статуса completed
		if (resp.status === 'completed') {
			const messages = await openai.beta.threads.messages.list(
				run.thread_id
			);
			for (const message of messages.data.reverse()) {
				if (message.role === 'assistant') {
					response = message.content[0].text.value
				}
			}
		}




		// const response = await openai.chat.completions.create({
		//     model: 'gpt-4o',
		//     messages: [
		//         { role: 'system', content: 'Ты юрист. Давай ответы только по юридическим вопросам. Пиши только на русском языке' },
		//         ...messages,
		//     ],
		// });

		// Логируем весь ответ от OpenAI
		// console.log("OpenAI Response:", messages);

		if (!response) {
			throw new Error('Empty response from OpenAI API');
		}

		res.status(200).json(response);
	} catch (error) {
		console.error("Ошибка при запросе к OpenAI API:", error.message);
		res.status(500).json({ error: error.message });
	}
};


