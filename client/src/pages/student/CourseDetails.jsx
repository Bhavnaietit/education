import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../Components/student/Footer";
import Youtube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";
const CourseDetails = () => {
	const { courseId } = useParams();
	const {
		calculateRating,
		calChapTime,
		calCourseDurTime,
		calNumOfLectures,
		currency,
		userData,
		backendUrl,
		getToken,
	} = useContext(AppContext);
	const [opneSection, setOpenSection] = useState({});
	const [courseData, setCourseData] = useState(null);
	const [isEnrolled, setIsEnrolled] = useState(false);
	const [playerData, setPlayerData] = useState(null);
	const fetchCourseData = async () => {
		try {
			const { data } = await axios.get(backendUrl + "/api/course/" + courseId);
			if (data.success) {
				setCourseData(data.courseData);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const toggleSection = (index) => {
		setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
	};
	const enrolledCourse = async () => {
		try {
			if (!userData) {
				return toast.warn("Login to Enroll");
			}
			if (isEnrolled) {
				return toast.warn("You already enrolled");
			}
			

			const token = await getToken();
			const { data } = await axios.post(
				backendUrl + "/api/user/purchase",
				{ courseId: courseData._id },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				const { session_url } = data;
				window.location.replace(session_url);
			} else {
				console.log(userData, data);
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};
	useEffect(() => {
		fetchCourseData();
	}, []);

	useEffect(() => {

		if (userData && courseData) {
			console.log(userData)
			setIsEnrolled(userData.enrolledCourses.includes(courseData._id));
		}
	}, [userData, courseData]);
	console.log(userData)
	return courseData ? (
		<>
			<div className="flex md:flex-row flex-col-reverse gap-10 relative items-center justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
				<div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>
				{/* "left-box" */}
				<div className="max-w-xl z-10 text-gray-500">
					<h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
						{courseData.courseTitle}
					</h1>
					<p
						className="pt-4 md:text-base text-sm"
						dangerouslySetInnerHTML={{
							__html: courseData.courseDescription.slice(0, 200),
						}}></p>
					{/*course review & rating */}
					<div className="flex items-center space-x-2 pt-3 pb-1 text-sm ">
						<p>{calculateRating(courseData)}</p>
						<div className="flex">
							{[
								...Array(5)
									.fill(0)
									.map((_, idx) => (
										<img
											key={idx}
											src={
												idx < Math.floor(calculateRating(courseData))
													? assets.star
													: assets.star_blank
											}
											alt="star"
											className="w-3.5 h-3.5"></img>
									)),
							]}
						</div>
						<p className="text-gray-500">
							{courseData.courseRatings.length}
							{courseData.courseRatings.length > 1 ? " ratings" : " rating"}
						</p>
						<p className="text-gray-500">
							{courseData.enrolledStudents.length}
							{courseData.enrolledStudents.length > 1
								? " students"
								: " student"}
						</p>
					</div>
					<p className="text-sm">
						Course By {" "}
						<span className="text-blue-600 underline">
							{ courseData.educator && courseData.educator.name }
						</span>
					</p>
					<div className="pt-8 text-gray-800">
						<h2 className="text-xl font-semibold">Course Structure</h2>
						<div className="pt-5">
							{courseData.courseContent &&
								courseData.courseContent.map((chapter, idx) => {
									return (
										<div
											key={idx}
											className="border border-gray-300 bg-white mb-2 rounded">
											<div
												className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
												onClick={() => {
													toggleSection(idx);
												}}>
												<div className="flex items-center gap-2">
													<img
														src={assets.down_arrow_icon}
														className={`transform transition-transform ${
															opneSection[idx] ? "rotate-180" : ""
														}`}
														alt=""></img>
													<p className="font-medium md:text-base-sm">
														{chapter.chapterTitle}
													</p>
												</div>
												<p className="text-sm md:text-default">
													{chapter.chapterContent.length} lecturs-{" "}
													{calChapTime(chapter)}
												</p>
											</div>
											<div
												className={`overflow-hidden transition-all duration-300 ${
													opneSection[idx] ? "max-h-96" : "max-h-0"
												}`}>
												<ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
													{chapter.chapterContent.map((lecture, i) => {
														return (
															<li
																key={i}
																className="flex items-start gap-2 py-1">
																<img
																	src={assets.play_icon}
																	className="w-4 h-4 mt-1"></img>
																<div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
																	<p>{lecture.lectureTitle}</p>
																	<div className="flex gap-2">
																		{lecture.isPreviewFree && (
																			<p
																				className="text-blue-500 cursor-pointer"
																				onClick={() => {
																					setPlayerData({
																						videoId: lecture.lectureUrl
																							.split("/")
																							.pop(),
																					});
																				}}>
																				Preview
																			</p>
																		)}
																		<p>
																			{humanizeDuration(
																				lecture.lectureDuration * 60 * 100,
																				{ units: ["h", "m"] }
																			)}
																		</p>
																	</div>
																</div>
															</li>
														);
													})}
												</ul>
											</div>
										</div>
									);
								})}
						</div>
					</div>
					<div className="py-20 text-sm md:text-default">
						<h3 className="text-xl font-semibold text-gray-800">
							Course description
						</h3>
						<p
							className="pt-3 rich-text"
							dangerouslySetInnerHTML={{
								__html: courseData.courseDescription,
							}}></p>
					</div>
				</div>
				{/*right-box */}
				<div className="max-w-corse-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w[300px] sm:min-w-[420]">
					{playerData ? (
						<Youtube
							videoId={playerData.videoId}
							opts={{
								playerVars: {
									autoplay: 1,
								},
							}}
							iframeClassName="w-full aspect-video"
						/>
					) : (
						<img src={courseData.courseThumbnail}></img>
					)}
					<div className="p-5">
						<div className="flex items-center gap-2 ">
							<img
								src={assets.time_left_clock_icon}
								alt="time_left_clock_icon"></img>
							<p className="text-red-500">
								<span className="font-semibold">5 days</span> left at this
								price!
							</p>
						</div>
						<div className="flex gap-3 items-center pt-2">
							<p className="text-gray-800 md:text-4xl text-2xl font-semibold">
								{currency}
								{(
									courseData.coursePrice -
									(courseData.discount * courseData.coursePrice) / 100
								).toFixed(2)}
							</p>
							<p className="text-gray-500  md:text-lg line-through">
								{currency}
								{courseData.coursePrice}
							</p>
							<p className="text-gray-500 md:text-lg ">
								{courseData.discount}% off
							</p>
						</div>
						<div className="flex items-center gap-4 pt-2 md:pt-4 text-gray-500 text-sm md:text-default">
							<div className="flex items-center gap-1">
								<img src={assets.star}></img>
								<p>{calculateRating(courseData)}</p>
							</div>
							<div className="h-4 w-px bg-gray-500/40"></div>

							<div className="flex items-center gap-1">
								<img src={assets.time_clock_icon}></img>
								<p>{calCourseDurTime(courseData)}</p>
							</div>
							<div className="h-4 w-px bg-gray-500/40"></div>

							<div className="flex items-center gap-1">
								<img src={assets.lesson_icon}></img>
								<p>{calNumOfLectures(courseData)}lessons</p>
							</div>
						</div>
						<div>
							<button
								className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium"
								onClick={enrolledCourse}>
								{isEnrolled ? "Already Enrolled" : "Enroll Now"}
							</button>
							<div className="pt-6">
								<p className="md:text-xl text-lg font-medium text-gray-800">
									What's in the course?
								</p>
								<ul className="list-disc ml-4 pt-2 text-sm md:text-default text-gray-600">
									<li>free updats.</li>
									<li>Downloadable sorce code.</li>
									<li>Quizzes to test ypur knowledge.</li>
									<li>Certificate.</li>
									<li>Step-by-Step, guidance.</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer></Footer>
		</>
	) : (
		<Loading></Loading>
	);
};

export default CourseDetails;
