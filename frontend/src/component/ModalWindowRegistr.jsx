import { useState } from "react"
import './ModalWindowRegistr.css'
export const ModalWindowRegistr = ({ handleCloseReg }) => {
    const [userName, setUserName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [userPassword2, setUserPassword2] = useState('')
    const [message, setMessage] = useState('')
    async function handleRegistration(event) {
        event.preventDefault()

        try {
            const registrUser = {
                username: userName,
                phone: userPhone,
                first_name: firstName,
                last_name: lastName,
                email: userEmail,
                password: userPassword,
                password2: userPassword2
            }

            const response = await fetch("http://127.0.0.1:8000/api/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registrUser)
            }
            )
            const data = await response.json()

            if(response.status === 400) {
                setMessage("Проверьте введённые данные")
                console.log(data)
                return
            }

            if (!response.ok) {
                setMessage("Ошибка регистрации")
                return
            }

            console.log("Пользователь зарегистрирован")
            handleCloseReg()
        } catch (error) {
            setMessage("Ошибка связи")
            console.log(error)
        }
    }

    return (
        <div className="modulReg-drop" onClick={handleCloseReg}>
            <div className="modulReg" onClick={(event) => event.stopPropagation()} >
                <div className="message_and_button">
                    <button type="button" className="modulReg-x" onClick={handleCloseReg} > X </button>
                    {message && <p>{message}</p>}
                </div >
                <form onSubmit={handleRegistration}>
                    <label htmlFor="userName">  Логин  </label>
                    <input id="userName" value={userName} onChange={(event) => setUserName(event.target.value) }required />

                    <label htmlFor="firstName"> Имя </label>
                    <input id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value) } required />

                    <label htmlFor="lastName"> Фамилия </label>
                    <input id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value) } required/>

                    <label htmlFor="userPhone"> Телефон </label>
                    <input id="userPhone" value={userPhone} onChange={(event) => setUserPhone(event.target.value)} required/>

                    <label htmlFor="userEmail"> Email </label>
                    <input type="email" id="userEmail" value={userEmail} onChange={(event) => setUserEmail(event.target.value)} />

                    <label htmlFor="userPassword"> Пароль </label>
                    <input type="password" id="userPassword" value={userPassword} onChange={(event) => setUserPassword(event.target.value)} required/>

                    <label htmlFor="userPassword2"> Повторите пароль </label>
                    <input type="password" id="userPassword2" value={userPassword2} onChange={(event) => setUserPassword2(event.target.value)} required/>

                    <button type="submit"> Регистрация </button>

                </form>

            </div>

        </div>
    )
}