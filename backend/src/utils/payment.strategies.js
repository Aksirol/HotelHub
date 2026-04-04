// backend/src/utils/payment.strategies.js

// Стратегія для кредитної картки
class CreditCardStrategy {
    process(amount) {
        // У реальному проєкті тут був би запит до Stripe або LiqPay
        console.log(`Обробка платежу на суму ${amount} через Кредитну Картку...`);
        // Імітуємо успішну оплату та генерацію ID транзакції
        return { success: true, transaction_id: 'CC-' + Date.now() };
    }
}

// Стратегія для PayPal
class PayPalStrategy {
    process(amount) {
        console.log(`Обробка платежу на суму ${amount} через PayPal...`);
        return { success: true, transaction_id: 'PP-' + Date.now() };
    }
}

// Стратегія для готівки (наприклад, оплата на рецепції)
class CashStrategy {
    process(amount) {
        console.log(`Фіксація оплати готівкою на суму ${amount}...`);
        return { success: true, transaction_id: 'CASH-' + Date.now() };
    }
}

// Словник усіх доступних стратегій
const paymentStrategies = {
    CREDIT_CARD: new CreditCardStrategy(),
    PAYPAL: new PayPalStrategy(),
    CASH: new CashStrategy()
};

module.exports = paymentStrategies;