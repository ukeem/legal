import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LinkButton from '../../components/linkButton/LinkButton';
import './ResetPasswordSuccessPage.scss'

export default function ConfirmPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const e = searchParams.get('e');
        if (!e) {
            navigate('/'); // Перенаправление на главную, если параметр отсутствует
            return;
        }
        setMessage(decodeURIComponent(e));
    }, [searchParams, navigate]); // Добавлены зависимости для useEffect

    return (
        <div className="container resetPasswordSuccessPage">
            <h1 className="h1">{message}</h1>
            <p className='descr'>Пожалуйста, перейдите по ссылке, отправленной на вашу электронную почту, чтобы изменить пароль.</p>
            <LinkButton
                label='На главную'
                link='/'
                icon='home'
            />
        </div>
    );
}
