import { createContext, useEffect, useState } from "react";
import { dummyCourses, dummyTestimonial } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const currency = import.meta.env.VITE_CURRENCY;
	const navigate = useNavigate();
	const { getToken } = useAuth();
	const { user } = useUser();

	const [allCourses, setAllCourses] = useState([]);
	const [testinomials, setTestinomials] = useState([]);
	const [isEducator, setIsEducator] = useState(true);
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [userData, setUserData] = useState(null);
	// fet all corses
	const fetchAllCourses = async () => {
		// setAllCourses(dummyCourses);
		try {
			const { data } = await axios.get(backendUrl + "/api/course/all");
			if (data.success) {
				setAllCourses(data.courses);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
		setTestinomials(dummyTestimonial);
	};
	// fetch UserData
	const fetchUserData = async () => {
		if (user.publicMetadata.role === "educator") {
			setIsEducator(true);
		}

		try {
			const token = await getToken();
			const { data } = await axios.get(backendUrl + "/api/user/data", {
				headers: { Authorization: `Bearer ${token}` },
			});
			
			if (data.success) {
				setUserData(data.user);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};
	// function to cal avg rating
	const calculateRating = (course) => {
		
		if (course.courseRatings.length === 0) {
			return 0;
		}
		let totalRating = 0;
		course.courseRatings.forEach((rating) => {
			totalRating += rating.rating;
		});
		return Math.floor(totalRating / course.courseRatings.length);
	};
	// course chap time
	const calChapTime = (chapter) => {
		let time = 0;
		chapter.chapterContent.map((lecture) => {
			return (time += lecture.lectureDuration);
		});
		return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
	};

	// course dur for each chapter time
	const calCourseDurTime = (course) => {
		let time = 0;

		course.courseContent.map((chapter) => {
			chapter.chapterContent.map((lecture) => {
				time += lecture.lectureDuration;
			});
		});
		return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
	};

	// cal number of lecture
	const calNumOfLectures = (course) => {

		let totalLectures = 0;
		course.courseContent.forEach((chapter) => {
			if (Array.isArray(chapter.chapterContent)) {
				totalLectures += chapter.chapterContent.length;
			}
		});
		return totalLectures;
	};

	// fecth user enrolled courses
	const fetchUserEnrolledCourses = async () => {
		// setEnrolledCourses(dummyCourses)
		try{
		const token = await getToken();
		const { data } = await axios.get(
			backendUrl + "/api/user/enrolled-courses",
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		if (data.success) {
			setEnrolledCourses(data.enrolledCourses.reverse());
		} else {
			toast.error(data.message);
		}
		
		}
		catch (error) {
			toast.error(error.message);
		 }
	};

	useEffect(() => {
		fetchAllCourses();
	     
	}, []);

	// const logToken = async () => {
		// .log(await getToken());
	// }
	useEffect(() => {
		if (user) {
			// logToken();
			fetchUserEnrolledCourses();
			fetchUserData();
		}
	}, [user]);

	const value = {
		currency,
		allCourses,
		testinomials,
		navigate,
		calculateRating,
		isEducator,
		setIsEducator,
		calChapTime,
		calCourseDurTime,
		calNumOfLectures,
		enrolledCourses,
		fetchUserEnrolledCourses,
		userData,
		backendUrl,
		setUserData,
		getToken,
		fetchAllCourses,
	};

	return (
		<AppContext.Provider value={value}>{props.children}</AppContext.Provider>
	);
};
