import { createContext, useEffect, useState } from "react";
import { apiFetch } from "../apiFetch/apiFetch";

export const Channel = createContext()

export const Wrapper = ({ children }) => {
    const [user, setUser] = useState('')
    const [message, setMessage] = useState('')
    useEffect(() => {

        async function getUser() {
            const accessToken = localStorage.getItem("access_token")

            if (!accessToken) {
                return
            }
            try{
            const meResponse = await apiFetch('/api/me/')
            const userData = await meResponse.json()

            if (!meResponse.ok) {
                console.log("Ошибка получения пользователя:", userData)
                setMessage('Повторно пройдите авторизацию')
                return
            }

            setUser(userData)
        } catch (error) {
            setMessage("Ошибка связи")
            console.error(error);
        }
        }
        getUser()
    }, []);
    return (
        <Channel.Provider value={{ user, setUser, message }}>{children}</Channel.Provider>
    )

}