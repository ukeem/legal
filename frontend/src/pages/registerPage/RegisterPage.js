import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.scss'
import FormInput from '../../components/formInput/FormInput';
import FormError from '../../components/formError/FormError';
import FormButton from '../../components/formButton/FormButton';
import { registerUser } from '../../services/api';

const RegisterPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // setError('');
        setIsLoading(true);
        
        try {
            const response = await registerUser(formData);
            // const result = JSON.parse(response)
            console.log(response); // Логируем ответ для проверки
            
            navigate(`/confirm?e=${encodeURIComponent(response.message)}`);
        } catch (err) {
            setError(err.message);
            console.log(err.message);
        } finally {
            setIsLoading(false); // Выключаем лоадер
        }
    };
    
    

    return (
        <div className='container'>
            <h1 className='h1' style={{margin: 0}}>Регистрация</h1>
            <FormError 
                error={error}
            />
            <form onSubmit={handleSubmit}>
                <FormInput
                    placeholder="Введите Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    placeholder="Придумайте пароль"
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
                    value="Зарегистрироваться"
                    isLoading={isLoading}
                    disabled={isLoading}
                />
            </form>
            <div className='underForm'>
                <a href="/login">Авторизоваться</a>
                <a href="/reset-password">Сбросить пароль</a>
            </div>
        </div>
    );
};

export default RegisterPage;
