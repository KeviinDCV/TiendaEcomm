import React from 'react';

export default function PaymentStrip() {
    return (
        <div className="bg-white rounded-md shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-full text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                </div>
                <div>
                    <div className="font-bold text-gray-800">Hasta 48 cuotas</div>
                    <div className="text-xs text-primary cursor-pointer hover:underline">Ver más</div>
                </div>
            </div>

            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

            <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-full text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <div>
                    <div className="font-bold text-gray-800">Transferencia desde tu banco</div>
                    <div className="text-xs text-primary cursor-pointer hover:underline">Ver más</div>
                </div>
            </div>

            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

            <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-full text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <div className="font-bold text-gray-800">Paga en efectivo</div>
                    <div className="text-xs text-primary cursor-pointer hover:underline">Ver más</div>
                </div>
            </div>

            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

            <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-full text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <div className="font-bold text-gray-800">Más medios de pago</div>
                    <div className="text-xs text-primary cursor-pointer hover:underline">Ver todos</div>
                </div>
            </div>
        </div>
    );
}
