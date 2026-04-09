'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Package, ListOrdered, TrendingUp, Plus, Trash, CheckCircle, XCircle, Clock, Save, Image as ImageIcon, Upload, Edit } from 'lucide-react';
import { PRODUCTS } from '../page';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Product Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    costPrice: '',
    quantity: '10',
    description: '',
    image: '',
    benefits: ''
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('kosa_products');
    let loadedProducts = PRODUCTS;
    if (savedProducts) {
       try {
         const parsed = JSON.parse(savedProducts);
         if (parsed && parsed.length > 0) loadedProducts = parsed;
       } catch(e) {}
    }
    setProducts(loadedProducts);
    if (!savedProducts) localStorage.setItem('kosa_products', JSON.stringify(loadedProducts));
    
    const savedOrders = localStorage.getItem('kosa_orders');
    if (savedOrders) {
       try {
         setOrders(JSON.parse(savedOrders));
       } catch(e) {}
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '@oussama#project@%withhamza') {
      setIsAuthenticated(true);
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({...newProduct, image: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      id: editingId || Date.now(),
      name: newProduct.name,
      category: newProduct.category || 'عام',
      price: Number(newProduct.price),
      discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : null,
      costPrice: Number(newProduct.costPrice),
      quantity: Number(newProduct.quantity) || 10,
      image: newProduct.image || '/green.jpeg',
      description: newProduct.description,
      isNew: !editingId,
      details: {
        benefits: newProduct.benefits.split(',').map((b: string) => b.trim()).filter((b: string) => b),
        usage: "يُستخدم حسب الحاجة."
      }
    };

    let updated;
    if (editingId) {
       updated = products.map(p => p.id === editingId ? product : p);
       alert('تم تعديل المنتج بنجاح');
    } else {
       updated = [product, ...products];
       alert('تم إضافة المنتج بنجاح');
    }
    
    setProducts(updated);
    localStorage.setItem('kosa_products', JSON.stringify(updated));
    setNewProduct({ name: '', category: '', price: '', discountPrice: '', costPrice: '', quantity: '10', description: '', image: '', benefits: ''});
    setEditingId(null);
  };

  const handleEditProduct = (product: any) => {
     setNewProduct({
        name: product.name,
        category: product.category || '',
        price: product.price ? product.price.toString() : '',
        discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
        costPrice: product.costPrice ? product.costPrice.toString() : '',
        quantity: typeof product.quantity !== 'undefined' ? product.quantity.toString() : '10',
        description: product.description || '',
        image: product.image || '',
        benefits: product.details?.benefits?.join(', ') || ''
     });
     setEditingId(product.id);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = (id: number) => {
    if (confirm('هل أنت متأكد من مسح هذا المنتج؟')) {
       const updated = products.filter(p => p.id !== id);
       setProducts(updated);
       localStorage.setItem('kosa_products', JSON.stringify(updated));
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
     const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
     setOrders(updated);
     localStorage.setItem('kosa_orders', JSON.stringify(updated));
  };
  
  const calculateTotalProfits = () => {
     return orders.filter(o => o.status === 'Accepted').reduce((acc, order) => {
        const cost = order.items.reduce((cAcc: number, item: any) => cAcc + ((item.costPrice || 0) * item.quantity), 0);
        return acc + (order.total - cost);
     }, 0);
  };

  const calculateOrderProfit = (order: any) => {
     const cost = order.items.reduce((cAcc: number, item: any) => cAcc + ((item.costPrice || 0) * item.quantity), 0);
     return order.total - cost;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-sans text-right" dir="rtl">
         <form onSubmit={handleLogin} className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-md w-full border border-amber-50 mx-4">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8">
               <Lock size={40} />
            </div>
            <h1 className="text-3xl font-black text-amber-950 text-center mb-8 italic">لوحة التحكم</h1>
            <input 
              type="password" 
              placeholder="أدخل كلمة المرور..." 
              className="w-full border-2 border-gray-100 rounded-2xl p-4 mb-6 focus:border-amber-500 focus:ring-0 outline-none transition-all text-center text-xl tracking-widest"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="w-full bg-black text-white py-4 rounded-2xl font-black text-xl hover:bg-amber-500 transition-all">دخول</button>
         </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-right" dir="rtl">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-l border-amber-100 p-8 flex flex-col shadow-lg z-10 sticky top-0 md:h-screen">
         <img src="/logo/logo.png" alt="KOSA ADMIN" className="h-16 w-auto mx-auto mb-12" />
         
         <div className="space-y-4 flex-1">
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'products' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:bg-amber-50'}`}>
               <Package size={24} /> المنتجات
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'orders' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:bg-amber-50'}`}>
               <ListOrdered size={24} /> الطلبات
            </button>
         </div>
         
         <div className="mt-auto pt-8 border-t border-gray-100">
            <button onClick={() => window.location.href = '/'} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-amber-600 transition-colors">
               ← العودة للمتجر
            </button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
         
         {activeTab === 'products' && (
           <div className="animate-fade-in space-y-12 max-w-5xl mx-auto">
              <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h2 className="text-2xl font-black text-amber-950 mb-8 italic flex items-center gap-3">
                    {editingId ? <Edit className="text-amber-500"/> : <Plus className="text-amber-500"/>} {editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                 </h2>
                 <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">اسم المنتج *</label>
                       <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full border-2 border-gray-300 rounded-xl p-3 bg-white text-black font-bold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">الصنف</label>
                       <input value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="مثال: العناية بالبشرة" className="w-full border-2 border-gray-300 rounded-xl p-3 bg-white text-black font-bold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-2">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">سعر البيع (د.ج) *</label>
                          <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full border-2 border-gray-300 rounded-xl p-3 bg-white text-black font-bold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">سعر التخفيض</label>
                          <input type="number" value={newProduct.discountPrice} onChange={e => setNewProduct({...newProduct, discountPrice: e.target.value})} className="w-full border-2 border-gray-300 rounded-xl p-3 bg-white text-black font-bold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 text-rose-600">سعر الشراء *</label>
                          <input required type="number" value={newProduct.costPrice} onChange={e => setNewProduct({...newProduct, costPrice: e.target.value})} className="w-full border-2 border-rose-300 rounded-xl p-3 bg-white text-rose-700 font-black outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all placeholder:text-rose-300" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">الكمية</label>
                          <input required type="number" value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: e.target.value})} className="w-full border-2 border-gray-300 rounded-xl p-3 bg-white text-black font-bold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400" />
                       </div>
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-gray-700 mb-2">الصورة (رفع من الجهاز أو رابط)</label>
                       <div className="flex gap-4 items-center">
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl flex items-center gap-2 font-bold transition-all border-2 border-gray-300 shrink-0">
                             <Upload size={20} /> رفع صورة
                             <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                          <span className="text-gray-400 font-bold">أو</span>
                          <div className="flex-1 relative">
                             <ImageIcon className="absolute left-3 top-3.5 text-gray-400" size={20} />
                             <input value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="https://..." className="w-full border-2 border-gray-300 rounded-xl py-3 pr-4 pl-10 bg-white text-black font-bold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400" dir="ltr" />
                          </div>
                       </div>
                       {newProduct.image && newProduct.image.startsWith('data:image') && (
                          <div className="mt-4"><img src={newProduct.image} alt="Preview" className="h-20 w-20 object-cover rounded-xl border-2 border-amber-500 shadow-md" /></div>
                       )}
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-gray-700 mb-2">الفوائد (مفصولة بفاصلة)</label>
                       <input value={newProduct.benefits} onChange={e => setNewProduct({...newProduct, benefits: e.target.value})} placeholder="يرطب البشرة, يزيل التجاعيد..." className="w-full border-2 border-gray-300 rounded-xl p-3 bg-white text-black font-bold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-gray-700 mb-2">الوصف الكامل</label>
                       <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full border-2 border-gray-300 rounded-xl p-3 bg-white text-black font-bold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400 h-24 resize-none" />
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-4 gap-4">
                       {editingId && (
                           <button type="button" onClick={() => {
                              setEditingId(null);
                              setNewProduct({ name: '', category: '', price: '', discountPrice: '', costPrice: '', quantity: '10', description: '', image: '', benefits: ''});
                           }} className="bg-gray-100 text-gray-600 px-8 py-4 rounded-xl font-black hover:bg-gray-200 transition-colors">إلغاء</button>
                       )}
                       <button type="submit" className="bg-black text-white px-8 py-4 rounded-xl font-black hover:bg-amber-500 transition-colors flex items-center gap-2">
                          <Save size={20}/> {editingId ? 'حفظ التعديلات' : 'حفظ المنتج'}
                       </button>
                    </div>
                 </form>
              </div>

              <div>
                 <h2 className="text-2xl font-black text-amber-950 mb-6 italic">المنتجات الحالية ({products.length})</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(p => (
                       <div key={p.id} className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex gap-4 items-center group">
                          <img src={p.image || '/face.jpeg'} className="w-20 h-20 rounded-xl object-cover" alt={p.name} />
                          <div className="flex-1">
                             <h4 className="font-bold text-gray-800 text-sm truncate w-32">{p.name}</h4>
                             <p className="text-amber-600 font-black mt-1">{p.discountPrice || p.price} دج</p>
                             <p className="text-xs text-gray-500 mt-1">الكمية: <span className="font-bold">{typeof p.quantity !== 'undefined' ? p.quantity : '10'}</span></p>
                          </div>
                          <div className="flex flex-col gap-2">
                             <button onClick={() => handleEditProduct(p)} className="p-2 text-amber-500 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-colors" title="تعديل">
                                <Edit size={18}/>
                             </button>
                             <button onClick={() => deleteProduct(p.id)} className="p-2 text-rose-300 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors" title="مسح">
                                <Trash size={18}/>
                             </button>
                          </div>
                       </div>
                    ))}
                    {products.length === 0 && <p className="text-gray-400">لا توجد منتجات حاليا.</p>}
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'orders' && (
           <div className="animate-fade-in space-y-8 max-w-5xl mx-auto">
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 <div className="bg-white p-8 rounded-[2rem] shadow-sm border-b-8 border-amber-500">
                    <span className="text-gray-500 font-bold mb-2 block">إجمالي الطلبات</span>
                    <h3 className="text-4xl font-black text-amber-950">{orders.length}</h3>
                 </div>
                 <div className="bg-white p-8 rounded-[2rem] shadow-sm border-b-8 border-green-500">
                    <span className="text-gray-500 font-bold mb-2 flex items-center gap-2"><TrendingUp size={16}/> إجمالي الأرباح المُحققة</span>
                    <h3 className="text-4xl font-black text-green-600">{calculateTotalProfits().toLocaleString()} <span className="text-sm text-gray-400 font-normal">دج</span></h3>
                    <p className="text-xs text-gray-400 mt-2">محسوبة من الطلبات المكتملة (Accepted) فقط وخصم سعر الشراء.</p>
                 </div>
              </div>

              {orders.length === 0 ? (
                 <div className="text-center py-20 text-gray-400 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                    لا توجد طلبات حتى الآن.
                 </div>
              ) : (
                 <div className="space-y-6">
                    {orders.map(order => {
                       const profit = calculateOrderProfit(order);
                       return (
                       <div key={order.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 border-b border-gray-50 bg-gray-50/50">
                             <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                   <h3 className="text-xl font-black text-amber-950">{order.customer.name}</h3>
                                   {order.status === 'Pending' && <span className="bg-amber-100 text-amber-700 font-bold text-xs px-3 py-1 rounded-full animate-pulse">قيد الانتظار</span>}
                                   {order.status === 'Accepted' && <span className="bg-green-100 text-green-700 font-bold text-xs px-3 py-1 rounded-full">مكتمل</span>}
                                   {order.status === 'Rejected' && <span className="bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1 rounded-full">مرفوض</span>}
                                   {order.status === 'No Response' && <span className="bg-gray-200 text-gray-700 font-bold text-xs px-3 py-1 rounded-full">لم يرد</span>}
                                </div>
                                <div className="text-sm text-gray-500 space-y-1">
                                   <p><span className="font-bold text-gray-700">الهاتف:</span> <span dir="ltr">{order.customer.phone}</span></p>
                                   <p><span className="font-bold text-gray-700">العنوان:</span> {order.customer.state} - {order.customer.address}</p>
                                   <p className="text-xs mt-2 text-gray-400">{new Date(order.date).toLocaleString('ar-DZ')}</p>
                                </div>
                             </div>
                             
                             <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-center min-w-[200px]">
                                <span className="text-xs font-bold text-gray-400 mb-1">الفاتورة الإجمالية</span>
                                <span className="text-2xl font-black text-amber-900 mb-2">{order.total.toLocaleString()} دج</span>
                                <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-sm">
                                   <span className="text-gray-500">صافي الربح:</span>
                                   <span className="font-black text-green-600">+{profit.toLocaleString()} دج</span>
                                </div>
                             </div>
                          </div>

                          <div className="p-6 md:p-8 bg-white">
                             <h4 className="font-bold text-gray-800 mb-4 text-sm">المنتجات المطلوبة:</h4>
                             <div className="space-y-3 mb-8">
                                {order.items.map((item: any, i: number) => (
                                   <div key={i} className="flex gap-3 items-center">
                                      <span className="bg-amber-100 text-amber-800 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">{item.quantity}</span>
                                      <p className="text-sm font-medium text-gray-700">{item.name}</p>
                                   </div>
                                ))}
                             </div>

                             <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                                <button onClick={() => updateOrderStatus(order.id, 'Accepted')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${order.status === 'Accepted' ? 'bg-green-500 text-white shadow-md cursor-default' : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'}`}>
                                   <CheckCircle size={18}/> تأكيد واستلام
                                </button>
                                <button onClick={() => updateOrderStatus(order.id, 'No Response')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${order.status === 'No Response' ? 'bg-gray-800 text-white shadow-md cursor-default' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}>
                                   <Clock size={18}/> لم يرد
                                </button>
                                <button onClick={() => updateOrderStatus(order.id, 'Rejected')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${order.status === 'Rejected' ? 'bg-rose-500 text-white shadow-md cursor-default' : 'bg-gray-100 text-gray-600 hover:bg-rose-100 hover:text-rose-700'}`}>
                                   <XCircle size={18}/> مرفوض
                                </button>
                             </div>
                          </div>
                       </div>
                    )})}
                 </div>
              )}
           </div>
         )}
         
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
