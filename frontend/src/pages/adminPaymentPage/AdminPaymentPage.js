import React, { useEffect, useState } from 'react'
import './AdminPaymentPage.scss'
import { getTariffs, addTariff, deleteTariff } from '../../services/api'
import Preloader from '../../components/preloader/Preloader'
import LinkButton from '../../components/linkButton/LinkButton'

export default function AdminPaymentPage() {
	const [formData, setFormData] = useState({
		cost: '',
		type: '',
		requestCount: '',
		dayCount: '',
	});
	const [formError, setFormError] = useState({
		cost: '',
		type: '',
		requestCount: '',
		dayCount: '',
	});
	const [tariffs, setTariffs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');


	useEffect(() => {
		const fetchTariffs = async () => {
			try {
				const data = await getTariffs();
				const sortedTariffs = data.sort((a, b) => a.cost - b.cost);
				setTariffs(sortedTariffs); // Устанавливаем тарифы в state
			} catch (err) {
				setError(err.message); // Устанавливаем ошибку
			} finally {
				setLoading(false); // Отключаем индикатор загрузки
			}
		};

		fetchTariffs();
	}, [setTariffs]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleDelete = async (id) => {
		setError('');
		setSuccess('');
		try {
			await deleteTariff(id); // Удаляем тариф
			setTariffs(tariffs.filter((tariff) => tariff._id !== id)); // Обновляем состояние
			setSuccess('Тариф успешно удален');
		} catch (err) {
			setError(err.message);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true);

		// Подготовка данных
		const preparedData = {
			cost: parseFloat(formData.cost),
			type: formData.type,
			...(formData.type === 'fixed' && { requestCount: parseInt(formData.requestCount, 10) }),
			...(formData.type === 'subscription' && { dayCount: parseInt(formData.dayCount, 10) }),
		};

		try {
			await addTariff(preparedData); // Передаем данные в addTariff
			const data = await getTariffs();
			const sortedTariffs = data.sort((a, b) => a.cost - b.cost);
			setTariffs(sortedTariffs); // Устанавливаем тарифы в state
			console.log(tariffs)
			setSuccess('Тариф успешно создан!');
			setFormData({ cost: '', type: 'fixed', requestCount: '', dayCount: '' }); // Сбрасываем форму
		} catch (err) {
			console.error('Ошибка создания тарифа:', err.message);
			setError(err.message);

			if (err.message === 'Введите стоимость цифрами') {
				setFormError({ ...formError, cost: err.message })
			} else if (err.message === 'Выберите тип тарифа') {
				setFormError({ ...formError, type: err.message })
			} else if (err.message === 'Введите кол-во запросов цифрами') {
				setFormError({ ...formError, requestCount: err.message })
			} else if (err.message === 'Введите период подписки цифрами') {
				setFormError({ ...formError, dayCount: err.message })
			}
		} finally {
			setLoading(false); // Отключаем индикатор загрузки
		}
	};

	if (loading) return <div className="container"><Preloader /></div>; // Отображаем индикатор загрузки
	// if (error) return <p className="error">{error}</p>; // Отображаем ошибку

	return (

		<div className="adminPaymentPage">
			{/* {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>} */}
			<div className="tariffs">
				{/* <h1>Управление тарифами</h1> */}
				{tariffs.length === 0 ? (
					<p>Нет доступных тарифов.</p>
				) : (
					<>
						{tariffs.map((tariff) => (
							<div className="tariff" key={tariff._id}>
								<p>Тип: <span>{tariff.type === 'subscription' ? 'Подписка' : 'Фикс'}</span></p>
								<p>Цена: <span>{tariff.cost} ₸</span></p>
								<p>Кол-во запросов: <span>{tariff.requestCount || <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M220-260q-92 0-156-64T0-480q0-92 64-156t156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99q0 58 41 99t99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156q0 92-64 156t-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99q0-58-41-99t-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13Z" /></svg>}</span></p>
								<p>Срок: <span>{tariff.dayCount || <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M220-260q-92 0-156-64T0-480q0-92 64-156t156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99q0 58 41 99t99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156q0 92-64 156t-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99q0-58-41-99t-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13Z" /></svg>}</span></p>
								<span onClick={() => handleDelete(tariff._id)} className="material-symbols-outlined btnDelete">delete</span>
							</div>
						))}
					</>
				)}
			</div>
			<form>
				<div className='formGroup'>
					{formError.cost ? <label className='error'>{formError.cost}</label> : <label>Стоимость</label>}
					<input
						type="number"
						name="cost"
						value={formData.cost}
						onChange={handleChange}
						placeholder='Введите стоимость тарифа'
						required
					/>
				</div>
				<div className='formGroup'>
					{formError.type ? <label className='error'>{formError.type}</label> : <label>Тип тарифа</label>}
					<select name="type" value={formData.type} onChange={handleChange}>
						<option value="" disabled hidden>Выберите тип тарифа</option>
						<option value="fixed">Фиксированный</option>
						<option value="subscription">Подписка</option>
					</select>
				</div>
				{formData.type === 'fixed' && (
					<div className='formGroup'>
						{formError.requestCount ? <label className='error'>{formError.requestCount}</label> : <label>Кол-во запросов</label>}
						<input
							type="number"
							name="requestCount"
							value={formData.requestCount}
							onChange={handleChange}
							placeholder='Введите кол-во запросов'
							required
						/>
					</div>
				)}
				{formData.type === 'subscription' && (
					<div className='formGroup'>
						{formError.dayCount ? <label className='error'>{formError.dayCount}</label> : <label>Период подписки (дни)</label>}
						<input
							type="number"
							name="dayCount"
							value={formData.dayCount}
							onChange={handleChange}
							placeholder='Введите период'
							required
						/>
					</div>
				)}
				<LinkButton
					label="Создать тариф"
					onClick={handleSubmit}
				/>
			</form>
		</div>
	);
}
