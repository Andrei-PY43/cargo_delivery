import { useState } from "react"
import { ModalWindowAuthoriz } from "./ModalWindowAuthoriz"
import { ModalWindowRegistr } from "./ModalWindowRegistr"
import { useContext } from "react";
import { Channel } from "../context/Wrapper.jsx";
import { NavLink } from "react-router-dom";
export const Header = () => {
    const [openAuthoriz, setOpenAuthoriz] = useState(false)
    const [openRegistr, setOpenRegistr] = useState(false)
    const { user, setUser } = useContext(Channel);
    const handleOpenAuth = () => {
        setOpenAuthoriz(true);
        setOpenRegistr(false)
    }
    const handleCloseAuth = () => {
        setOpenAuthoriz(false)
    }
    const handleOpenReg = () => {
        setOpenRegistr(true);
        setOpenAuthoriz(false)
    }
    const handleCloseReg = () => {
        setOpenRegistr(false)
    }
    const handleLogOut = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token")
        setUser('')
    }

    return (
        <div>

            <nav className="header-nav">
                <NavLink to='/'>Главная</NavLink>
                <NavLink to='/about/'>О нас</NavLink>
                {user ? (user.role === 'client' ?
                    <div>
                        <NavLink to='/client_my_orders_isDone/'>Выполненные заказы</NavLink>;
                        <NavLink to='/creat_my_orders/'>Создать заказ</NavLink>
                    </div> : <NavLink to='/driver_my_orders_isDone/'>Выполненные заказы</NavLink>) : (
                    <NavLink to='/services/'>Услуги</NavLink>
                )}

            </nav>
            {user ? <button onClick={handleLogOut} >выйти</button> : (
                <div>
                    <button onClick={handleOpenAuth} >ВОЙТИ</button>
                    <button onClick={handleOpenReg} >регистрация</button>
                </div>)}

            <div>
                {openAuthoriz && <ModalWindowAuthoriz handleCloseAuth={handleCloseAuth} />}
                {openRegistr && <ModalWindowRegistr handleCloseReg={handleCloseReg} />}
            </div>
        </div>
    )
}