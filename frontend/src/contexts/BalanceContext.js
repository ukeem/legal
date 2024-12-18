import React, { createContext, useContext, useState } from 'react';

// Создаем контекст
const BalanceContext = createContext();

// Хук для доступа к контексту
export const useBalance = () => {
	return useContext(BalanceContext);
};

// Провайдер для управления балансом и статусом VIP
export const BalanceProvider = ({ children }) => {
	const [balance, setBalance] = useState(0); // Начальное значение баланса
	const [vip, setVip] = useState(false); // Начальное значение VIP статуса

	return (
		<BalanceContext.Provider value={{ balance, setBalance, vip, setVip }}>
			{children}
		</BalanceContext.Provider>
	);
};
