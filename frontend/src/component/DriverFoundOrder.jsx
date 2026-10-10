import { useEffect, useState } from "react"
import { apiFetch } from "../apiFetch/apiFetch"
import "./DriverFoundOrder.css"
export const DriverPageFoundOrder = ({ id, handleCloseWindow, removeOrder }) => {
    const [message, setMessage] = useState('')
    const [foundOrder, setFoundOrder] = useState(null)

    useEffect(() => {

        const ResponseFoundOrder = async () => {
            try {
                const respons = await apiFetch(`/api/driver/orders/${id}/`)
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



    const buttonTakeFoundOrder = async (id) => {
        try {
            const respons = await apiFetch(`/api/driver/orders/${id}/take/`, {
                method: 'POST'
            })
            if (respons.status === 401) {
                setMessage('Повторите авторизацию')
                return
            }
            if (respons.status === 403) {
                setMessage('Ошибка доступа')
                return
            }
           
            if (!respons.ok) {
                setMessage('Забрать заказ. Ошибка запроса ')
                return
            }
            const data = await respons.json()
            console.log(data.message)

            removeOrder(id)
            handleCloseWindow()



        } catch (error) {
            setMessage('Забрать заказ.Ошибка связи')
            console.log(error)
        }
    }


    return (<div>
        {message ? <p>{message}</p> : foundOrder ? (
            <div className="DriverDetailOrder">
                <button className="close-x" onClick={handleCloseWindow}>x</button>
                <h1>Детали заказа: №{foundOrder.order_id}</h1>
                <p>Дата погрузки: {foundOrder.date_loading}</p>
                <p>Адрес погрузки: {foundOrder.address_load} </p>
                <p>Адрес доставки: {foundOrder.address_delivery}</p>
                <p>Вес груза, тонна: {foundOrder.cargo_weight_tons}</p>
                <p>Объем груза, м3: {foundOrder.cargo_volume_m3}</p>
                <p>Описание груза: {foundOrder.cargo_description}</p>
                <p>Количество машин: {foundOrder.free_car}</p>
                <div className="photo_order_for_driver">
                    {foundOrder.photos.map((photo, index) => (
                        <img key={index} src={`http://127.0.0.1:8000${photo}`} alt="Груз" width="200" />
                    ))}
                </div>
                <button onClick={() => buttonTakeFoundOrder(foundOrder.order_id)}>Забрать заказ</button>

            </div>
        ) : (<p>Заказ не найден</p>)

        }

    </div >

    )
}