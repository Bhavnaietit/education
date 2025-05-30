import React from 'react'
import { Outlet } from 'react-router-dom'
import EduNavbar from '../../Components/educator/EduNavbar'
import SideBar from '../../Components/educator/SideBar'
import Footer from '../../Components/educator/Footer'

const Educator = () => {
  return (
		<div className="text-default min-h-screen bg-white">
			<EduNavbar></EduNavbar>
			<div className="flex">
				<div className='flex'><SideBar></SideBar></div>
				<div className='flex-1'>{<Outlet />}</div>
      </div>
      <Footer></Footer>
		</div>
	);
}

export default Educator