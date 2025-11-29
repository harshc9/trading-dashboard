import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/api';

const OrdersTable = ({ refreshTrigger }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                // Sort by timestamp descending (newest first)
                const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setOrders(sortedData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [refreshTrigger]);

    return (
        <div className="relative overflow-hidden bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl h-full">
            <div className="p-6 relative z-10 flex flex-col h-full">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 flex items-center">
                    <span className="w-2 h-8 bg-orange-500 rounded-full mr-3 shadow-[0_0_15px_rgba(249,115,22,0.5)]"></span>
                    Order History
                </h2>

                <div className="overflow-x-auto custom-scrollbar flex-grow">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-gray-900/95 backdrop-blur z-10">
                            <tr className="text-gray-400 border-b border-white/10 text-sm uppercase tracking-wider">
                                <th className="py-4 px-4 font-medium">Time</th>
                                <th className="py-4 px-4 font-medium">Symbol</th>
                                <th className="py-4 px-4 font-medium">Side</th>
                                <th className="py-4 px-4 font-medium">Qty</th>
                                <th className="py-4 px-4 font-medium">Price</th>
                                <th className="py-4 px-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((order) => (
                                <tr key={order.id} className="group hover:bg-white/5 transition-all duration-200">
                                    <td className="py-4 px-4 text-gray-400 text-sm font-mono">
                                        {new Date(order.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="py-4 px-4 font-bold text-white group-hover:text-orange-300 transition-colors">{order.symbol}</td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${order.side === 'buy'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {order.side}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-200 font-mono">{order.quantity}</td>
                                    <td className="py-4 px-4 text-gray-200 font-mono">${order.price.toFixed(2)}</td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center text-blue-400 text-xs font-medium bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                                            Filled
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-500 italic">
                                        No orders placed yet. Start trading!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersTable;
