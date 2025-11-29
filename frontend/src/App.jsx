import React, { useState } from 'react';
import LivePrices from './components/LivePrices';
import OrderForm from './components/OrderForm';
import OrdersTable from './components/OrdersTable';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [orderRefreshTrigger, setOrderRefreshTrigger] = useState(0);
  const prices = useWebSocket();

  const handleOrderPlaced = () => {
    // Increment trigger to reload orders table
    setOrderRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      {/* Global Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="fixed w-full top-0 z-50 border-b border-white/5 bg-gray-900/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                House of EdTech
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Advanced Trading Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span>Market Open</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-28 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Live Prices (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <LivePrices prices={prices} />

            {/* Market Status Card */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Market Overview <span className="text-xs text-gray-500 font-normal">(Simulated)</span></h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Volume (24h)</span>
                  <span className="text-white font-mono">$42.8B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active Traders</span>
                  <span className="text-white font-mono">12,405</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full w-3/4"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">High trading activity detected in Tech sector.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Form & History (8 cols) */}
          <div className="lg:col-span-8 space-y-8 flex flex-col h-full">
            <OrderForm onOrderPlaced={handleOrderPlaced} availableStocks={prices} />
            <div className="flex-grow">
              <OrdersTable refreshTrigger={orderRefreshTrigger} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} House of EdTech. Real-time Market Simulation.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
