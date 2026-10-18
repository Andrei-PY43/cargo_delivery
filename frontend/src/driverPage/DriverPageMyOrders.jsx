import { useEffect, useState } from "react"
import { apiFetch } from "../apiFetch/apiFetch"
import { DriverFoundMyOrder } from "../component/Driver/DriverFoundMyOrder"
import "./Visual/DriverPageMyOrders.css"
import { ChatOrder } from "../component/ChatOrder"

export const DriverPageMyOrders = () => {
    const [message, setMessage] = useState('')
    const [dataMyOrders, setDataMyOrders] = useState([])
    const [detailMyOrder, setDetailMyOrder] = useState(null)
    const [WindowChat, setWindowChat] = useState(null)

    const [messageDone, setMessageDone] = useState('')


    useEffect(() => {
        const asynFunc = async () => {
            try {
                const respons = await apiFetch('/api/driver/my_orders/')
                if (respons.status == 401) {
                    setMessage('Повторите авторизацию')
                    return
                }
                if (respons.status == 403) {
                    setMessage('Вход только для водителей')
                    return
                }
                if (!respons.ok) {
                    setMessage('Ошибка запроса')
                    return
                }
                const data = await respons.json()
                setDataMyOrders(data)
            } catch (error) {
                setMessage('Ошибка связи')
                console.log(error)
            }
        }
        asynFunc()
    }, [])

    const handleDelivery = async (id) => {
        try {
            const response = await apiFetch(`/api/driver/orders/${id}/delivery/`, {
                method: 'PATCH',
            }
            )

            if (response.status === 401) {
                setMessage('Повторите авторизацию')
                return
            }

            if (response.status === 403) {
                setMessage('Вход только для водителей')
                return
            }
            if (response.status === 409) {
                setMessageDone('Не может быть выполнено. Не все автомобили найдены.')
                return
            }
            if (!response.ok) {
                setMessage('Ошибка запроса')
                return
            }

            const data = await response.json()

            console.log(data.message)
            setDataMyOrders(prev => prev.map(order => order.order_id === id ? { ...order, delivery: true } : order))

        } catch (error) {
            setMessage('Ошибка связи')
            console.log(error)
        }
    }
    const closeWindow = () => {
        setDetailMyOrder(null)
    }

    const closeChat = () => {
        console.log('Водитель: закрываем чат. WindowChat:', WindowChat)
        setWindowChat(null)
    }
    console.log('Водительская страница render. WindowChat:', WindowChat)
    return (
        <div>
            {message ? <p>{message}</p> : dataMyOrders.length !== 0 ? (
                <div>
                    {dataMyOrders.map(order => (
                        <div key={order.order_id} className="my_order">

                            <h3>Номер заказа: {order.order_id}</h3>
                            <p>Дата погрузки: {order.date_loading}</p>
                            <p>Адрес погрузки: {order.address_load}</p>
                            <p>Адрес доставки: {order.address_delivery}</p>
                            <p>Контакт телефон: {order.contact_phone}</p>
                            <div>{order.delivery ? (<p>Вы выполнили доставку</p>) : (
                                <button className="my-order-buttons" onClick={() => handleDelivery(order.order_id)}>
                                    Выполнено
                                </button>
                            )}</div>
                            <button onClick={() => setDetailMyOrder(order.order_id)}>Подробнее</button>
                            <button onClick={() =>{
                                console.log('НАЖАТА КНОПКА ОТКРЫТИЯ ЧАТА:', order.order_id)
                                setWindowChat(order.order_id)}}>чат с клиентом</button>
                            { WindowChat=== order.order_id && <ChatOrder closeChat={closeChat} order_id={order.order_id} />}

                    {detailMyOrder === order.order_id && <DriverFoundMyOrder id={order.order_id} closeWindow={closeWindow} />}
                </div>
            ))}

        </div>) : (<p>Заказов нет</p>)
}
{ messageDone && <p>{messageDone}</p> }

        </div >
    )
}