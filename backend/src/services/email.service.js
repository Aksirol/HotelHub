// backend/src/services/email.service.js
const nodemailer = require('nodemailer');

const emailService = {
    async sendBookingConfirmation(email, bookingDetails, roomNumber) {
        try {
            // Генеруємо тестовий акаунт Ethereal (ідеально для розробки)
            const testAccount = await nodemailer.createTestAccount();

            // Створюємо "перевізника" (транспорт) для відправки
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, 
                auth: {
                    user: testAccount.user, 
                    pass: testAccount.pass, 
                },
            });

            // Формуємо сам лист
            const info = await transporter.sendMail({
                from: '"HotelHub System" <noreply@hotelhub.com>',
                to: email,
                subject: "✅ Підтвердження бронювання",
                text: `Дякуємо за бронювання! Ваша кімната: ${roomNumber}. Заїзд: ${bookingDetails.check_in.toDateString()}.`,
                html: `
                    <h2>Дякуємо за вибір HotelHub!</h2>
                    <p>Ваше бронювання успішно створено.</p>
                    <ul>
                        <li><b>Кімната:</b> ${roomNumber}</li>
                        <li><b>Дата заїзду:</b> ${bookingDetails.check_in.toDateString()}</li>
                        <li><b>Дата виїзду:</b> ${bookingDetails.check_out.toDateString()}</li>
                        <li><b>Загальна вартість:</b> ${bookingDetails.total_price} грн</li>
                    </ul>
                    <p>Чекаємо на вас!</p>
                `,
            });

            console.log("✉️ Email успішно 'відправлено'!");
            // Ethereal дає спеціальне посилання для перегляду листа в браузері
            console.log("👀 Переглянути лист можна тут: %s", nodemailer.getTestMessageUrl(info));
        } catch (error) {
            console.error("Помилка відправки email:", error);
        }
    }
};

module.exports = emailService;