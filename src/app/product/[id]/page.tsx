'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ShoppingCart, ArrowRight, ShieldCheck, Truck, Star, Info, Minus, Plus, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { PRODUCTS } from '../../page';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [product, setProduct] = useState<any>(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    // Load Product
    const savedProducts = localStorage.getItem('kosa_products');
    let allProducts = PRODUCTS;
    if (savedProducts) {
       try { allProducts = JSON.parse(savedProducts); } catch(e) {}
    }
    const found = allProducts.find(p => p.id === id);
    setProduct(found);

    // Load Cart
    const savedCart = localStorage.getItem('kosa_cart');
    if (savedCart) {
       try { setCart(JSON.parse(savedCart)); } catch(e) {}
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    let newCart;
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
       newCart = cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + productQuantity } : item);
    } else {
       newCart = [...cart, { ...product, quantity: productQuantity }];
    }
    
    setCart(newCart);
    localStorage.setItem('kosa_cart', JSON.stringify(newCart));
  };

  if (product === null) return <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-sans text-xl font-bold">جاري التحميل...</div>;
  if (product === undefined) return <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-sans text-xl font-bold">المنتج غير موجود</div>;

  const currentPrice = product.discountPrice || product.price;

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-right" dir="rtl">
      {/* Simple Header */}
      <nav className="bg-black text-white h-20 flex items-center border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
           <div className="flex gap-4 items-center">
              <button onClick={() => router.push('/')} className="hover:text-amber-500 transition-colors bg-white/10 p-3 rounded-full">
                 <ArrowRight size={20} />
              </button>
              <img src="/logo/logo.png" alt="KOSA" className="h-12 w-auto" />
           </div>
           <button onClick={() => router.push('/?cart=true')} className="p-3 bg-amber-500 text-black rounded-xl relative hover:scale-105 transition-transform flex gap-2 font-bold shadow-lg shadow-amber-500/20">
              <ShoppingCart size={20} /> <span className="hidden md:inline">عرض السلة</span>
              {cart.length > 0 && <span className="absolute -top-2 -left-2 bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border border-black">{cart.length}</span>}
           </button>
        </div>
      </nav>

      {/* Product Content - AliExpress Style mixed with Luxury */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
         {/* Breadcrumb */}
         <div className="text-sm text-gray-500 mb-6 flex gap-2">
            <Link href="/" className="hover:text-amber-600">الرئيسية</Link> / 
            <span className="text-amber-600 font-bold">{product.category || 'متجر Kosa'}</span> / 
            <span className="text-gray-900 truncate w-32 md:w-auto inline-block">{product.name}</span>
         </div>

         <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-gray-200/50 border border-amber-50 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
               
               {/* Left/Right Product Image Gallery */}
               <div className="bg-[#fcfcfc] p-6 md:p-12 flex items-center justify-center border-b md:border-b-0 md:border-l border-gray-100 relative">
                  <div className="aspect-square w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white relative group">
                     <img src={product.image || '/face.jpeg'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                     {product.discountPrice && <span className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-black px-4 py-2 rounded-full uppercase shadow-lg shadow-rose-500/30">تخفيض خاص</span>}
                     {product.isNew && <span className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-black px-4 py-2 rounded-full uppercase shadow-lg shadow-amber-500/30">جديد</span>}
                  </div>
               </div>

               {/* Product Details (AliExpress Style layout) */}
               <div className="p-8 md:p-12 flex flex-col">
                  <div className="mb-6 pb-6 border-b border-gray-100">
                     <h1 className="text-3xl md:text-4xl font-black text-amber-950 mb-4 leading-tight italic">{product.name}</h1>
                     
                     {/* Rating/Orders snippet (AliExpress feel) */}
                     <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                        <div className="flex items-center gap-1 text-amber-500"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/> <span className="text-black ml-1 text-xs">5.0</span></div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className="text-green-600 flex items-center gap-1"><ShieldCheck size={16}/> منتج مرخص وأصلي</span>
                     </div>
                  </div>

                  {/* Price Block */}
                  <div className="bg-gradient-to-r from-amber-50 to-white p-6 md:p-8 rounded-[2rem] border border-amber-100 mb-8 shadow-inner relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                     <div className="relative z-10">
                       <div className="text-sm font-bold text-amber-700 mb-2">السعر الحالي</div>
                       <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
                          <span className="text-5xl font-black text-amber-900">{currentPrice.toLocaleString()} <span className="text-2xl font-bold">د.ج</span></span>
                          {product.discountPrice && <span className="text-lg text-gray-400 line-through font-bold mb-1">{Number(product.price).toLocaleString()} د.ج</span>}
                       </div>
                       {product.discountPrice && (
                         <div className="mt-4 text-sm text-rose-700 font-bold bg-rose-50 px-3 py-1.5 rounded-lg inline-block border border-rose-100">
                           أنت توفر { (Number(product.price) - Number(product.discountPrice)).toLocaleString() } د.ج !
                         </div>
                       )}
                     </div>
                  </div>

                  {/* Quantity & Action */}
                  <div className="mb-10 space-y-6 flex-1">
                     <div className="flex gap-6 items-center">
                        <span className="text-gray-700 font-bold w-16">الكمية:</span>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                           <button onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))} className="p-3 hover:bg-gray-200 text-gray-700 transition-colors"><Minus size={18}/></button>
                           <input type="number" readOnly value={productQuantity} className="w-12 text-center bg-transparent font-black outline-none" />
                           <button onClick={() => setProductQuantity((typeof product.quantity !== 'undefined' ? (productQuantity < product.quantity ? productQuantity + 1 : productQuantity) : productQuantity + 1))} className="p-3 hover:bg-gray-200 text-gray-700 transition-colors"><Plus size={18}/></button>
                        </div>
                        <div className="text-xs font-bold text-gray-400">
                           {typeof product.quantity !== 'undefined' ? `متوفر ${product.quantity} قطعة` : 'متوفر في المخزن'}
                        </div>
                     </div>
                     
                     {/* Services (AliExpress style badges) */}
                     <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center pt-4">
                        <span className="text-gray-700 font-bold w-16">خدماتنا:</span>
                        <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-600">
                           <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg"><Truck size={16} className="text-amber-500" /> توصيل سريع لكل الولايات</span>
                           <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg"><CheckCircle size={16} className="text-green-500"/> الدفع عند الاستلام</span>
                        </div>
                     </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-4 mt-auto">
                     <button onClick={() => { handleAddToCart(); alert('تم إضافة المنتج לסلة المشتريات بنجاح!'); }} className="flex-1 bg-amber-100 text-amber-900 py-4 md:py-5 rounded-2xl font-black text-lg hover:bg-amber-200 transition-all flex items-center justify-center gap-2 border-2 border-amber-200">
                        أضف إلى السلة <ShoppingCart size={22}/>
                     </button>
                     <button onClick={() => { handleAddToCart(); router.push('/?cart=true'); }} className="flex-1 bg-black text-white py-4 md:py-5 rounded-2xl font-black text-lg hover:bg-gray-900 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2 italic">
                        اشتري الآن بضغطة 
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Overview / Details Section */}
         <div className="mt-8 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-20">
            <h3 className="text-2xl font-black text-amber-950 mb-8 border-b border-gray-100 pb-6 flex items-center gap-3 italic">
               <Info className="text-amber-500"/> وصف المنتج وتفاصيله الدقيقة
            </h3>
            
            <div className="text-gray-600 text-lg leading-relaxed mb-10 md:px-4">
               {product.description}
            </div>

            {product.details?.benefits && product.details.benefits.length > 0 && (
              <div className="mb-10 md:px-4">
                <h4 className="text-xl font-black text-amber-900 mb-6 flex items-center gap-2"><Star size={20} className="text-amber-500"/> المميزات والفوائد الأساسية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {product.details.benefits.map((b: string, i: number) => (
                     <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="bg-white shadow-sm text-green-500 rounded-full p-1 shrink-0"><CheckCircle size={20}/></span>
                        <span className="font-bold text-gray-700">{b}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}
            
            {product.details?.usage && (
               <div className="md:px-4 pt-8 border-t border-gray-100">
                 <h4 className="text-xl font-black text-amber-900 mb-6">طريقة الاستعمال الصحيحة</h4>
                 {typeof product.details.usage === 'string' ? (
                   <p className="text-gray-600 leading-relaxed bg-amber-50 p-6 rounded-2xl">{product.details.usage}</p>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {product.details.usage.skin && (
                          <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                             <h5 className="font-black text-amber-800 mb-2">للبشرة</h5>
                             <p className="text-gray-600 text-sm leading-relaxed">{product.details.usage.skin}</p>
                          </div>
                       )}
                       {product.details.usage.hair && (
                          <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                             <h5 className="font-black text-amber-800 mb-2">للشعر</h5>
                             <p className="text-gray-600 text-sm leading-relaxed">{product.details.usage.hair}</p>
                          </div>
                       )}
                       {product.details.usage.nails && (
                          <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                             <h5 className="font-black text-amber-800 mb-2">للأظافر</h5>
                             <p className="text-gray-600 text-sm leading-relaxed">{product.details.usage.nails}</p>
                          </div>
                       )}
                       {product.details.usage.routine && (
                          <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                             <h5 className="font-black text-amber-800 mb-2">الروتين اليومي</h5>
                             <p className="text-gray-600 text-sm leading-relaxed">{product.details.usage.routine}</p>
                          </div>
                       )}
                    </div>
                 )}
               </div>
            )}
         </div>
      </main>

      {/* Footer minimal */}
      <footer className="bg-black text-white py-8 text-center border-t-4 border-amber-500">
         <p className="text-sm text-gray-500 font-bold tracking-widest uppercase">© 2024 KOSA COSM • TINDOUF, ALGERIA</p>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
