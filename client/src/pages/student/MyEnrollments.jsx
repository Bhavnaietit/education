import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Footer from "../../Components/student/Footer";
import {Line} from 'rc-progress'
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

const MyEnrollments = () => {
	const {
		enrolledCourses,
		navigate,
		calCourseDurTime,
		userData,
		backendUrl,
		getToken,
		fetchUserEnrolledCourses,
		calNumOfLectures,
	} = useContext(AppContext);
	const [progressData, setProgressData] = useState([]);

	const getCourseProgress = async () => {
		try {
			const token = await getToken();
			const tempProgressArray = await Promise.all(enrolledCourses.map(async (course) => {
				const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`, { courseId: course._id }, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				let totalLectures = calNumOfLectures(course);
				const lectureCompleted = data.progressData
					? data.progressData.lectureCompleted.length
					: 0;
				return { totalLectures, lectureCompleted };

			})
		)
		setProgressData(tempProgressArray);
				
		} catch (error) {
			toast.error(error.message);
		}
	}
	useEffect(() => {
		if (userData) {
			fetchUserEnrolledCourses();
		}
	}, [userData]);

	useEffect(() => {
		if (enrolledCourses.length>0) {
			getCourseProgress();
		}
	}, [enrolledCourses]);
 
	return (
		<>
			<div className="md:px-36 px-8 pt-10">
				<h1 className="text-2xl font-semibold"> My Enrollments</h1>
				<table className=" md:table-auto table-fixed w-full overflow-hidden border mt-10">
					<thead
						className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
						<tr>
							<th className="px-4 py-3 font-semibold truncate">Course</th>
							<th className="px-4 py-3 font-semibold truncate">Duration</th>
							<th className="px-4 py-3 font-semibold truncate">Completed</th>
							<th className="px-4 py-3 font-semibold truncate">Status</th>
						</tr>
					</thead>
					<tbody>
						{enrolledCourses.map((course, idx) => {
							return (
								<tr key={idx} className="border-b border-gray-500/20 ">
									<td className="md:px-4  pl-3 md:pl-2 py-4  flex items-center space-x-3">
										<img
											src={course.courseThumbnail}
											alt=""
											className="w-14 sm:w-20 md:w-24"></img>
										<div className="flex-1 ">
											<p className="mb-1 max-sm:text-sm">
												{course.courseTitle}
												
													<Line
														strokeWidth={8}
														percent={
															progressData[idx] &&
															(progressData[idx].lectureCompleted /
																progressData[idx].totalLectures) *
																100
														}
														className="bg-gray-300 rounded-full lg:h-2 lg:w-full"></Line>
												
											</p>
										</div>
									</td>
									<td className="px-4 py-3 max-sm:hidden">
										{calCourseDurTime(course)}
									</td>
									<td className="px-4 py-3 max-sm:hidden">
										{progressData[idx] &&
											` ${progressData[idx].lectureCompleted}/${progressData[idx].totalLectures}`}
										<span> Lectures</span>
									</td>
									<td className="px-4 py-3 max-sm:text-right">
										<button
											onClick={() => {
												navigate("/player/" + course._id);
											}}
											className="px-3 sm:px-5 py-1.5 sm:py-2 rounded bg-blue-500 max-sm:text-xs text-white">
											{progressData[idx] &&
											progressData[idx].lectureCompleted ==
												progressData[idx].totalLectures
												? "Completed"
												: "On Going"}
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<Footer></Footer>
		</>
	);
};

export default MyEnrollments;
