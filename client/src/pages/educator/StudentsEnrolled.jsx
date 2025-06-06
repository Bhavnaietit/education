import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/student/Loading";
import { dummyStudentEnrolled } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const StudentsEnrolled = () => {
	
	const { backendUrl, isEducator, getToken } = useContext(AppContext);
	const [enrolledStudents, setEnrolledStudents] = useState(null);
	const fetEnrolledStudents = async () => {
		try {
			const token = await getToken();
			const { data } = await axios.get(
				backendUrl + "/api/educator/enrolled-students",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			
			if (data.success) {
				setEnrolledStudents(data.enrolledStudents);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};
	useEffect(() => {
			fetEnrolledStudents();
	}, [isEducator]);
	
	return enrolledStudents ? (
		<div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
			<div className="w-full">
				<h1 className="pb-4 text-lg font-medium">Students Enrolled</h1>
				<div className="flex flex-col max-w-4xl w-full overflow-hidden items-center justify-center  rounded-md bg-white border border-gray-500/20">
					<table className="md:table-auto table-fixed w-full overflow-hidden">
						<thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
							<tr>
								<th className="px-4 py-3 font-semibold truncate">
									No.
								</th>
								<th className="px-4 py-3 font-semibold truncate">
									Student name
								</th>
								<th className="px-4 py-3 font-semibold truncate">
									Course Title
								</th>
								<th className="px-4 py-3 font-semibold truncate">Date</th>
							</tr>
						</thead>
						<tbody className="text-sm text-gray-500">
              {enrolledStudents.map((item, id) => {
                console.log(item)
								return (
									<tr key={id} className="border-b border-gray-500/20">
										<td
											className="	px-4
												py-3
												text-center
												sm:table-cell>">
											{id + 1}
										</td>
										<td className="md:px-4 px-2 py-3 flex items-center space-x-3">
											<img
												src={item.student.imageUrl}
												className="w-9 h-9 rounded-full"></img>
											<span className="truncate">{item.student.name}</span>
										</td>
										<td>
											<span className="truncate hidden md:block">
												{item.courseTitle}
											</span>
										</td>
										<td className="px-4 py-3 truncate">
											{new Date(item.purchaseDate).toLocaleDateString()}
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
};
export default StudentsEnrolled;
