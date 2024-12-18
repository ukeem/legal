import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, createRequest } from '../../services/api';
import './LoginPage.scss';
import FormInput from '../../components/formInput/FormInput';
import FormButton from '../../components/formButton/FormButton';
import FormError from '../../components/formError/FormError';

const LoginPage = () => {
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// useEffect(() => {
	// 	// Check if we're running in the browser
	// 	if (typeof window !== 'undefined') {
	// 		const token = localStorage.getItem('token');
	// 		const role = localStorage.getItem('role');

	// 		// Validate the token and navigate if valid
	// 		if (token && role) {
	// 			try {
	// 				if (role === 'admin') {
	// 					navigate('/admin/request/:id');
	// 				} else {
	// 					navigate('/dashboard');
	// 				}
	// 			} catch (error) {
	// 				console.error('Invalid token:', error);
	// 			}
	// 		}
	// 	}
	// }, [navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const response = await loginUser(formData);

			// Сохраняем токен и роль в localStorage
			localStorage.setItem('token', response.token);
			localStorage.setItem('role', response.user.role);

			// Перенаправляем в зависимости от роли
			if (response.user.role === 'admin') {
				try {
					setIsLoading(true);
					const responseCreate = await createRequest();
					const requestId = responseCreate._id;
					// console.log(responseCreate);
					navigate(`/admin/request/${requestId}`); // Перенаправляем, если указан маршрут
				} catch (err) {
					setError(err.message);
				} finally {
					setIsLoading(false);
				}
			} else {
				navigate('/dashboard');
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container">
			<h1 className='h1' style={{ margin: 0 }}>Авторизация</h1>
			<FormError
				error={error}
			/>
			<form onSubmit={handleSubmit}>
				<FormInput
					placeholder="Введите ваш Email"
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
				<FormInput
					placeholder="Введите ваш пароль"
					type="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					withToggle
					required
				/>
				<FormButton
					type="submit"
					value="Войти"
					isLoading={isLoading}
					disabled={isLoading}
				/>
			</form>
			<div className='underForm'>
				<a href="/register">Зарегистрироваться</a>
				<a href="/reset-password">Сбросить пароль</a>
			</div>
		</div>
	);
};

export default LoginPage;
