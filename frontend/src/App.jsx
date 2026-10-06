
import { useContext } from "react";
import { Channel } from "./context/AuthContext.jsx";
import './App.css'
import { Header } from './component/Header'
import { Routes, Route } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { AboutPage } from './pages/AboutPage'
import { ServicesPage } from './pages/ServicesPage'
import { ClientPage } from './clientPage/ClientPage.jsx';
import { DriverPage } from './driverPage/DriverPage.jsx';
import { ClientPageisDone } from './clientPage/ClientPageisDone.jsx';
import { ClientPageCreateOrder } from './clientPage/ClientPageCreateOrder.jsx';
import { DriverPageisDone } from './driverPage/DriverPageisDone.jsx';

import { NoFound } from './pages/NoFound.jsx';
import { DriverPageMyOrders } from "./driverPage/DriverPageMyOrders.jsx";

function App() {
  const{user}=useContext(Channel)

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/about/' element={<AboutPage />} />
        <Route path='/services/' element={<ServicesPage />} />

        {user?.role === 'client' && (
          <>
            <Route path='/client_my_orders/' element={<ClientPage />} />
            <Route path='/client_my_orders_isDone/' element={<ClientPageisDone />} />
            <Route path='/creat_my_orders/' element={<ClientPageCreateOrder />} />
            
          </>
        )}
        {user?.role === 'driver' && (
          <>
            <Route path='/driver_search_orders/' element={<DriverPage />} />
            <Route path='/driver_my_orders/' element={<DriverPageMyOrders/>}/>
            <Route path='/driver_my_orders_isDone/' element={<DriverPageisDone />} />
            
           
          </>)}

        <Route path='*' element={<NoFound />} />
      </Routes>
    </>
  )
}

export default App
