import './MainPage.css'

export const MainPage = () => {
    return (
        <main className="main-page">
            <section className="hero">
                <h1>Грузоперевозки по  Кирову и области —<br/>надежно, удобно, прозрачно</h1>
                <p className="hero-slogan">За доставку мы отвечаем</p>

                <div className="hero-phone">
                    <span>Звоните:</span>
                    <a href="tel:+79229999999">+7 (922) 999-99-99</a>
                </div>
            </section>

            <section className="how-it-works">
                <h2>Как это работает</h2>
                <div className="steps">
                    <div className="step">
                        <span className="step-num">1</span>
                        <h3>Оставьте заявку</h3>
                        <p>Зарегистрируйтесь, укажите адреса, вес груза, дату загрузки.</p>
                        <p>Наш сотрудник перезвонит для уточнения данных.</p>
                    </div>
                    <div className="step">
                        <span className="step-num">2</span>
                        <h3>Водитель берёт заказ</h3>
                        <p>Проверенный перевозчик приедет в назначенное время</p>
                    </div>
                    <div className="step">
                        <span className="step-num">3</span>
                        <h3>Груз доставлен</h3>
                        <p>Отслеживайте статус и подтверждайте доставку</p>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>Почему выбирают нас</h2>
                <div className="features-grid">
                    <div className="feature">
                        <h3>Надёжно</h3>
                        <p>Проверенные водители с документами</p>
                    </div>
                    <div className="feature">
                        <h3>Удобно</h3>
                        <p>Всё в одном месте: заявка, фото, статус</p>
                    </div>
                    <div className="feature">
                        <h3>Прозрачно</h3>
                        <p>Видите, кто и когда повезёт ваш груз</p>
                    </div>
                </div>
            </section>

            <section className="cta">
                <h2>Нужно перевезти груз?</h2>
                <p>Позвоните нам — подберём машину за пару минут</p>
                <a href="tel:+79229999999" className="btn-primary">
                    +7 (922) 999-99-99
                </a>
            </section>
        </main>
    )
}