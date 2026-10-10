import { useEffect, useState } from "react"
import { apiFetch } from "../apiFetch/apiFetch"
import "./DriverFoundMyOrder.css"
export const DriverFoundMyOrder = ({ id, closeWindow }) => {
    const [message, setMessage] = useState('')
    const [foundOrder, setFoundOrder] = useState(null)

    useEffect(() => {

        const ResponseFoundOrder = async () => {
            try {
                const respons = await apiFetch(`/api/driver/my_orders/${id}/`)
                if (respons.status == 401) {
                    setMessage('Повторите авторизацию')
                    return
                }
                if (respons.status == 403) {
                    setMessage('Ошибка доступа')
                    return
                }
                if (!respons.ok) {
                    setMessage('Ошибка запроса')
                    return
                }
                const data = await respons.json()
                setFoundOrder(data)

            } catch (error) {
                setMessage('Ошибка связи')
                console.log(error)
            }
        }
        ResponseFoundOrder()
    }, [id])

    return (<div className="modal-overlay">
        {message ? <p>{message}</p> : foundOrder ? (
            <div className="DriverDetailOrder">
                <button className="close-x" onClick={closeWindow}>x</button>
                <h1>Детали заказа: №{foundOrder.order_id}</h1>
                <p>Дата погрузки: {foundOrder.date_loading}</p>
                <p>Адрес погрузки: {foundOrder.address_load} </p>
                <p>Адрес доставки: {foundOrder.address_delivery}</p>
                <p>Вес груза, тонна: {foundOrder.cargo_weight_tons}</p>
                <p>Объем груза, м3: {foundOrder.cargo_volume_m3}</p>
                <p>Описание груза: {foundOrder.cargo_description}</p>
                <p>Грузчики от перевозчика: {foundOrder.porters?"Да":"Нет"}</p>
                <p>Контакт имя: {foundOrder.contact_name}</p>
                <p>Контакт телефон: {foundOrder.contact_phone}</p>
                <button className="close-window" onClick={closeWindow}>Закрыть окно</button>
            </div>
        ) : (<p>Заказ не найден</p>)
        }
    </div>

    )
}