import React, { useState, useEffect } from 'react';
import './DashboardPage.scss';
import { getBalance, updateBalance, createRequest, getVip } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import LinkButton from '../../components/linkButton/LinkButton';
import Preloader from '../../components/preloader/Preloader';
import FormError from '../../components/formError/FormError';
import { useBalance } from '../../contexts/BalanceContext';

export default function DashboardPage() {

	const { balance, setBalance, vip, setVip } = useBalance();
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/');
		}
	}, [navigate]);

	useEffect(() => {
		const fetchBalance = async () => {
			setIsLoading(true);
			try {
				const response = await getBalance();
				setBalance(response.balance);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false); // Отключаем загрузку
			}
		};

		fetchBalance();
	}, [setBalance]);


	useEffect(() => {
		const fetchVip = async () => {
			setIsLoading(true);
			try {
				const response = await getVip();
				setVip(response.subscription.status);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false); // Отключаем загрузку
			}
		};

		fetchVip();
	}, [setVip]);

	const createNewRequest = async (amount, redirectPath = null) => {
		try {
			setIsLoading(true);
			const response = await updateBalance(amount); // Обновляем баланс через API
			setBalance(response.balance); // Обновляем локальное состояние
			const responseCreate = await createRequest();
			const requestId = responseCreate._id;
			// console.log(responseCreate);
			if (redirectPath) {
				navigate(`${redirectPath}/${requestId}`); // Перенаправляем, если указан маршрут
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('token'); // Удаляем токен
		localStorage.removeItem('role'); // Удаляем role

		window.location.href = '/';
	};


	if (error === 'tokenFail') {
		localStorage.removeItem('token'); // Удаляем токен
	}

	return (
		<div className="container dashboard">
			{isLoading ? (
				<Preloader />
			) : (
				<>
					<h1 className="h2">Добро пожаловать кожанный!</h1>

					<p className="descr"><strong>Баланс:</strong><br /> {
						vip ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M220-260q-92 0-156-64T0-480q0-92 64-156t156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99q0 58 41 99t99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156q0 92-64 156t-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99q0-58-41-99t-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13Z" /></svg> : balance}</p>
					<FormError
						error={error}
					/>
					{(balance !== 0 || vip) && (
						<LinkButton
							label="Создать запрос"
							onClick={() => createNewRequest(vip ? 0 : -1, '/dashboard/request')} // Списываем 1 и переходим
							icon="new_window"
						/>
					)}
					<LinkButton
						label="Купить запросы"
						link="/dashboard/payment"

						icon='shopping_cart'
					/>
					<LinkButton
						label="История запросов"
						link="/dashboard/history"

						icon='history'
					/>
					<LinkButton
						label="Изменить пароль"
						link="/dashboard/reset-password"

						icon='edit'
					/>
					<LinkButton
						label="Выйти"
						link="/login"

						onClick={() => handleLogout()}
						icon='logout'
					/>
				</>
			)}
		</div>
	);
}
