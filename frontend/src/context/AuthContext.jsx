import { createContext, useEffect, useState } from "react";
import { apiFetch } from "../apiFetch/apiFetch";

export const Channel = createContext()

export const Wrapper = ({ children }) => {
    const [user, setUser] = useState('')
    const [message, setMessage] = useState('')
    const [load, setLoad] = useState(true)

    useEffect(() => {

        async function getUser() {
            setMessage('')
            try {

                const meResponse = await apiFetch('/api/me/')
                const userData = await meResponse.json()

                if (!meResponse.ok) {

                    console.log("Ошибка получения пользователя:", userData)
                    setMessage('Повторно пройдите авторизацию')
                    return
                }

                setUser(userData)
                setMessage('')
            } catch (error) {
                setMessage("Ошибка связи")
                console.error(error);
            }
            finally {
                setLoad(false)
            }
        }
        getUser()
    }, []);
    return (
        <Channel.Provider value={{ user, setUser, message, load }}>{children}</Channel.Provider>
    )

}