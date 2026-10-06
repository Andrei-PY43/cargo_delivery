import { useState, useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import "./Header.css"
import { ModalWindowAuthoriz } from "./ModalWindowAuthoriz"
import { ModalWindowRegistr } from "./ModalWindowRegistr"
import { Channel } from "../context/AuthContext.jsx"


export const Header = () => {
    const navigate = useNavigate()
    const [openAuthoriz, setOpenAuthoriz] = useState(false)
    const [openRegistr, setOpenRegistr] = useState(false)

    const { user, setUser, message } = useContext(Channel)


    const handleOpenAuth = () => {
        setOpenAuthoriz(true)
        setOpenRegistr(false)
    }

    const handleCloseAuth = () => {
        setOpenAuthoriz(false)
    }

    const handleOpenReg = () => {
        setOpenRegistr(true)
        setOpenAuthoriz(false)
    }

    const handleCloseReg = () => {
        setOpenRegistr(false)
    }

    const handleLogOut = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        setUser(null)
        navigate("/")
    }


    return (
        <>
            <header className="header">

                <div className="header-logo"> CARGO DELIVERY </div>
                <nav className="header-nav">
                    {!user ? (
                        <>
                            <NavLink className="nav-link" to="/">Главная</NavLink>
                            <NavLink className="nav-link" to="/about/">О нас</NavLink>
                            <NavLink className="nav-link" to="/services/">Услуги</NavLink>
                        </>
                    ) : user.role === "client" ? (
                        <>
                            <NavLink className="nav-link" to="/client_my_orders/">Мои заказы</NavLink>
                            <NavLink className="nav-link" to="/client_my_orders_isDone/">Выполненные заказы</NavLink>
                            <NavLink className="nav-link" to="/creat_my_orders/">Создать заказ</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink className="nav-link" to="/driver_search_orders/">Активные заказы</NavLink>
                            <NavLink className="nav-link" to="/driver_my_orders/">Мои заказы</NavLink>
                            <NavLink className="nav-link" to="/driver_my_orders_isDone/">Выполненные заказы</NavLink>
                        </>
                    )}

                </nav>


                <div className="header-user">

                    {user ? (
                        <>
                            <span className="header-user-name">{user.first_name} {user.last_name}</span>
                            <button onClick={handleLogOut}>Выйти</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleOpenAuth}>Войти</button>
                            <button onClick={handleOpenReg}>Регистрация</button>
                        </>
                    )}
                </div>
            </header>
            {message && (<p>{message}</p>)}
            {openAuthoriz && (<ModalWindowAuthoriz handleCloseAuth={handleCloseAuth} />)}
            {openRegistr && (<ModalWindowRegistr handleCloseReg={handleCloseReg} />)}
        </>
    )
}