import React, { useEffect, useState } from 'react'
import './LayoutUser.scss'
import LinkButton from '../../components/linkButton/LinkButton';
import Preloader from '../../components/preloader/Preloader';
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { getBalance, updateBalance, createRequest, getVip } from '../../services/api';
import { useBalance } from '../../contexts/BalanceContext';
import Logo from '../logo/Logo';

const LayoutUser = () => {

	const { balance, setBalance, vip, setVip } = useBalance();
	// const [vip, setVip] = useState(false);
	const [error, setError] = useState('');
	const [isMenuOpened, setIsMenuOpened] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const location = useLocation();

	useEffect(() => {
		const token = localStorage.getItem('token');
		const role = localStorage.getItem('role');
		if (!token && !role) {
			window.location.href = '/';
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('token'); // Удаляем токен
		localStorage.removeItem('role'); // Удаляем role

		window.location.href = '/';
	};

	const openMenu = () => {
		setIsMenuOpened((prev) => !prev);
	}

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
		openMenu()
		try {
			setIsLoading(true);
			const response = await updateBalance(amount); // Обновляем баланс через API
			setBalance(response.balance); // Обновляем локальное состояние
			const responseCreate = await createRequest();
			const requestId = responseCreate._id;
			console.log(responseCreate);
			if (redirectPath) {
				navigate(`${redirectPath}/${requestId}`); // Перенаправляем, если указан маршрут
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};


	if (error === 'tokenFail') {
		localStorage.removeItem('token'); // Удаляем токен
	}

	if (isLoading) {
		return <Preloader />
	}
	return (
		<div className="fullContainer">
			<aside className={isMenuOpened ? "visible" : ""}>
				<div className="aside__itemss">
					<Logo
						size='48'
					/>
					<div className="logoText">
						<h2><span>AI</span>Право</h2>
						<p>ИИ ассистент для юристов</p>
					</div>
				</div>
				<div className="aside__itemss">
					<span className='balanceText'>Баланс</span>
					<span className='balanceNumber'>{vip ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M220-260q-92 0-156-64T0-480q0-92 64-156t156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99q0 58 41 99t99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156q0 92-64 156t-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99q0-58-41-99t-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13Z" /></svg> : balance}</span>
				</div>
				<div className='aside__itemss'>
					{(balance !== 0 || vip) && (
						<LinkButton
							label="Новый запрос"
							onClick={() => createNewRequest(vip ? 0 : -1, '/dashboard/request')} // Списываем 1 и переходим
							icon="new_window"
							active={location.pathname.startsWith('/dashboard/request') ? 'active' : ''}
						/>
					)}
					<LinkButton
						label="Купить запросы"
						link="/dashboard/payment"
						active={location.pathname === '/dashboard/payment' ? 'active' : ''}
						icon='shopping_cart'
						onClick={() => openMenu()}
					/>
					<LinkButton
						label="История запросов"
						link="/dashboard/history"
						active={location.pathname === '/dashboard/history' ? 'active' : ''}
						icon='history'
						onClick={() => openMenu()}
					/>
					<LinkButton
						label="Изменить пароль"
						link="/dashboard/reset-password"
						active={location.pathname === '/dashboard/reset-password' ? 'active' : ''}
						icon='edit'
						onClick={() => openMenu()}
					/>
					<LinkButton
						label="Выйти"
						link="/login"
						onClick={() => handleLogout()}
						icon='logout'
					/>
				</div>
			</aside>
			<main>
				<div className="header">
					<div className='balanceMobile'>
						<span className='balanceDescr'>Баланс</span>
						<span className='balanceNumber'>{vip ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M220-260q-92 0-156-64T0-480q0-92 64-156t156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99q0 58 41 99t99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156q0 92-64 156t-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99q0-58-41-99t-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13Z" /></svg> : balance}</span>
					</div>
					<div
						className='menuBtn'
						onClick={openMenu}
					>
						<span className="material-symbols-outlined">{isMenuOpened ? 'close' : 'menu'}</span>
					</div>
				</div>
				<Outlet />
			</main>
		</div>
	)
}

export default LayoutUser