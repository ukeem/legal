import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LinkButton from '../../components/linkButton/LinkButton';
import './NewPasswordSuccessPage.scss'

export default function NewPasswordSuccessPage() {
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
        <div className="container newPasswordSuccessPage">
            <h1 className="h2">{message}</h1>
            <LinkButton
                label='Авторизоваться'
                link='/login'
                icon='login'
            />
        </div>
    );
}
