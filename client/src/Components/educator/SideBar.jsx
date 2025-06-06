import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const SideBar = () => {
  const { isEducator } = useContext(AppContext);
  const menuItems = [
		{
			name: "Dashboard",
			path: "/educator",
			icon: assets.home_icon,
		},
		{
			name: "Add Course",
			path: "/educator/add-course",
			icon: assets.add_icon,
		},
		{
			name: "My Courses",
			path: "/educator/my-courses",
			icon: assets.my_course_icon,
		},
		{
			name: "enrolled-students",
			path: "/educator/enrolled-students",
			icon: assets.person_tick_icon,
		},
	];
  return (
		isEducator && (
			<div className=" flex flex-col border border-gray-500 py-2 md:w-64 w-16 border-r  min-h-screen  text-base">
        {menuItems.map((menu, id) => {
          return (
						<NavLink
							key={id}
							to={menu.path}
							end={menu.path === "/educator"}
							className={({ isActive }) =>
								`flex justify-center items-center md:flex-row md:justify-start py-3.5 md:px-10 gap-3 ${
									isActive
										? "bg-indigo-50  border-r-[6px] border-l-[6px] border-indigo-500/90"
										: "hover:bg-gray-100/50 border-r-[6px] border-l-[6px] border-white hover:border-gray-100/90"
								}`
							}>
							<img src={menu.icon} className="w-6 h-6"></img>
							<p className="md:block hidden text-center">{menu.name} </p>
						</NavLink>
					);
        })}
			</div>
		)
	);
}

export default SideBar