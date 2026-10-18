import { useEffect, useState } from "react"
import { apiFetch } from "../apiFetch/apiFetch"
import './Visual/ChatOrder.css'

export const ChatOrder = ({ order_id, closeChat }) => {
    const [dataChat, setDataChat] = useState(null)
    const [messageInput, setMessageInput] = useState('')
    const [messageError, setmessageError] = useState('')

    useEffect(() => {
        console.log('Чат открыт:', order_id)
        let isActive = true
        let handleTime = null

        const getMessage = async () => {
            console.log('GET запускается, заказ:', order_id, 'isActive:', isActive)
            try {
                const response = await apiFetch(`/api/chat/${order_id}/create/`)
                if (!isActive) return
                if (response.status === 401) {
                    setmessageError('Ошибка аутентификации')

                    return
                }

                if (response.status === 403) {
                    setmessageError('Ошибка доступа')

                    return
                }

                if (!response.ok) {
                    setmessageError('Ошибка сервера')
                    runTimer()
                    return
                }

                const data = await response.json()
                setDataChat(data)
                setmessageError('')

                runTimer()

            } catch (error) {
                setmessageError('Ошибка связи с сервером')
                console.log(error)
                runTimer()
            }
        }
        const runTimer = () => {
            if (isActive) {
                handleTime = setTimeout(() => getMessage(), 2000)
            }
        }
        getMessage()

        return () => {
            console.log('Чат закрывается:', order_id)
            isActive = false
            clearTimeout(handleTime)
        }
    }, [order_id])

    const handleMessageInput = async (event) => {
        try {
            event.preventDefault()

            const response = await apiFetch(`/api/chat/${order_id}/save/`, {
                method: 'POST',
                body: JSON.stringify({
                    message: messageInput
                })
            })

            if (response.status === 401) {
                setmessageError('Ошибка аутентификации')
                return
            }

            if (response.status === 403) {
                setmessageError('Ошибка доступа')
                return
            }

            if (!response.ok) {
                setmessageError('Ошибка сервера')
                return
            }

            const data = await response.json()

            setDataChat(prev => ({
                ...prev,
                messages: [...prev.messages, data]
            }))

            setMessageInput('')
            setmessageError('')

        } catch (error) {
            setmessageError('Ошибка связи с сервером')
            console.log(error)
        }
    }
    return (
        <div className="chat-order">
            <div className="chat-header">
                <p>Заказ №{order_id}</p>
                <button onClick={() => {
                    console.log('Нажали крестик заказа:', order_id)
                    closeChat()
                }} className="close-x">X</button>
            </div>
            <div>
                {dataChat !== null && dataChat.messages.map(message => (
                    
                    <div key={message.message_id}>                                          
                        <p>{message.message_user_first_name} {message.message_user_last_name} / {message.message_user_role==='client'?'Клиент':'Водитель'}</p>
                        <p>{message.message_text}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleMessageInput}>
                <input type="text" value={messageInput} onChange={(event) => setMessageInput(event.target.value)} />
                <button type="submit" >ввод</button>
            </form>
            {messageError && <p className="chat-error">{messageError}</p>}


        </div>
    )
}