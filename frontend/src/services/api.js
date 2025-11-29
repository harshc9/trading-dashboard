const API_URL = 'http://localhost:8080';

export const getPrices = async () => {
    const response = await fetch(`${API_URL}/prices`);
    if (!response.ok) {
        throw new Error('Failed to fetch prices');
    }
    return response.json();
};

export const getOrders = async () => {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    return response.json();
};

export const createOrder = async (order) => {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
    }
    return response.json();
};
