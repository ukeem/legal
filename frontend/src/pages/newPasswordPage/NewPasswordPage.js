import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { saveNewPassword } from "../../services/api";
import FormInput from '../../components/formInput/FormInput';
import FormError from '../../components/formError/FormError';
import FormButton from '../../components/formButton/FormButton';

export default function NewPasswordPage() {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    
    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            navigate('/'); // Перенаправление на главную, если параметр отсутствует
            return;
        }
    }, [searchParams, navigate]); // Добавлены зависимости для useEffect


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setIsLoading(true);
        
        const token = searchParams.get("token");

        try {
            const response = await saveNewPassword({ token, ...formData });
            navigate(`/new-password-success?e=${encodeURIComponent(response.message)}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false); // Выключаем лоадер
        }
    };

    return (
        <div className='container'>
            <h1 className='h1'>Новый пароль</h1>
            <FormError 
                error={error}
            />
            <form onSubmit={handleSubmit}>
                <FormInput
                    placeholder="Введите новый пароль"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    withToggle
                    required
                />
                <FormInput
                    placeholder="Повторите пароль"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    withToggle
                    required
                />
                <FormButton
                    type="submit"
                    value="Изменить пароль"
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
