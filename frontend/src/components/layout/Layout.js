import React, { useEffect, useState } from 'react'
import './Layout.scss'
import LinkButton from '../linkButton/LinkButton'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { createRequest } from '../../services/api'
import Preloader from '../preloader/Preloader'
import Logo from '../logo/Logo'

const Layout = () => {
	const location = useLocation();
	const [isMenuOpened, setIsMenuOpened] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [setError] = useState('');
	const navigate = useNavigate();

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



	const createNewRequest = async () => {
		openMenu()
		try {
			setIsLoading(true);
			const responseCreate = await createRequest()
			const requestId = responseCreate._id;
			navigate(`/admin/request/${requestId}`);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};


	if (isLoading) {
		return <Preloader />
	}


	return (
		<div className="fullContainer layout">
			<aside className={isMenuOpened ? "visible" : ""}>
				<div className='aside__items'>
					<LinkButton
						label="Создать запрос"
						// link='/admin'
						icon='new_window'
						active={location.pathname.startsWith('/admin/request') ? 'active' : ''}
						onClick={() => createNewRequest()}
					/>
					<LinkButton
						label='История запросов'
						link='/admin/history'
						icon='history'
						active={location.pathname === '/admin/history' ? 'active' : ''}
						onClick={() => openMenu()}
					/>
					<LinkButton
						label='Статистика'
						link='/admin/statistic'
						icon='monitoring'
						active={location.pathname === '/admin/statistic' ? 'active' : ''}
						onClick={() => openMenu()}
					/>
					<LinkButton
						label='Тарифы'
						link='/admin/payment'
						icon='price_change'
						active={location.pathname === '/admin/payment' ? 'active' : ''}
						onClick={() => openMenu()}
					/>
					<LinkButton
						label='Добавить админа'
						link='/admin/add-admin'
						icon='person_add'
						active={location.pathname === '/admin/add-admin' ? 'active' : ''}
						onClick={() => openMenu()}
					/>
				</div>
				<div className='aside__items'>
					<LinkButton
						label='Выход'
						icon='logout'
						onClick={() => handleLogout()}
					/>
				</div>
			</aside>
			<main>
				<div className="header">
					<Logo
						size='48'
					/>
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

export default Layout