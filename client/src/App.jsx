import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CoursesList from './pages/student/CoursesList';
import CourseDetails from './pages/student/CourseDetails';
import MyEnrollments from './pages/student/MyEnrollments';
import Player from './pages/student/Player';
import Loading from './Components/student/Loading';
import Educator from './pages/educator/Educator';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import StudentsEnrolled from './pages/educator/StudentsEnrolled';
import Navbar from './Components/student/Navbar';
import EduNavbar from './Components/educator/EduNavbar';
import 'quill/dist/quill.snow.css'
import {ToastContainer,toast} from 'react-toastify'
import Verify from './pages/student/Verify';
import Failed from './Components/student/Failed';
const App = () => {
	const isEducatorRoute=useMatch("/educator/*")
  return (
		<div className="text-default min-h-screen bg-white">
			<ToastContainer />
			{!isEducatorRoute && <Navbar />}
			<Routes>
				{/* get-course-progress */}
				<Route path="/" element={<Home />} />
				<Route path="/course-list" element={<CoursesList />} />
				<Route path="/course-list/:input" element={<CoursesList />} />
				<Route path="/course/:courseId" element={<CourseDetails />} />
				<Route path="/my-enrollments" element={<MyEnrollments />} />
				<Route path="/player/:courseId" element={<Player />} />
				<Route path="/loading/:path" element={<Loading />} />
				<Route path="/verify" element={<Verify />} />
			  <Route path="/failed" element={<Failed/>} />
			  
				<Route path="/educator" element={<Educator />}>
					<Route path="" element={<Dashboard />} />
					<Route path="add-course" element={<AddCourse />} />
					<Route path="my-courses" element={<MyCourses />} />
					<Route path="enrolled-students" element={<StudentsEnrolled />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App