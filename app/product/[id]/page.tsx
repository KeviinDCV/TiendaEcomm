'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import ProductSection from '@/app/components/ProductSection';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    original_price: number | null;
    stock: number;
    category: string;
    image_url: string;
    is_featured: number;
    rating: number;
    views: number;
    sales_count: number;
    discount_percentage: number;
    images?: { id: number; image_url: string; display_order: number }[];
}

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0); 

    // Construir lista completa de imágenes para la galería
    const galleryImages = product 
        ? [product.image_url, ...(product.images?.map(img => img.image_url) || [])].filter(Boolean)
        : [];

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.product);
                    
                    // Track view
                    fetch(`/api/products/${id}/views`, { method: 'POST' });
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (delta: number) => {
        if (!product) return;
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= product.stock) {
            setQuantity(newQty);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity);
        // Optional: Show a toast notification here
        alert(`¡${quantity} x ${product.name} agregado al carrito!`);
    };

    const handleBuyNow = () => {
        if (!product) return;
        addToCart(product, quantity);
        router.push('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-12 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
                    <Link href="/" className="text-primary hover:underline">Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EDEDED] font-sans text-[#333]">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-[1200px]">
                {/* Breadcrumbs */}
                <nav className="text-sm text-[rgba(0,0,0,.55)] mb-4 flex items-center gap-2 font-normal">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <span className="text-[rgba(0,0,0,.3)]">|</span>
                    <Link href={`/category/${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
                    <span className="text-[rgba(0,0,0,.3)]">|</span>
                    <span className="truncate max-w-[200px]">{product.name}</span>
                </nav>
                {/* Main Product Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Columna Izquierda: Galería e Imágenes (65%) */}
                    <div className="w-full md:w-[65%] p-4 md:p-8 flex gap-4">
                        {/* Miniaturas (Desktop) */}
                        <div className="hidden md:flex flex-col gap-3 w-[60px]">
                            {galleryImages.map((img, i) => (
                                <div 
                                    key={i} 
                                    className={`w-[50px] h-[50px] border-2 rounded overflow-hidden cursor-pointer relative hover:border-primary transition-colors ${activeImage === i ? 'border-primary' : 'border-gray-200'}`}
                                    onMouseEnter={() => setActiveImage(i)}
                                >
                                    {img && <Image src={img} alt="" fill className="object-contain p-0.5" />}
                                </div>
                            ))}
                            
                            {/* Fallback si no hay imágenes (solo 1) */}
                            {galleryImages.length === 0 && (
                                <div className="w-[50px] h-[50px] border-2 border-gray-200 rounded overflow-hidden relative">
                                     <div className="w-full h-full bg-gray-50"></div>
                                </div>
                            )}
                        </div>

                        {/* Imagen Principal */}
                        <div className="flex-1 relative h-[400px] md:h-[600px] flex items-center justify-center">
                            {galleryImages.length > 0 ? (
                                <Image
                                    src={galleryImages[activeImage]}
                                    alt={product.name}
                                    fill
                                    className="object-contain max-w-full max-h-full mix-blend-multiply"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full bg-gray-50 text-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            {product.discount_percentage > 0 && (
                                <span className="absolute top-0 right-0 md:hidden bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    -{product.discount_percentage}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha: Info y Compra (35%) */}
                    <div className="w-full md:w-[35%] border-t md:border-t-0 md:border-l border-[rgba(0,0,0,.1)] p-6 md:p-8 flex flex-col sticky top-0">
                        
                        <div className="mb-4">
                            <span className="text-xs text-[rgba(0,0,0,.55)] mb-2 block">
                                Nuevo | {product.sales_count > 50 ? '+50' : product.sales_count} vendidos
                            </span>
                            <h1 className="text-[22px] font-semibold text-[rgba(0,0,0,.9)] leading-[1.18] break-words mb-2">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-4">
                                <div className="flex text-[#3483fa]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${star <= (product.rating || 0) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs text-[rgba(0,0,0,.55)] ml-1">{product.views} opiniones</span>
                            </div>

                            {/* Precio */}
                            <div className="mb-6">
                                {product.original_price && (
                                    <div className="text-[rgba(0,0,0,.45)] line-through text-xs mb-1">
                                        ${product.original_price.toLocaleString('es-CO')}
                                    </div>
                                )}
                                <div className="flex items-start gap-2">
                                    <span className="text-[36px] font-light text-[rgba(0,0,0,.9)] leading-none">
                                        ${product.price.toLocaleString('es-CO')}
                                    </span>
                                    {product.discount_percentage > 0 && (
                                        <span className="text-[#00a650] text-[18px] font-medium">
                                            {product.discount_percentage}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="text-[14px] text-[rgba(0,0,0,.9)] mt-1">
                                    en <span className="font-medium text-[#00a650]">36x ${(product.price / 36).toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="mt-1">
                                    <Link href="#" className="text-xs text-[#3483fa] hover:underline">Ver los medios de pago</Link>
                                </div>
                            </div>

                            {/* Envío y Devolución */}
                            <div className="space-y-4 mb-8">
                                <div className="flex gap-3">
                                    <div className="mt-1 text-[#00a650]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[#00a650] font-semibold text-[16px] leading-tight">Llega gratis mañana</p>
                                        <p className="text-[rgba(0,0,0,.55)] text-[14px]">Comprando dentro de las próximas 2 h 15 m</p>
                                        <Link href="#" className="text-xs text-[#3483fa] hover:underline">Enviar a mi ubicación</Link>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <div className="mt-1 text-[#00a650]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[#00a650] font-semibold text-[16px] leading-tight">Devolución gratis</p>
                                        <p className="text-[rgba(0,0,0,.55)] text-[14px]">Tienes 30 días desde que lo recibes.</p>
                                        <Link href="#" className="text-xs text-[#3483fa] hover:underline">Conocer más</Link>
                                    </div>
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="mb-6 font-medium text-[16px] text-[rgba(0,0,0,.9)]">
                                Stock disponible
                            </div>

                            {/* Cantidad */}
                            <div className="mb-8">
                                <div className="flex items-center text-[14px]">
                                    <span className="text-[rgba(0,0,0,.9)] mr-2">Cantidad:</span>
                                    <span className="font-bold">{quantity} unidad</span>
                                    <span className="text-[rgba(0,0,0,.25)] mx-1">|</span>
                                    <span className="text-[rgba(0,0,0,.55)]">({product.stock} disponibles)</span>
                                </div>
                                {/* Botones de cantidad simplificados */}
                                <div className="mt-2 flex gap-2">
                                    <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="w-8 h-8 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-50">-</button>
                                    <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock} className="w-8 h-8 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-50">+</button>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="space-y-2 flex flex-col mb-6">
                                <button 
                                    onClick={handleBuyNow}
                                    disabled={product.stock === 0}
                                    className="w-full bg-[#3483fa] hover:bg-[#2968c8] text-white py-3.5 rounded-md font-semibold text-[16px] transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,.12)] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Comprar ahora
                                </button>
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="w-full bg-[rgba(65,137,230,.15)] hover:bg-[rgba(65,137,230,.2)] text-[#3483fa] py-3.5 rounded-md font-semibold text-[16px] transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    Agregar al carrito
                                </button>
                            </div>

                            {/* Garantía y Protección */}
                            <div className="text-[14px] text-[rgba(0,0,0,.55)] space-y-3">
                                <div className="flex gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[rgba(0,0,0,.3)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        12 meses de garantía de fábrica.
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[rgba(0,0,0,.3)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    <div>
                                        <Link href="#" className="text-[#3483fa]">Compra Segura</Link>, recibe el producto que esperabas o te devolvemos tu dinero.
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[rgba(0,0,0,.3)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    <div>
                                        <Link href="#" className="text-[#3483fa]">Puntos HUV</Link>. Sumas {Math.floor(product.price / 2000)} puntos.
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Descripción y Características */}
                <div className="grid grid-cols-1 md:grid-cols-[65%_35%] gap-8 mt-8">
                    <div className="space-y-8">
                        {/* Descripción */}
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <h2 className="text-[24px] font-normal text-[rgba(0,0,0,.9)] mb-6 pb-4 border-b border-[#eee]">Descripción</h2>
                            <div className="text-[20px] text-[rgba(0,0,0,.9)] leading-relaxed whitespace-pre-line">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        {/* Preguntas y Respuestas (Placeholder) */}
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <h2 className="text-[24px] font-normal text-[rgba(0,0,0,.9)] mb-6">Preguntas y respuestas</h2>
                            <div className="mb-6">
                                <h3 className="text-[18px] font-semibold mb-4">Pregúntale al vendedor</h3>
                                <div className="flex gap-3">
                                    <input 
                                        type="text" 
                                        placeholder="Escribe tu pregunta..." 
                                        className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button className="bg-[#3483fa] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#2968c8] transition-colors">
                                        Preguntar
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[18px] font-semibold mb-4">Últimas preguntas</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[16px] mb-1">¿Tienen stock disponible?</p>
                                        <div className="flex items-center gap-2 text-[rgba(0,0,0,.55)] text-[14px]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                            <p>¡Hola! Sí, tenemos stock disponible para entrega inmediata. ¡Esperamos tu compra!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Publicidad o Recomendaciones (Derecha) */}
                    <div className="hidden md:block">
                         {/* Espacio vacío para alinear con el layout */}
                    </div>
                </div>

                {/* Productos Similares */}
                <div className="mt-12">
                    <ProductSection 
                        title="Productos Similares" 
                        config={JSON.stringify({ category: product.category, limit: 4, sortBy: 'views' })} 
                        excludeId={product.id}
                    />
                </div>
            </main>
        </div>
    );
}
