import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/student/Loading";
import { toast } from 'react-toastify';
import axios from 'axios';

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
	const fetCourses = async () => {
		try {
			const token = await getToken();
			const { data } = await axios.get(backendUrl + '/api/educator/my-courses', { headers: { Authorization: `Bearer ${token}` } });

			if (data.success) {
				setCourses(data.courses);

			} else {
				toast.error(data.message)
			}
		} catch (error) {
			toast.error(error.message)
	  }
  }
	useEffect(() => {
		if (isEducator) {
			fetCourses();
	  }
  },[isEducator])
  return courses ? (
		<div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
			<div className="w-full">
				<h1 className="pb-4 text-lg font-medium">My Courses</h1>
				<div className="flex flex-col max-w-4xl w-full overflow-hidden items-center justify-center  rounded-md bg-white border border-gray-500/20">
					<table className="md:table-auto table-fixed w-full overflow-hidden">
						<thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
							<tr>
								<th className="px-4 py-3 font-semibold truncate">
									All Courses
								</th>
								<th className="px-4 py-3 font-semibold truncate">Earnings</th>
								<th className="px-4 py-3 font-semibold truncate">Students</th>
								<th className="px-4 py-3 font-semibold truncate">
									Published On
								</th>
							</tr>
						</thead>
						<tbody className="text-sm text-gray-500">
							{courses.map((course, id) => {
								return (
									<tr key={id} className="border-b border-gray-500/20">
										<td className="md:px-4 pl-2 md:pl-4  py-3 flex items-center space-x-3 truncate">
											<img
												src={course.courseThumbnail}
												alt="course Image"
												className="w-16"></img>
											<span className="truncate hidden md:block">
												{course.courseTitle}
											</span>
										</td>

										<td className="px-4 py-3">
											{currency}
											{Math.floor(
												course.enrolledStudents.length *
													(course.coursePrice -
														(course.discount * course.coursePrice) / 100)
											)}
										</td>
										<td className="px-4 py-3 truncate">
											{course.enrolledStudents.length}
										</td>
										<td className="px-4 py-3 truncate">
											{new Date(course.createdAt).toLocaleDateString()}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	) : (
		<Loading />
	);
}

export default MyCourses