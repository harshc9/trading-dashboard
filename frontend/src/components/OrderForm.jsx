import React, { useState, useEffect, useRef } from 'react';
import { createOrder } from '../services/api';

const OrderForm = ({ onOrderPlaced, availableStocks = [] }) => {
    const [formData, setFormData] = useState({
        symbol: '',
        side: 'buy',
        quantity: '',
        price: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'symbol') {
            if (value.length > 0) {
                const filtered = availableStocks.filter(stock =>
                    stock.symbol.toLowerCase().startsWith(value.toLowerCase())
                );
                setSuggestions(filtered);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }
    };

    const handleSuggestionClick = (stock) => {
        setFormData((prev) => ({
            ...prev,
            symbol: stock.symbol,
            price: stock.price.toFixed(2) // Auto-fill price
        }));
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orderPayload = {
                ...formData,
                quantity: parseInt(formData.quantity, 10),
                price: parseFloat(formData.price),
            };
            await createOrder(orderPayload);
            setFormData({ symbol: '', side: 'buy', quantity: '', price: '' });
            if (onOrderPlaced) onOrderPlaced();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative overflow-hidden bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <div className="p-6 relative z-10">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 flex items-center">
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></span>
                    Place Order
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-5">
                        <div className="group relative" ref={wrapperRef}>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-purple-400 transition-colors">Symbol</label>
                            <input
                                type="text"
                                name="symbol"
                                value={formData.symbol}
                                onChange={handleChange}
                                placeholder="AAPL"
                                autoComplete="off"
                                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-600"
                                required
                            />
                            {/* Autocomplete Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                                    {suggestions.map((stock) => (
                                        <div
                                            key={stock.symbol}
                                            onClick={() => handleSuggestionClick(stock)}
                                            className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex justify-between items-center transition-colors"
                                        >
                                            <span className="font-bold text-white">{stock.symbol}</span>
                                            <span className="text-gray-400 text-sm">${stock.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="group">
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-purple-400 transition-colors">Side</label>
                            <div className="relative">
                                <select
                                    name="side"
                                    value={formData.side}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="group">
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-purple-400 transition-colors">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="0"
                                min="1"
                                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-600"
                                required
                            />
                        </div>
                        <div className="group">
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-purple-400 transition-colors">Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0.01"
                                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-600"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg ${formData.side === 'buy'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-green-500/25 hover:shadow-green-500/40'
                                : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-red-500/25 hover:shadow-red-500/40'
                            } ${loading ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            `${formData.side} ${formData.symbol || 'Stock'}`
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
