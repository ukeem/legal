import React from "react";
import "./formButton.scss";

export default function FormButton({ value, type, isLoading, disabled, onClick, counter, icon, active }) {
	const handleRipple = (e) => {

		if (disabled || isLoading) return;

		const button = e.currentTarget;

		// Получаем координаты клика
		const rect = button.getBoundingClientRect();
		const horizontalPos = e.clientX - rect.left;
		const verticalPos = e.clientY - rect.top;

		// Создаем ripple элемент
		const ripple = document.createElement("span");
		ripple.classList.add('ripple')
		ripple.style.left = `${horizontalPos}px`;
		ripple.style.top = `${verticalPos}px`;

		// Добавляем ripple к кнопке
		button.appendChild(ripple);

		// Удаляем ripple после анимации
		setTimeout(() => {
			ripple.remove();
		}, 1000);
	};

	return (
		<button
			className={`formButton ${isLoading ? "loading" : ""} ${active ? 'active' : ''}`}
			type={type}
			onClick={onClick || handleRipple}
			disabled={disabled || isLoading} // Отключаем кнопку, если она неактивна или идёт загрузка
		>
			{icon && !isLoading && <span className="material-symbols-outlined icon">{icon}</span>}
			{isLoading ? <span className="loader"></span> : <span className="value">{value}</span>}
			{counter && !isLoading && <span className='counter'>{counter}</span>}
		</button>
	);
}
