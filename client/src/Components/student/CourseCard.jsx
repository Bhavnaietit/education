import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency , calculateRating} = useContext(AppContext);
  const { courseThumbnail, courseTitle, coursePrice, discount, courseRatings } =
		course;
  
	return (
    <Link to={'/course/' + course._id} onClick={() => {
      scrollTo(0, 0);
    }} className=" border border-gray-500/30 pb-6 overflow-hidden rounded-lg" key={courseTitle}>
			<img  src={courseThumbnail} className="w-full"></img>
			<div className="p-3 text-left">
				<h3 className=" text-base font-semibold">{courseTitle}</h3>
        <p className="text-gray-500">grate</p>
				<div className="flex items-center space-x-2">
          <p>{calculateRating(course)}</p>
					<div className="flex">
            {[...Array(5).fill(0).map((_, idx) => <img src={idx < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt="star" key={idx} className="w-3.5 h-3.5"></img>)]
            }
          </div>
          <p className="text-gray-500">{courseRatings.length}</p>
        </div> 
        <p className="text-base font-semibold text-gray-800">{currency}{(coursePrice- discount*coursePrice/100).toFixed(2)}</p>
			</div>
		</Link>
	);
};

export default CourseCard;
