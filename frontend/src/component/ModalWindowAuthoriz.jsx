import { useContext, useState } from "react"
import { Channel } from "../context/Wrapper.jsx"

export const ModalWindowAuthoriz = ({ handleCloseAuth }) => {
    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const { setUser } = useContext(Channel)
    async function handleAuthorization(event) {
        event.preventDefault()

        try {
            const authUser = {
                username: userName,
                password: userPassword
            }

            const response = await fetch("http://127.0.0.1:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(authUser)
            }
            )

            const data = await response.json()

            if (!response.ok) {
                console.log("Ошибка авторизации:", data)
                return
            }



            localStorage.setItem("access_token", data.access)
            localStorage.setItem("refresh_token", data.refresh)



            const meResponse = await fetch("http://127.0.0.1:8000/api/me/", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${data.access}`
                }
            }
            )

            const userData = await meResponse.json()

            if (!meResponse.ok) {
                console.log("Ошибка получения пользователя:", userData)
                return
            }

            
            setUser(userData)

            handleCloseAuth()

        } catch (error) {
            console.log("Ошибка соединения с сервером:", error)
        }
    }

    return (
        <div className="modulAuth-drop" onClick={handleCloseAuth}>
            <div className="modulAuth" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="modulAuth-x" onClick={handleCloseAuth}> X </button>

                <form onSubmit={handleAuthorization}>

                    <label htmlFor="userName"> Логин </label>
                    <input id="userName" value={userName} onChange={(event) => setUserName(event.target.value)} />

                    <label htmlFor="userPassword"> Пароль </label>
                    <input type="password" id="userPassword" value={userPassword} onChange={(event) => setUserPassword(event.target.value)} />

                    <button type="submit"> Войти </button>

                </form>

            </div>

        </div>
    )
}