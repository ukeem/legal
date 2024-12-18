import React, { useState } from "react";
import FormInput from '../../components/formInput/FormInput';
import FormButton from '../../components/formButton/FormButton';
import FormError from '../../components/formError/FormError';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from "../../services/api";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await resetPassword(email);
            // console.log('Response:', response.message); // Логируем ответ для проверки
            navigate(`/reset-password-success?e=${encodeURIComponent(response.message)}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false); // Выключаем лоадер
        }
    };

    return (
        
        <div className="container">
            <h1 className='h1' style={{margin: 0}}>Сброс пароля</h1>
            <FormError 
                error={error}
            />
            <form onSubmit={handleSubmit}>
                <FormInput
                    placeholder="Введите ваш Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <FormButton
                    type="submit"
                    value="Сбросить пароль"
                    isLoading={isLoading}
                    disabled={isLoading}
                />
            </form>
            <div className='underForm'>
                <a href="/login">Авторизоваться</a>
                <a href="/register">Зарегистрироваться</a>
            </div>
        </div>
    );
}
