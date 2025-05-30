import React from 'react'
import { assets } from '../../assets/assets';

const TestimonialCard = ({ testimonial }) => {
    const { image, name, role ,rating,feedback} = testimonial;
    return (
			<div className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_5px_0px] shadow-black/5 overflow-hidden">
				<div className="flex  items-center justify-center gap-4 px-5 py-4 bg-gray-500/10 ">
					<img src={image} alt={name} className="h-12 w-12 rounded-full"></img>
					<div>
						<h1 className="text-lg font-medium text-gray-800">{name}</h1>
						<p className="text-gray-800/80">{role}</p>
					</div>
				</div>
				<div className="p-5 pb-7">
					<div className="flex gap-0.5">
						{[
							...Array(5)
								.fill(0)
								.map((_, idx) => {
									return (
										<img
											className="h-5"
											key={idx}
											src={
												idx < Math.floor(rating)
													? assets.star
													: assets.star_blank
											}
											alt="star"></img>
									);
								}),
						]}
					</div>
					<p className="text-gray-500 mt-5">{feedback}</p>
				</div>
				<a
					href="#"
					className="m-5 text-blue-600 underline">
					{" "}
					Read More
				</a>
			</div>
		);
};

export default TestimonialCard