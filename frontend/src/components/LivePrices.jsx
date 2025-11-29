import React from 'react';

const LivePrices = ({ prices }) => {

    return (
        <div className="relative overflow-hidden bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            {/* Background Gradient Blob */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="p-6 relative z-10">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 flex items-center">
                    <span className="w-2 h-8 bg-blue-500 rounded-full mr-3 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
                    Live Market Data
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 border-b border-white/5 text-sm uppercase tracking-wider">
                                <th className="py-4 px-4 font-medium">Symbol</th>
                                <th className="py-4 px-4 font-medium">Price</th>
                                <th className="py-4 px-4 font-medium">Change (24h)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {prices.map((stock) => (
                                <tr key={stock.symbol} className="group hover:bg-white/5 transition-all duration-300">
                                    <td className="py-4 px-4 font-bold text-white group-hover:text-blue-300 transition-colors">
                                        {stock.symbol}
                                    </td>
                                    <td className="py-4 px-4 text-gray-200 font-mono tracking-wide">
                                        ${stock.price.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline - flex items - center px - 2.5 py - 0.5 rounded - full text - xs font - medium border ${stock.last_change >= 0
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]'
                                            } `}>
                                            {stock.last_change >= 0 ? '▲' : '▼'}
                                            <span className="ml-1">{Math.abs(stock.last_change).toFixed(2)}%</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {prices.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="py-12 text-center text-gray-500 italic">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                            <span>Connecting to live feed...</span>
                                        </div>
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

export default LivePrices;
