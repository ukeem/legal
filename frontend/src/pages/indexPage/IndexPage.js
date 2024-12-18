import React from 'react';
import LinkButton from '../../components/linkButton/LinkButton';
import './IndexPage.scss'
import Accordeon from '../../components/accordeon/Accordeon';
import Title from '../../components/title/Title';
import Logo from '../../components/logo/Logo';



const items = [
	{
		title: 'Регистрация',
		content: (
			<ol
				style={{
					fontSize: '16px',
					fontWeight: '400',
					lineHeight: '150%',
					paddingLeft: '32px',
					display: 'flex',
					flexDirection: 'column',
					gap: '8px'
				}}
			>
				<li>Перейдите на страницу&nbsp;
					<a
						href="/register"
						style={{
							textDecoration: 'underline',
							color: '#E65100',
							textDecorationStyle: 'dotted',
							textUnderlineOffset: '2px'
						}}
					>Регистрации</a>.
				</li>
				<li>Введите вашу почту, придумайте пароль, повторите пароль.</li>
				<li>Перейдите по ссылке в письме, полученном на вашу почту.</li>
			</ol>
		),
	},
	{
		title: 'Авторизация',
		content: (
			<ol
				style={{
					fontSize: '16px',
					fontWeight: '400',
					lineHeight: '150%',
					paddingLeft: '32px',
					display: 'flex',
					flexDirection: 'column',
					gap: '8px'
				}}
			>
				<li>Перейдите на страницу&nbsp;
					<a
						href="/login"
						style={{
							textDecoration: 'underline',
							color: '#E65100',
							textDecorationStyle: 'dotted',
							textUnderlineOffset: '2px'
						}}
					>Авторизации</a>.
				</li>
				<li>Введите вашу почту, введите пароль</li>
			</ol>
		),
	},
	{
		title: 'Изменить пароль',
		content: (
			<ol
				style={{
					fontSize: '16px',
					fontWeight: '400',
					lineHeight: '150%',
					paddingLeft: '32px',
					display: 'flex',
					flexDirection: 'column',
					gap: '8px'
				}}
			>
				<li>После авторизации перейдите на страницу&nbsp;
					<a
						href="/dashboard/changePassword"
						style={{
							textDecoration: 'underline',
							color: '#E65100',
							textDecorationStyle: 'dotted',
							textUnderlineOffset: '2px'
						}}
					>Изменить пароль</a>.
				</li>
				<li>Придумайте пароль, повторите пароль.</li>
			</ol>
		),
	},
	{
		title: 'Восстановить пароль',
		content: (
			<ol
				style={{
					fontSize: '16px',
					fontWeight: '400',
					lineHeight: '150%',
					paddingLeft: '32px',
					display: 'flex',
					flexDirection: 'column',
					gap: '8px'
				}}
			>
				<li>Перейдите на страницу&nbsp;
					<a
						href="/reset-password"
						style={{
							textDecoration: 'underline',
							color: '#E65100',
							textDecorationStyle: 'dotted',
							textUnderlineOffset: '2px'
						}}
					>Восстановить пароль</a>.
				</li>
				<li>Введите вашу почту.</li>
				<li>Перейдите по ссылке в письме, полученном на вашу почту.</li>
				<li>Придумайте новый пароль, повторите пароль.</li>
			</ol>
		),
	},
	{
		title: 'Создание запроса',
		content: (
			<ol
				style={{
					fontSize: '16px',
					fontWeight: '400',
					lineHeight: '150%',
					paddingLeft: '32px',
					display: 'flex',
					flexDirection: 'column',
					gap: '8px'
				}}
			>
				<li>Перейдите на страницу&nbsp;
					<a
						href="/login"
						style={{
							textDecoration: 'underline',
							color: '#E65100',
							textDecorationStyle: 'dotted',
							textUnderlineOffset: '2px'
						}}
					>Авторизации</a>.
				</li>
				<li>Введите вашу почту, введите пароль</li>
			</ol>
		),
	},
	{
		title: 'Покупка запросов',
		content: (
			<ol
				style={{
					fontSize: '16px',
					fontWeight: '400',
					lineHeight: '150%',
					paddingLeft: '32px',
					display: 'flex',
					flexDirection: 'column',
					gap: '8px'
				}}
			>
				<li>Перейдите на страницу&nbsp;
					<a
						href="/login"
						style={{
							textDecoration: 'underline',
							color: '#E65100',
							textDecorationStyle: 'dotted',
							textUnderlineOffset: '2px'
						}}
					>Авторизации</a>.
				</li>
				<li>Введите вашу почту, введите пароль</li>
			</ol>
		),
	},
];

const IndexPage = () => {
	return (
		<div className='container indexPage'>
			<div className='rows'>
				<Logo
					size='192'
					margin='0 0 16px 0'
				/>
				<Title
					text='AI Право'
					size='24'
				/>
				<LinkButton
					label='Авторизация'
					link='/login'
					icon='login'
				/>
				<LinkButton
					label='Регистрация'
					link='/register'
					white={true}
					icon='person_add'
				/>
			</div>
			<div>
				<Title
					text='Как пользоваться'
					size='20'
				/>
				<Accordeon items={items} />
			</div>
		</div>
	);
};

export default IndexPage;
