import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";
import { AppContext } from "../../context/AppContext";

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);
	return (
		<div className="py-16 md:px-40 px-8 flex justify-center flex-col items-center">
			<h2 className="text-3xl font-medium text-gray-800">
				Learn from the best
			</h2>
			<p className="text-sm md:text-base text-gray-500 mt-5 mb-5">
				{" "}
				Discover our top-related courses across various categories. From coding
				and design to business and wellness, our courses are crafted to deliver
				results.
			</p>

			{/* course card */}
			<div className="mt-5 grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4">
				{allCourses.slice(0, 4).map((course, idx) => {
					return <CourseCard key={idx} course={course}></CourseCard>;
				})}
			</div>
			<Link
				to={"/course-list"}
				onClick={() => {
					scrollTo(0, 0);
				}}
				className="text-green-600 border boreder-gray-500/30  px-10 py-3 rounded  ">
				Show all courses
			</Link>
		</div>
	);
};

export default CourseSection;
