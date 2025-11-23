'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { products } from '../data/products';

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'bot';
};

export default function AiAssistant() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: '¡Hola! Soy el asistente inteligente de HUV. Puedo ayudarte a buscar productos, consultar precios o resolver dudas sobre envíos. ¿Qué necesitas hoy?', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    // No mostrar el chatbot en rutas administrativas
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const toggleOpen = () => {
        // @ts-ignore - View Transitions API is new
        if (!document.startViewTransition) {
            setIsOpen(prev => !prev);
            return;
        }

        // @ts-ignore
        document.startViewTransition(() => {
            setIsOpen(prev => !prev);
        });
    };

    const renderMessageText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return <strong key={index}>{boldText}</strong>;
            }
            return part.split('\n').map((line, lineIndex, arr) => (
                <span key={`${index}-${lineIndex}`}>
                    {line}
                    {lineIndex < arr.length - 1 && <br />}
                </span>
            ));
        });
    };

    const generateSmartResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();

        // 1. Product Search Logic
        if (lowerQuery.includes('precio') || lowerQuery.includes('costo') || lowerQuery.includes('vale') || lowerQuery.includes('buscar') || lowerQuery.includes('tienen')) {
            const foundProduct = products.find(p =>
                lowerQuery.includes(p.name.toLowerCase()) ||
                lowerQuery.includes(p.category.toLowerCase()) ||
                p.name.toLowerCase().split(' ').some(word => word.length > 3 && lowerQuery.includes(word))
            );

            if (foundProduct) {
                return `El **${foundProduct.name}** tiene un precio de **$${foundProduct.price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}**. \n\n${foundProduct.description}\n\n¿Te gustaría agregarlo al carrito?`;
            }

            if (lowerQuery.includes('monitor')) return "Tenemos el Monitor HUV-2000 disponible. ¿Quieres ver sus detalles?";
            if (lowerQuery.includes('desfibrilador') || lowerQuery.includes('dea')) return "Sí, contamos con el DEA Pro. Es uno de nuestros equipos más vendidos.";

            return "No encontré ese producto específico, pero tenemos una amplia gama de equipos médicos. ¿Podrías ser más específico?";
        }

        // 2. Support Logic
        if (lowerQuery.includes('envio') || lowerQuery.includes('entrega') || lowerQuery.includes('llegar')) {
            return "Realizamos envíos a todo el país. Para equipos en stock, la entrega es de 24 a 48 horas hábiles. El envío es gratuito en compras superiores a $5.000.000.";
        }

        if (lowerQuery.includes('garantia') || lowerQuery.includes('soporte')) {
            return "Todos nuestros equipos cuentan con garantía extendida de 2 años y soporte técnico especializado 24/7 certificado por ISO 13485.";
        }

        if (lowerQuery.includes('hola') || lowerQuery.includes('buenos')) {
            return "¡Hola! ¿En qué puedo asesorarte hoy?";
        }

        if (lowerQuery.includes('gracias')) {
            return "¡Con gusto! Estamos para servirte.";
        }

        // 3. Fallback
        return "Entiendo. Para esa consulta específica, te recomiendo contactar a un asesor humano al 01-8000-HUV-MED o escribirnos a soporte@huv.com. ¿Te ayudo con algo más del catálogo?";
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate processing delay
        setTimeout(() => {
            const responseText = generateSmartResponse(newUserMessage.text);
            const botResponse: Message = {
                id: Date.now() + 1,
                text: responseText,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
                    {/* Header */}
                    <div className="bg-primary p-4 flex justify-between items-center text-white shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Asistente HUV</h3>
                                <span className="text-xs text-blue-100 flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Inteligencia Activa
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'
                                        }`}
                                >
                                    <div>
                                        {renderMessageText(msg.text)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="ai-chat-input"
                                name="message"
                                autoComplete="off"
                                aria-label="Mensaje para el asistente"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Pregunta por precios, equipos..."
                                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 transition-all"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="bg-primary hover:bg-primary-dark text-white p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => toggleOpen()}
                className={`${isOpen ? 'bg-gray-600 rotate-90' : 'bg-primary hover:bg-primary-dark'
                    } text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center z-50`}
                aria-label="Abrir asistente"
                style={{ viewTransitionName: 'chatbot-button' } as React.CSSProperties}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                )}
            </button>
        </div>
    );
}
