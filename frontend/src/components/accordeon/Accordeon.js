import React, { useState } from 'react'

export default function Accordeon({ items }) {

	const [activeIndex, setActiveIndex] = useState(0);

	const handleItemClick = (index) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	return (
		<div
			style={{
				width: '100%',
				borderTop: '1px solid #BDBDBD'
			}}
		>
			{items.map((item, index) => (
				<div
					key={index}
					style={{
						borderBottom: '1px solid #BDBDBD'
					}}
				>
					<div
						onClick={() => handleItemClick(index)}
						style={{
							padding: '16px',
							fontSize: '16px',
							lineHeight: '100%',
							cursor: 'pointer',
							background: activeIndex === index ? '#f0f0f0' : '#fff',
							fontWeight: '600',
							position: 'relative',
							color: activeIndex === index ? '#E65100' : '#212121',
						}}
					>
						{item.title}
						<span
							className="material-symbols-outlined"
							style={{
								position: 'absolute',
								right: '16px',
								top: '16px',
								fontSize: '16px',
								lineHeight: '100%',
								color: '#E65100'
							}}
						>
							{activeIndex === index ? 'remove' : 'add'}
						</span>
					</div>
					{activeIndex === index && (
						<div
							style={{
								height: activeIndex === index ? '100%' : '0px',
								minHeight: '120px',
								overflow: 'hidden',
								transition: 'height .3s ease',
							}}
						>
							<div
								style={{
									padding: '16px',
								}}
							>
								{item.content}
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	)
}
