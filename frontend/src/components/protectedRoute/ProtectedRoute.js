import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';


const ProtectedRoute = ({ children, allowedRoles = [] }) => {
	const token = localStorage.getItem("token");
	const role = localStorage.getItem("role");

	// Если токен отсутствует, перенаправляем на страницу входа
	if (!token) {
		return <Navigate to="/" replace />;
	}

	try {
		// Декодируем токен для проверки
		const decodedToken = jwtDecode(token);
		const currentTime = Date.now() / 1000; // Текущее время в секундах

		// Если токен истек, перенаправляем на страницу входа
		if (decodedToken.exp < currentTime) {
			localStorage.removeItem("token"); // Очищаем просроченный токен
			return <Navigate to="/" replace />;
		}

		if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
			return <Navigate to="/" replace />;
		}

		// Если токен действителен и роль разрешена, рендерим дочерние компоненты
		return children;
	} catch (error) {
		// Если токен некорректен, очищаем его и перенаправляем на страницу входа
		console.error("Некорректный токен:", error.message);
		localStorage.removeItem("token");
		return <Navigate to="/" replace />;
	}
};


export default ProtectedRoute;
