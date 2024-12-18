const API_BASE_URL = 'http://localhost:5000/api';

const apiRequest = async (endpoint, method, body, isMultipart = false) => {
	const token = localStorage.getItem('token'); // Получение токена из localStorage

	const options = {
		method,
		headers: {},
	};

	if (token) {
		options.headers["Authorization"] = `Bearer ${token}`;
	}

	if (isMultipart) {
		options.body = body; // При multipart тело запроса - это FormData
	} else if (body) {
		options.headers["Content-Type"] = "application/json";
		options.body = JSON.stringify(body); // Преобразуем тело запроса в JSON
	}

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

		// Читаем тело ответа один раз
		const responseText = await response.text();

		// Проверяем успешность запроса
		if (!response.ok) {
			let errorMessage = `HTTP error! status: ${response.status}`;
			try {
				// Парсим текст ответа как JSON, если это возможно
				const errorData = JSON.parse(responseText);
				errorMessage = errorData.message || errorMessage;
			} catch (error) {
				console.error("Ошибка при парсинге тела ошибки:", error);
			}
			throw new Error(errorMessage); // Выбрасываем ошибку с деталями
		}

		// Попытка преобразовать успешный ответ в JSON
		try {
			return JSON.parse(responseText);
		} catch (error) {
			console.error("Ошибка парсинга ответа:", error);
			return null;
		}
	} catch (error) {
		console.error("API Error:", error.message); // Логируем сетевые ошибки
		throw error; // Передаем ошибку дальше
	}
};



// Существующие методы

export const registerUser = ({ email, password, confirmPassword }) => {
	return apiRequest("/register", "POST", { email, password, confirmPassword });
};

export const confirmEmail = (token) => {
	return apiRequest(`/confirm`, "POST", { token });
};

export const loginUser = ({ email, password }) => {
	return apiRequest("/login", "POST", { email, password });
};

export const resetPassword = (email) => {
	return apiRequest("/reset-password", "POST", { email });
};

export const saveNewPassword = ({ token, password, confirmPassword }) => {
	return apiRequest("/save-new-password", "POST", { token, password, confirmPassword });
};

export const getBalance = () => {
	return apiRequest("/get-balance", "GET");
};


export const getVip = () => {
	return apiRequest("/get-vip", "GET");
};

export const updateBalance = async (amount) => {
	return apiRequest('/update-balance', 'POST', { amount });
};

export const createRequest = async () => {
	return apiRequest('/requests', 'POST');
};

export const addMessage = async (requestId, message) => {
	return apiRequest('/requests/message', 'POST', { requestId, message });
};

export const addAIResponse = async (requestId, response) => {
	return apiRequest('/requests/ai-response', 'POST', { requestId, response });
};

export const addAttempts = async (requestId, attempts) => {
	return apiRequest('/requests/add-attempts', 'POST', { requestId, attempts });
};

export const sendMessageToChat = async (message) => {
	return apiRequest('/chat', 'POST', { message });
};

export const getAttempts = async (requestId) => {
	return apiRequest(`/requests/${requestId}/attempts`, 'GET');
};

export const getThreadId = async (requestId) => {
	return apiRequest(`/requests/${requestId}/threadId`, 'GET');
};

export const getMessages = async (requestId) => {
	return apiRequest(`/requests/${requestId}/messages`, 'GET');
};

export const getAiResponses = async (requestId) => {
	return apiRequest(`/requests/${requestId}/ai-responses`, 'GET');
};

export const sendMessage = async (text, files, threadId) => {
	const formData = new FormData();

	// Добавляем текст, если он есть
	if (text) {
		formData.append("text", text);
	}

	if (threadId) {
		formData.append("threadId", threadId);
	}
	// Добавляем файлы, если они есть
	if (files && files.length > 0) {
		for (let i = 0; i < files.length; i++) {
			formData.append("files", files[i]);
		}
	}
	// console.log('Отправляемые данные:', formData);
	// Отправляем запрос
	return apiRequest("/chat", "POST", formData, true);
};

export const getTariffs = async () => {
	return apiRequest(`/get-tariffs`, 'GET');
};

export const addTariff = async (formData) => {
	return apiRequest(`/add-tariff`, 'POST', formData);
};

export const buyTariff = async (tariffId) => {
	console.log(tariffId);
	return apiRequest(`/buy-tariff`, 'POST', { tariffId });
};

export const deleteTariff = async (id) => {
	return apiRequest(`/delete/${id}`, 'DELETE');
};

// export const getAllRequests = async () => {
// 	return apiRequest(`/get-allRequests/`, 'GET');
// };

export const getRequests = async () => {
	return apiRequest(`/get-requests/`, 'GET');
};

export const deleteRequest = async (id) => {
	return apiRequest(`/requests/${id}`, 'DELETE');
};



export const deleteRequestAll = async () => {
	return apiRequest(`/requests-all/`, 'DELETE');
};