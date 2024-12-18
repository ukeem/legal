import React, { useState } from 'react';
import './formInput.scss';

export default function FormInput({
    label,
    placeholder,
    type,
    name,
    value,
    onChange,
    required = false,
    withToggle = false,
}) {
    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = () => {
        if (withToggle) setShowPassword((prev) => !prev);
    };


    return (
        <div className="inputGroup">
            <input
                placeholder={placeholder}
                type={withToggle && showPassword ? 'text' : type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            />
            {(withToggle && value) && (
                <span
                    className="material-symbols-outlined eyePassword"
                    onClick={handleToggle}
                >
                    {showPassword ? 'visibility_off' : 'visibility'}
                </span>
            )}
        </div>
    )
}
