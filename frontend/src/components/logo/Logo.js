import React from 'react'

export default function Logo({ size, margin }) {
	return (
		<img
			src='../../legal.png'
			alt='AIПраво'
			style={{
				width: `${size}px`,
				height: `${size}px`,
				objectFit: 'cover',
				margin: `${margin}`
			}}
		/>
	)
}
