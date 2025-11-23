'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email');

    const [email, setEmail] = useState(emailParam || '');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [emailParam]);

    const handleCodeChange = (index: number, value: string) => {
        // Solo permitir números
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus al siguiente input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = pastedData.split('');
        
        // Rellenar con strings vacíos si es necesario
        while (newCode.length < 6) {
            newCode.push('');
        }
        
        setCode(newCode);
        
        // Focus en el último input lleno o el primero vacío
        const lastFilledIndex = newCode.findIndex(c => !c);
        const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
        const input = document.getElementById(`code-${focusIndex}`);
        input?.focus();
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const verificationCode = code.join('');

        if (verificationCode.length !== 6) {
            setError('Por favor ingresa el código completo');
            return;
        }

        if (!email) {
            setError('Email requerido');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(data.message);
                setIsVerified(true);
                
                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error al verificar:', error);
            setError('Error al verificar el código');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            setError('Email requerido');
            return;
        }

        setError('');
        setMessage('');
        setIsResending(true);

        try {
            const res = await fetch('/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage('Código reenviado exitosamente');
                setCode(['', '', '', '', '', '']);
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error al reenviar:', error);
            setError('Error al reenviar el código');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#EBEBEB] flex flex-col items-center pt-12 px-4 font-sans">
            {/* Logo */}
            <Link href="/" className="mb-8">
                <div className="flex items-center gap-1">
                    <div className="font-bold text-3xl tracking-tight text-foreground">HUV</div>
                    <div className="text-sm mt-1 text-primary font-bold">Medical</div>
                </div>
            </Link>

            <div className="max-w-[400px] w-full">
                <div className="bg-white rounded shadow-sm p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-normal text-gray-800 mb-2">Verifica tu email</h1>
                        <p className="text-sm text-gray-600">
                            {email ? (
                                <>Código enviado a <span className="font-medium text-gray-800">{email}</span></>
                            ) : (
                                'Ingresa tu email y código de verificación'
                            )}
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleVerify} className="space-y-6">
                        {/* Email input (si no viene por parámetro) */}
                        {!emailParam && (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        )}

                        {/* Código de verificación */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Código de 6 dígitos
                            </label>
                            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`code-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-11 h-12 text-center text-xl font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        disabled={isLoading || isVerified}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Mensajes */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {message && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{message}</span>
                            </div>
                        )}

                        {/* Botón verificar */}
                        <button
                            type="submit"
                            disabled={isLoading || isVerified || code.join('').length !== 6}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verificando...
                                </>
                            ) : isVerified ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Verificado
                                </>
                            ) : (
                                'Verificar cuenta'
                            )}
                        </button>

                        {/* Reenviar código */}
                        {!isVerified && (
                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={isResending}
                                    className="text-primary hover:text-primary-dark text-sm font-medium transition-colors disabled:text-gray-400"
                                >
                                    {isResending ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
