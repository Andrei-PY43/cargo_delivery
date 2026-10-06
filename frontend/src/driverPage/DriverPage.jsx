import { useEffect, useState } from "react"
import { apiFetch } from "../apiFetch/apiFetch"
import { DriverPageFoundOrder } from "../component/DriverFoundOrder"
import "./DriverPage.css"
export const DriverPage = () => {
    const [message, setMessage] = useState('')
    const [dataActive, setDataActive] = useState([])
    const [orderFind, setOrderFind] = useState(null)
    useEffect(() => {

        const getOrdersActive = async () => {
            try {
                const response = await apiFetch('/api/driver/orders/search/')
                if (response.status === 401) {
                    setMessage('Пройдите повторно авторизацию')
                    return
                }

                if (response.status === 403) {
                    setMessage('Ошибка доступа')
                    return
                }

                if (!response.ok) {
                    setMessage('Ошибка запроса')
                    return
                }
                const data = await response.json()
                setDataActive(data)
            } catch (error) {
                setMessage('Ошибка связи')
                console.log(error)
            }
        }
        getOrdersActive()
        const intervalId = setInterval(() => {getOrdersActive()}, 60000)
        return () => {
            clearInterval(intervalId)
        }
    }, [])
    const handleCloseWindow = () => {
        setOrderFind(null)
    }
    const removeOrder = (id) => {
        setDataActive(prev => prev.filter(order => order.order_id !== id))
    }
    return (
        <div className="driver-page">
            {message ? <p className="driver-message">{message}</p> : dataActive.length !== 0?(
                <div className="active-orders-container">
                    <h1 className="active-orders-title">Актуальные заказы</h1>
                    {dataActive?.map(activ => (
                        <div className="active-order" key={activ.order_id}>
                            <p>Заказ №: {activ.order_id}</p>
                            <p>Дата погрузки: {activ.date_loading}</p>
                            <p>Адрес погрузки: {activ.address_load} </p>
                            <p>Адрес доставки: {activ.address_delivery}</p>
                            <p>Количество машин: {activ.free_car}</p>

                            <button className="active-order-button" onClick={() => setOrderFind(activ.order_id)}>Подробнее</button>
                            {orderFind === activ.order_id && <DriverPageFoundOrder id={activ.order_id} handleCloseWindow={handleCloseWindow} removeOrder={removeOrder} />}
                        </div>
                    ))}
                </div>
            ):(<p className="no-active-orders">Заказов нет</p>)}

        </div>

    )
}