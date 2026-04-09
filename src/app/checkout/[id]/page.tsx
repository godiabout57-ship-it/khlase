'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../../page';

export default function DirectCheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const id = Number(params.id);
  const qtyParam = searchParams.get('qty');
  const initialQty = qtyParam ? parseInt(qtyParam, 10) : 1;

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(initialQty);
  
  const [checkoutData, setCheckoutData] = useState({ name: '', state: '', address: '', phone: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('kosa_products');
    let allProducts = PRODUCTS;
    if (savedProducts) {
       try { allProducts = JSON.parse(savedProducts); } catch(e) {}
    }
    const found = allProducts.find(p => p.id === id);
    setProduct(found);
    if (!qtyParam) setQuantity(1);
  }, [id, qtyParam]);

  if (product === null) return <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-sans text-xl font-bold">جاري التحميل...</div>;
  if (product === undefined) return <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-sans text-xl font-bold">المنتج غير موجود</div>;

  const currentPrice = product.discountPrice || product.price;
  const totalAmount = currentPrice * quantity;

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutData.name || !checkoutData.state || !checkoutData.address || !checkoutData.phone) return;

    const singleItemCart = [{ ...product, quantity }];

    const newOrder = {
      id: Date.now().toString(),
      customer: checkoutData,
      items: singleItemCart,
      total: totalAmount,
      status: 'Pending',
      date: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem('kosa_orders') || '[]');
    localStorage.setItem('kosa_orders', JSON.stringify([newOrder, ...existingOrders]));

    setOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-right" dir="rtl">
      {/* Navigation */}
      <nav className="bg-black text-white h-20 flex items-center border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
           <div className="flex gap-4 items-center">
              <button type="button" onClick={() => router.back()} className="hover:text-amber-500 transition-colors bg-white/10 p-3 rounded-full">
                 <ArrowRight size={20} />
              </button>
              <img src="/logo/logo.png" alt="KOSA" className="h-12 w-auto" />
           </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-amber-50 overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              
              {/* Product Summary */}
              <div className="bg-[#fcfcfc] p-6 md:p-10 border-b md:border-b-0 md:border-l border-gray-100 flex flex-col justify-center">
                 <h2 className="text-2xl font-black text-amber-950 mb-6 italic">ملخص الطلب</h2>
                 
                 <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                   <img src={product.image} className="w-20 h-20 object-cover rounded-xl border border-gray-100" alt={product.name} />
                   <div>
                     <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                     <div className="text-amber-600 font-black mt-1">{currentPrice.toLocaleString()} د.ج</div>
                     <div className="text-sm text-gray-500 font-bold mt-1">الكمية: {quantity}</div>
                   </div>
                 </div>

                 <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                   <div className="flex justify-between items-center text-lg font-bold text-gray-700 mb-2">
                     <span>الإجمالي:</span>
                     <span className="text-2xl font-black text-amber-900">{totalAmount.toLocaleString()} د.ج</span>
                   </div>
                   <div className="flex items-center gap-2 text-green-600 text-sm font-bold mt-4 justify-center">
                     <ShieldCheck size={18} /> دفع آمن عند الاستلام
                   </div>
                 </div>
              </div>

              {/* Checkout Form */}
              <div className="p-6 md:p-10">
                 <h2 className="text-2xl font-black text-amber-950 mb-6 italic">معلومات التوصيل</h2>
                 
                 <form onSubmit={submitOrder} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                      <input required type="text" value={checkoutData.name} onChange={e => setCheckoutData({ ...checkoutData, name: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="مثال: أحمد محمادي" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">الولاية *</label>
                      <input required type="text" value={checkoutData.state} onChange={e => setCheckoutData({ ...checkoutData, state: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="مثال: الجزائر العاصمة" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">الهاتف *</label>
                      <input required type="tel" value={checkoutData.phone} onChange={e => setCheckoutData({ ...checkoutData, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-left" placeholder="055..." dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">العنوان الكامل *</label>
                      <textarea required value={checkoutData.address} onChange={e => setCheckoutData({ ...checkoutData, address: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none h-24" placeholder="الشارع، الحي، البلدية..."></textarea>
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-4 mt-6 rounded-xl font-black text-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20">
                      تأكيد الطلب <CheckCircle size={20} />
                    </button>
                 </form>
              </div>
           </div>
        </div>
      </main>

      {/* Success Overlay */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4">
          <div className="bg-white p-12 rounded-[3.5rem] max-w-lg w-full text-center shadow-2xl border-8 border-amber-50">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle size={50} />
            </div>
            <h2 className="text-4xl font-black text-amber-950 mb-4 italic">تم إرسال طلبك بنجاح!</h2>
            <p className="text-gray-500 font-light mb-8 text-lg">سنتواصل معك قريباً لتأكيد الطلب وترتيب عملية التوصيل.</p>
            <button onClick={() => router.push('/')} className="w-full bg-amber-500 text-black py-4 rounded-xl font-black text-lg hover:bg-black hover:text-white transition-all">
              العودة للمتجر
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
