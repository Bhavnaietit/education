import React, { useContext, useEffect, useState } from "react";
import { assets, dummyDashboardData } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/student/Loading";
import { toast } from "react-toastify";
import axios from "axios";
const Dashboard = () => {
	const [dashboardData, setDashboardData] = useState(null);
const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
	const fetchDashboardData = async () => {
		try {
			const token = await getToken();
			const { data } = await axios.get(
				backendUrl + "/api/educator/dashboard",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (data.success) {
				setDashboardData(data.dashboardData);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
		
	};
	useEffect(() => {
		if (isEducator) {
			fetchDashboardData();
		}
	}, [isEducator]);
	return dashboardData ? (
		<div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
			<div className="space-y-5">
				{/** top */}
				<div className="flex flex-wrap gap-5 items-center">
					<div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
						<img src={assets.appointments_icon}></img>
						<div>
							<span className="text-2xl text-gray-600 font-medium">
								{currency}
								{dashboardData.totalCourses}
							</span>
							<p className="text-gray-500/90">Total Courses</p>
						</div>
					</div>

					<div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
						<img src={assets.patients_icon}></img>
						<div>
							<span className="text-2xl text-gray-600 font-medium">
								{currency}
								{dashboardData.enrolledStudentsData.length}
							</span>
							<p className="text-gray-500/90">Total Enrolments</p>
						</div>
					</div>

					<div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
						<img src={assets.earning_icon}></img>
						<div>
							<span className="text-2xl text-gray-600 font-medium">
								{currency}
								{dashboardData.totalEarnings}
							</span>
							<p className="text-gray-500/90">Total Earnings</p>
						</div>
					</div>
				</div>
				{/* bottom */}
				<div>
					<h2 className="pb-4 text-lg font-medium">Latest Enrolments</h2>
					<div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
						<table className="table-fixed md:table-auto w-full overflow-hidden">
							<thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
								<tr>
									<th className="px-4 py-3 font-semibold hidden text-center sm:table-cell">#</th>
									<th className="px-4 py-3 font-semibold">Student Name</th>
									<th className="px-4 py-3 font-semibold">Course Title</th>
								</tr>
							</thead>
							<tbody className="text-sm text-gray-500">
								{dashboardData.enrolledStudentsData.map((data, id) => {
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
													src={data.student.imageUrl}
													className="w-9 h-9 rounded-full"></img>
												<span className="truncate">{data.student.name}</span>
											</td>
											<td className="px-4 py-3 truncate">{data.courseTitle}</td>
										</tr>
									);
								})}
							</tbody>
							<tfoot></tfoot>
						</table>
					</div>
				</div>
			</div>
		</div>
	) : (
		<Loading></Loading>
	);
};

export default Dashboard;
