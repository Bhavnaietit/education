import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../Components/student/Footer";
import Youtube from "react-youtube";
import Rating from "../../Components/student/Rating";
import { toast } from "react-toastify";
import axios from "axios";

const Player = () => {
	const { courseId } = useParams();

	const {
		calculateRating,
		calChapTime,
		calCourseDurTime,
		calNumOfLectures,
		currency,
		enrolledCourses,
		fetchUserEnrolledCourses,
		backendUrl,
		getToken,
		userData,
	} = useContext(AppContext);
	const [opneSection, setOpenSection] = useState({});
	const [courseData, setCourseData] = useState(null);
	const [isEnrolled, setIsEnrolled] = useState(false);
	const [playerData, setPlayerData] = useState(null);
	const [progressData, setProgressData] = useState(null);
	const [initialRating, setInitialRating] = useState(0);

	const getCourseData = async () => {
		enrolledCourses.map((course) => {
			if (course._id === courseId) {
				setCourseData(course);
				course.courseRatings.map((item) => {
					if (item.userId === userData._id) {
						setInitialRating(item.rating);
					}
				});
			}
		});
	};
	
	const toggleSection = (index) => {
		setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
	};
	useEffect(() => {
		if (enrolledCourses.length > 0) {
			getCourseData();
		}
		
	}, [enrolledCourses]);

	const markLectureAsCompleted = async (lectureId) => {
		try {
			const token = await getToken();
			const { data } = await axios.post(
				backendUrl + `/api/user/update-course-progress`,
				{ courseId, lectureId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const getCourseProgress = async () => {
		try {
			const token = await getToken();
			const { data } = await axios.post(
				backendUrl + `/api/user/get-course-progress`,
				{ courseId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				setProgressData(data.progressData)
				getCourseProgress();
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};
	const handleRate = async (rating) => {
		try {
			const token = await getToken();
			const { data } = await axios.post(
				backendUrl + `/api/user/add-rating`,
				{ courseId, rating },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				toast.success(data.message);
				fetchUserEnrolledCourses();
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};
	useEffect(() => {
		getCourseProgress()
	},[])

	return courseData? (
		<>
			<div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
				{/* * left  colmn*/}
				<div className="text-gray-800">
					<h2 className="text-xl font-semibold">Course Structure</h2>
					<div className="pt-5">
						{courseData == null ? (
							<Loading></Loading>
						) : (
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
														<li key={i} className="flex items-start gap-2 py-1">
															<img
																src={
																	progressData &&
																	progressData.lectureCompleted.includes(
																		lecture.lectureId
																	)
																		? assets.blue_tick_icon
																		: assets.play_icon
																}
																className="w-4 h-4 mt-1"></img>
															<div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
																<p>{lecture.lectureTitle}</p>
																<div className="flex gap-2">
																	{lecture.lectureUrl && (
																		<p
																			className="text-blue-500 cursor-pointer"
																			onClick={() => {
																				setPlayerData({
																					...lecture,
																					chapter: idx + 1,
																					lecture: i + 1,
																				});
																			}}>
																			Watch
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
							})
						)}
					</div>
					<div className="flex items-center gap-2 py-3 mt-10">
						<h1 className="text-xl font-bold">Rate this course</h1>
						<Rating initialRating={initialRating} onClick={handleRate}></Rating>
					</div>
				</div>
				{/* right column */}
				<div className="md:mt-10">
					{playerData ? (
						<div>
							<Youtube
								videoId={playerData.lectureUrl.split("/").pop()}
								iframeClassName="w-full aspect-video"
							/>
							<div className="flex justify-between items-center mt-1">
								<p>
									{playerData.chapter}.{playerData.lecture}{" "}
									{playerData.lectureTitle}
								</p>
								<button className="text-blue-600" onClick={()=>markLectureAsCompleted(playerData.lectureId)}>
									{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? "Completed" : "Mark completed"}
								</button>
							</div>
						</div>
					) : (
						<img
							src={
								courseData
									? courseData.courseThumbnail
									: assets.file_upload_icon
							}></img>
					)}
				</div>
			</div>
			<Footer></Footer>
		</>
	):<Loading></Loading>;
};

export default Player;
