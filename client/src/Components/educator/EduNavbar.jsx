import React from 'react'
import { assets,dummyEducatorData } from '../../assets/assets';
import { Link } from 'react-router-dom'
import { UserButton ,useUser} from '@clerk/clerk-react'
const EduNavbar = () => {
  const educatorData = dummyEducatorData;
  const {user}=useUser()
  return (
		<div className="flex justify-between px-4 md:px-8 border-b border-gray-500 py-3">
			<Link to='/'>
				<img src={assets.logo} className='w-28 lg:w-32'></img>
			</Link>
			<div className="flex gap-5 justify-center items-center text-gray-500 relative">
        <p>Hi {user ? user.fullName : 'Developers'}</p>
        {user?<UserButton></UserButton>:<img className='max-w-8' src={assets.profile_img}></img>}
			</div>
		</div>
	);
}

export default EduNavbar