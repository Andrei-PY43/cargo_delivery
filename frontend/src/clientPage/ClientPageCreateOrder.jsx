import { useState } from "react"
import { apiFetch } from "../apiFetch/apiFetch"
import "./ClientPageCreateOrder.css"
export const ClientPageCreateOrder = () => {
    const [address_load, setAddress_load] = useState('')
    const [address_delivery, setAddress_delivery] = useState('')
    const [date_loading, setDate_loading] = useState('')
    const [cargo_description, setCargo_description] = useState('')
    const [cargo_weight_tons, setCargo_weight_tons] = useState('')
    const [cargo_volume_m3, setCargo_volume_m3] = useState('')
    const [contact_name, setContact_name] = useState('')
    const [contact_phone, setContact_phone] = useState('')
    const [porters, setPorters] = useState(false)
    const [cargo_Photo, setCargoPhoto] = useState([])
    const [message, setMessage] = useState('')
    const [ID_order, setID_order] = useState(null)
    const createOrder = async (event) => {
        event.preventDefault()
        setMessage('')
        const dataForm = new FormData()

        dataForm.append("address_load", address_load)
        dataForm.append("address_delivery", address_delivery)
        dataForm.append("date_loading", date_loading)
        dataForm.append("cargo_description", cargo_description)
        dataForm.append("cargo_weight_tons", cargo_weight_tons)
        dataForm.append("cargo_volume_m3", cargo_volume_m3)
        dataForm.append("contact_name", contact_name)
        dataForm.append("contact_phone", contact_phone)
        dataForm.append("porters", porters)
        for (const photo of cargo_Photo) {
            dataForm.append("cargo_photo", photo)
        }
        console.log("cargo_weight_tons:", cargo_weight_tons)
        console.log("cargo_volume_m3:", cargo_volume_m3)

        for (const [key, value] of dataForm.entries()) {
            console.log(key, value)
        }
        try {
            const response = await apiFetch('/api/client/order/create/', {
                method: "POST",
                body: dataForm,
            })
            if (response.status === 400) {
                setMessage('Проверьте введённые данные')
                return
            }
            if (response.status === 401) {
                setMessage('Пройдите повторно авторизацию')
                return
            }

            if (response.status === 403) {
                setMessage('Доступ ограничен')
                return
            }

            if (!response.ok) {
                setMessage('Произошла ошибка ')
                return
            }

            const data = await response.json()
            setID_order(data.order_id)
            setAddress_load('')
            setAddress_delivery('')
            setDate_loading('')
            setCargo_description('')
            setCargo_weight_tons('')
            setCargo_volume_m3('')
            setContact_name('')
            setContact_phone('')
            setPorters(false)
            setCargoPhoto([])

        } catch (error) {
            setMessage("Ошибка. Невозможно создать заказ")
            console.error(error)
        }

    }
    return (
        <div className="createOrder">
            <h1 className="create-order-title">Создать заказ</h1>
            <p className="required-info">
                * — обязательные поля
            </p>
            <form className="create-order-form" onSubmit={createOrder}>
                <label htmlFor="date_loading">Дата загрузки</label>
                <input id="date_loading" type="datetime-local" value={date_loading} onChange={(event) => setDate_loading(event.target.value)} />
                <label htmlFor="address_load">Адрес погрузки *</label>
                <input id="address_load" value={address_load} onChange={(event) => setAddress_load(event.target.value)} />
                <label htmlFor="address_delivery">Адрес поставки *</label>
                <input id="address_delivery" value={address_delivery} onChange={(event) => setAddress_delivery(event.target.value)} />
                <label htmlFor="cargo_description">Груз описание</label>
                <input id="cargo_description" value={cargo_description} onChange={(event) => setCargo_description(event.target.value)} />
                <label htmlFor="cargo_weight_tons">Груз вес</label>
                <input id="cargo_weight_tons" value={cargo_weight_tons} title="Вводить через точку, например: 0.3" onChange={(event) => setCargo_weight_tons(event.target.value)} />
                <label htmlFor="cargo_volume_m3">Груз объем</label>
                <input id="cargo_volume_m3" value={cargo_volume_m3} title="Вводить через точку, например: 20.5" onChange={(event) => setCargo_volume_m3(event.target.value)} />

                <div>
                    <span>Грузчики от "CARGO DELIVERY":</span>
                    <input type="radio" id="porters_yes" name="porters" checked={porters === true} onChange={() => setPorters(true)} />
                    <label htmlFor="porters_yes">Да</label>
                    <input type="radio" id="porters_no" name="porters" checked={porters === false} onChange={() => setPorters(false)} />
                    <label htmlFor="porters_no">Нет</label>
                </div>

                <label htmlFor="contact_name">Имя контакта (если нет, то имя заказчика) *</label>
                <input id="contact_name" value={contact_name} onChange={(event) => setContact_name(event.target.value)} />
                <label htmlFor="contact_phone">Телефон контакта (если нет, то телефон заказчика) *</label>
                <input id="contact_phone" value={contact_phone} onChange={(event) => setContact_phone(event.target.value)} />
                <label htmlFor="cargo_Photo">Приложить фотографии груза</label>
                <input id="cargo_Photo" multiple type="file" accept="image/*" onChange={(e) => setCargoPhoto(Array.from(e.target.files))} />
                <button type="submit">Создать заказ</button>
            </form>
            {ID_order &&
                <div className="order-success">
                    <p>Заказ создан! номер заказа №:{ID_order}</p>
                    <p>Ожидайте звонка Администратора для подтверждения заказа</p>
                </div>}
            {message && <p className="create-order-message">{message}</p>}
        </div>
    )
}