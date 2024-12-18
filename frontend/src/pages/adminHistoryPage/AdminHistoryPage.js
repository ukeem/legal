import React, { useState, useEffect } from 'react';
import './AdminHistoryPage.scss';
import { getRequests, deleteRequest, deleteRequestAll } from '../../services/api'; // Предположительно, эти API-функции существуют.
import { useNavigate } from 'react-router-dom';
import Preloader from '../../components/preloader/Preloader';
import LinkButton from '../../components/linkButton/LinkButton';

const AdminHistoryPage = () => {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	// Функция для загрузки запросов
	const fetchRequests = async (id) => {
		try {
			const data = await getRequests(id);
			setRequests(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []);

	// Удаление запроса
	const handleDelete = async (id) => {
		try {
			await deleteRequest(id);
			setRequests(requests.filter((request) => request._id !== id));
		} catch (err) {
			setError('Ошибка при удалении запроса.');
		}
	};


	const handleDeleteAll = async () => {
		try {
			await deleteRequestAll();
			setRequests([]);
		} catch (err) {
			setError('Ошибка при удалении запроса.');
		}
	};

	// Переход к просмотру запроса
	const handleView = (id) => {
		navigate(`/admin/request/${id}`);
	};

	if (loading) return <div className="container"><Preloader /></div>;

	if (error) return <div className="container"><p className="error">{error}</p></div>;

	return (
		<div className="historyPage">
			{requests.length === 0 ? (
				<div
					style={{
						height: '100%',
						textAlign: 'center',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>Запросы удалены</div>
			) : (
				<>
					<div className='clearWrap'
						style={{
						}}
					>
						<LinkButton
							label='Очистить все'
							onClick={() => handleDeleteAll()}
						/>
					</div>
					<table className="requestsTable">
						<thead>
							<tr>
								<th>Дата</th>
								<th>Заголовок</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{requests.map((request) => (
								<tr key={request._id}>
									<td>
										{new Date(request.createdAt).toLocaleDateString()}
										<br />
										<span style={{ color: '#212121' }}>{new Date(request.createdAt).toLocaleTimeString()}</span>
									</td>
									<td>{request.messages[0]?.content.slice(0, 100) || 'Без заголовка'}...</td>
									<td>
										<button onClick={() => handleView(request._id)} className="viewBtn">Посмотреть</button>
										<button onClick={() => handleDelete(request._id)} className="deleteBtn">Удалить</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			)}
		</div>
	);
};

export default AdminHistoryPage;
