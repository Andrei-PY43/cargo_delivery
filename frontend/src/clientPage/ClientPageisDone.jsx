import { useEffect, useState } from "react"
import { apiFetch } from "../apiFetch/apiFetch"
import './ClientPageisDone.css'

export const ClientPageisDone = () => {
    const [message, setMessage] = useState('')
    const [ordersDone, setOrdersDone] = useState([])

    useEffect(() => {
        const getOrdersDone = async () => {
            try {
                const respons = await apiFetch('/api/client/orders/done/')
                if (respons.status === 401) {
                    setMessage('Повторите авторизацию')
                    return
                }
                if (respons.status === 403) {
                    setMessage('Ошибка доступа')
                    return
                }
                if (!respons.ok) {
                    setMessage('Ошибка запроса')
                    return
                }
                const data = await respons.json()
                setOrdersDone(data)

            } catch (error) {
                setMessage('Ошибка связи')
                console.log(error)
            }
        }
        getOrdersDone()

    }, [])
    
    return (<div className="driver-page">
        {message ? <p className="driver-message">{message}</p> : ordersDone.length !== 0 ? (
            <div className="active-orders-container">
                
                {ordersDone?.map(activ => (
                    <div className="active-order" key={activ.order_id}>
                        <p>Заказ №: {activ.order_id}</p>
                        <p>Дата погрузки: {activ.date_loading}</p>
                        <p>Адрес погрузки: {activ.address_load} </p>
                        <p>Адрес доставки: {activ.address_delivery}</p>
                    </div>
                ))}
            </div>
        ) : (<p className="no-active-orders">Заказов нет</p>)}

    </div>

    )
}