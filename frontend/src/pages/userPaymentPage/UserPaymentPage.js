import React, { useState, useEffect } from 'react'
import './userPaymentPage.scss'
import LinkButton from '../../components/linkButton/LinkButton'
import { useBalance } from '../../contexts/BalanceContext';
import { getTariffs, buyTariff, getBalance, getVip } from '../../services/api';
import Preloader from '../../components/preloader/Preloader';


export default function UserPaymentPage() {


	const [tariffs, setTariffs] = useState([]);
	const { setBalance, vip, setVip } = useBalance();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [startDate, setStartDate] = useState();
	const [durationDays, setDurationDays] = useState();
	const [myEmail, setMyEmail] = useState();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const tariffsData = await getTariffs();
				const sortedTariffs = tariffsData.sort((a, b) => a.cost - b.cost);
				setTariffs(sortedTariffs);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);



	useEffect(() => {
		const fetchVip = async () => {
			setIsLoading(true);
			try {
				const response = await getVip();
				setVip(response.subscription.status);
				setStartDate(response.subscription.startDate);
				setDurationDays(response.subscription.durationDays)
				setMyEmail(response.email)
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false); // Отключаем загрузку
			}
		};

		fetchVip();
	}, [setVip]);


	const endDate = new Date(new Date(startDate).getTime() + durationDays * 24 * 60 * 60 * 1000);


	const handleBuy = (tariff, email) => {
		if (!window.tiptop) {
			setError('Ошибка загрузки виджета TipTopPay.');
			return;
		}

		const widget = new window.tiptop.Widget();

		widget.pay('auth', // или 'charge' в зависимости от настроек
			{
				publicId: 'test_api_00000000000000000000002', // Public ID из личного кабинета TipTopPay
				description: `${tariff.type === 'subscription' ? 'Покупка тарифа: Безлимит' : 'Покупка ' + tariff.requestCount + ' запрос(ов)'}`, // Назначение платежа
				amount: tariff.cost, // Сумма платежа
				currency: 'KZT', // Валюта
				accountId: email, // Уникальный идентификатор пользователя
				invoiceId: `${Date.now()}`, // Уникальный номер заказа
				email: email, // Email пользователя
				skin: 'mini', // Опциональный скин
				data: {
					tariffId: tariff._id, // Передаем ID тарифа
				},
			},
			{
				onSuccess: async function (options) {
					try {
						await buyTariff(tariff._id)
						const getNewVip = await getVip();
						await setVip(getNewVip.subscription.status);
						if (!vip) {
							const getNewBalance = await getBalance();
							setBalance(getNewBalance.balance);
						}
					} catch (err) {
						setError('Ошибка обновления баланса.');
					}
				},
				onFail: function (reason, options) {
					console.log(error);
					setError(`Ошибка: ${reason}`);
				},
				onComplete: function (paymentResult, options) {
					console.log('Результат транзакции:', paymentResult);
				},
			}
		);
	};

	if (isLoading) return <Preloader />;

	return (
		<div className="tariffs">
			{!vip ? (
				tariffs.map((tariff) => (
					<div className={`tariff ${tariff.type === 'subscription' ? 'unlim' : ''}`} key={tariff._id}>
						<div className="tariff__countReq">{tariff.type === 'subscription' ? 'Безлимит' : tariff.requestCount}</div>
						<div className="tariff__price">
							<span className="numPrice">{tariff.cost.toLocaleString('ru-RU')}</span>
							<span className="symPrice">{tariff.type === 'subscription' ? '₸/мес' : '₸'}</span>
						</div>
						<LinkButton
							label="Купить"
							icon='shopping_cart'
							onClick={() => handleBuy(tariff, myEmail)}
						/>
					</div>
				))
			) : (
				<div className='subscription'>
					<h2>Подписка активна</h2>
					<p>Начало подписки: <span>{new Date(startDate).toLocaleDateString()}</span></p>
					<p>Окончание подписки: <span>{endDate.toLocaleDateString()}</span></p>
				</div>
			)
			}
		</div>
	)
}
