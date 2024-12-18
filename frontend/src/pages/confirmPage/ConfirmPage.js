import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LinkButton from '../../components/linkButton/LinkButton';
import './ConfirmPage.scss'

export default function ConfirmPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const e = searchParams.get('e');
        if (!e) {
            navigate('/'); // Перенаправление на главную, если параметр отсутствует
            return;
        }
        setMessage(decodeURIComponent(e));

        if (decodeURIComponent(e) === 'Email уже зарегистрирован' || decodeURIComponent(e) === 'Пароли не совпадают' || decodeURIComponent(e) === 'Все поля обязательны') {
            setError(true)
        }
    }, [searchParams, navigate]); // Добавлены зависимости для useEffect



    return (
        <div className="container confirmPage">
            <h1 className="h1">{message}</h1>
            {!error && <p className='descr'>Пожалуйста, перейдите по ссылке, отправленной на вашу электронную почту, чтобы завершить регистрацию.</p>}
            <LinkButton
                label='На главную'
                link='/'
                icon='home'
            />
        </div>
    );
}
