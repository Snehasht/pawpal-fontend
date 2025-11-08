import React from 'react'
import Header from '../components/Header'
import BreedMenu from '../components/BreedMenu'
import RecentPets from '../components/RecentPets'
import Banner from '../components/Banner'


const Home = () => {
  return (
    <div>
    <Header/>
  <BreedMenu />
  <RecentPets />
  <Banner />
    </div>
  )
}

export default Home
