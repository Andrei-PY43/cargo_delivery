import { createContext, useEffect, useState } from "react";
import { apiFetch } from "../apiFetch/apiFetch";

const Channel = createContext()

const Wrapper = ({ children }) => {
    const [user, setUser] = useState('')
    const [message, setMessage] = useState('')
    useEffect(() => {

        async function getUser() {
            const meResponse = await apiFetch('/api/me/')
            const userData = await meResponse.json()

            if (!meResponse.ok) {
                console.log("Ошибка получения пользователя:", userData)
                setMessage('Повторно пройдите авторизацию')
                return
            }

            setUser(userData)
        }
        getUser()
    }, []);
    return (
        <Channel.Provider value={{ user, setUser, message }}>{children}</Channel.Provider>
    )

}