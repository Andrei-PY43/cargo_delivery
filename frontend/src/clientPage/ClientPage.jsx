import { useEffect, useState } from "react"
import { apiFetch } from "../apiFetch/apiFetch"
import "./ClientPage.css"
export const ClientPage = () => {

    const [dataClientOrders, setClientOrders] = useState([])
    const [message, setMessage] = useState('')
    useEffect(() => {
        const getOrdersClient = async () => {
            try {
                const response = await apiFetch('/api/client/orders/')
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
                setClientOrders(data)
            } catch (error) {
                setMessage('Ошибка связи')
                console.log(error)
            }
        }
        getOrdersClient()
    }, [])
    return (
        <div className="client-page">
            {message ? <p className="client-message">{message}</p> : dataClientOrders.length !== 0 ? (
                <div className="orders-container">
                    <h1 className="orders-title">Мои заказы:</h1>
                    {dataClientOrders.map(order =>
                        <div key={order.order_id} className="order-card">
                            <div className="order-header">
                                <h2>Заказ №{order.order_id}</h2>
                                <span className="order-status">{order.status}</span>
                            </div>
                            <div className="order-info">
                                <p>Дата погрузки: {order.date_loading}</p>
                                <p>Адрес погрузки: {order.address_load}</p>
                                <p>Адрес доставки: {order.address_delivery}</p>
                                <p>Предоставить грузчиков: {order.porters ? "ДА" : "НЕТ"}</p>
                                <p>СТАТУС: {order.status}</p>
                                <p>Описание груза: {order.cargo_description}</p>
                            </div>
                            <div className="drivers-section">
                                <p>Водители: </p>
                                {order.drivers.map(driver =>
                                    <div key={driver.driver_id} className="driver-card">
                                        <p>{driver.first_name}</p>
                                        <p>{driver.last_name}</p>
                                        <p>{driver.phone}</p>
                                        <p>{driver.vehicle_model}</p>
                                        <p>{driver.vehicle_number}</p>
                                        <img src={`http://127.0.0.1:8000${driver.vehicle_photo}`} className="vehicle-photo" alt="Машина" width="200" />

                                    </div>
                                )}
                            </div>


                        </div>

                    )}
                </div>) : (
                <p>Заказов нет</p>
            )}

        </div>
    )
}