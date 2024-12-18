import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmEmail } from '../../services/api';
import Preloader from '../../components/preloader/Preloader';
import LinkButton from '../../components/linkButton/LinkButton';
import './ConfirmedPage.scss'

const ConfirmedPage = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        const confirmRegistration = async () => {
            const token = searchParams.get('token');

            if (!token) {
                navigate('/');
                return;
            }

            setSuccess('');
            setError('');

            try {
                const response = await confirmEmail(token);
                setSuccess(response.message);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        confirmRegistration();
    }, [searchParams, navigate]);

    return (
        <div className="container confirmedPage">
            {isLoading && (
                <Preloader />
            )}
            {!isLoading && error && (
                <h1 className='h2'>{error}</h1>
            )}
            {!isLoading && success && (
                <>
                    <h1 className='h2'>{success}</h1>
                    <LinkButton
                        label='Авторизоваться'
                        link='/login'
                        icon='login'
                    />
                </>
            )}
        </div>
    )
};

export default ConfirmedPage;
