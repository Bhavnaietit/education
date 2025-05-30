import React from 'react'
import Hero from '../../Components/student/Hero'
import Companies from '../../Components/student/Companies'
import CourseSection from '../../Components/student/CourseSection'
import TestimonialsSection from '../../Components/student/TestimonialsSection'
import CallToAction from '../../Components/student/CallToAction'
import Footer from '../../Components/student/Footer'


const Home = () => {

  return (
    <div className='flex flex-col items-center justify-center space-y-7'>
      <Hero></Hero>
      <Companies></Companies>
      <CourseSection></CourseSection>
      <TestimonialsSection></TestimonialsSection>
      <CallToAction></CallToAction>
      <Footer></Footer>
    </div>
  )
}

export default Home