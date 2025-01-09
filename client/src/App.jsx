import { useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import LoginPageComp from './pages/login/login_page';
import HomePageComp from './pages/home/home_page';
import RegisterPageComp from './pages/register/register_page';



const App = () => {

  return (

    <>
      <Routes>
        <Route path={'/'} element={<LoginPageComp />} />
        <Route path={'/register'} element={<RegisterPageComp />} />
        <Route path={'/home'} element={<HomePageComp />} />
      </Routes>
    </>

  )
};

export default App;
