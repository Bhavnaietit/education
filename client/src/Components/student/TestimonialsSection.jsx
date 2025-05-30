import React, { useContext } from "react";
import TestimonialCard from "./TestimonialCard";
import { AppContext } from "../../context/AppContext";

const TestimonialsSection = () => {
  const { testinomials } = useContext(AppContext);
  
	return (
		<div className="pb-14 px-8 md:px-0">
			<h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>
			<p className="md:text-base text-gray-500 mt-3">
				Hear from our learners as they share their journeys of
				tranformation,success, and how our platform has made a difference in
				their lives.
			</p>
			<div className="mt-5 grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4">
				{testinomials.map((testimonial, idx) => {
					return (
						<TestimonialCard
							key={idx}
							testimonial={testimonial}></TestimonialCard>
					);
				})}
			</div>
		</div>
	);
};

export default TestimonialsSection;
