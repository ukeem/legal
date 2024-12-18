import React from 'react';
import { Link } from 'react-router-dom';
import './linkButton.scss';

export default function LinkButton({ label, link, white, onClick, icon, active }) {
	const handleRipple = (e) => {
		const button = e.currentTarget;

		// Получаем координаты клика
		const rect = button.getBoundingClientRect();
		const horizontalPos = e.clientX - rect.left;
		const verticalPos = e.clientY - rect.top;

		// Создаем ripple элемент
		const ripple = document.createElement('span');
		ripple.className = 'ripple'; // Добавляем базовый класс
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
		<Link
			to={link}
			className={`linkButton ${white ? 'whiteBtn' : ''} ${active ? 'active' : ''}`}
			onClick={onClick || handleRipple}
		>
			{icon && <span className="material-symbols-outlined">{icon}</span>}
			<span>{label}</span>
		</Link>
	);
}
