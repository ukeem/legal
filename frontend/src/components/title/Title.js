import React from 'react'
import './title.scss'

export default function Title({ text, size }) {
	return (
		<h1
			className='title'
			style={{
				fontSize: `${size}px`,
				marginBottom: `${size}px`
			}}
		>
			{text}
		</h1>
	)
}
