import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useOrders } from '../hooks/useOrders';

import { calculateShippingCost } from '../utils/shipping';
import Header from '../components/Header';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, userData, logout, userRole } = useAuth();
  const { orders } = useOrders();
  const fileInputRef = useRef(null);

  /* Address State */
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  /* Image Upload State */
  const [uploading, setUploading] = useState(false);

  /* Shipping Calculation State */
  const [previewCost, setPreviewCost] = useState(null);
  const [isCalculatingCost, setIsCalculatingCost] = useState(false);

  const handleCalculateCost = async () => {
    if (!address || !city) return;

    setIsCalculatingCost(true);
    try {
      const fullAddress = `${address}, ${city}, Argentina`;
      // We pass 0 items here to show the base cost, ignoring the "Free for 5 items" rule for this preview
      const cost = await calculateShippingCost(fullAddress, 0);
      setPreviewCost(cost);
    } catch (error) {
      console.error("Error calculating cost:", error);
      alert("No se pudo calcular el costo. Verifica la dirección.");
    } finally {
      setIsCalculatingCost(false);
    }
  };

  // Protect Route & Load Data
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (userData) {
      // Load address from userData if available
      if (userData.shippingAddress) {
        setAddress(userData.shippingAddress.address || '');
        setCity(userData.shippingAddress.city || '');
        setZip(userData.shippingAddress.zip || '');
      }
    }
  }, [currentUser, userData, navigate]);

  const handleSaveAddress = async () => {
    if (!currentUser) return;

    const shippingAddress = {
      address,
      city,
      zip
    };

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        shippingAddress
      });
      setIsEditingAddress(false);
      alert('Dirección actualizada correctamente');
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Error al guardar la dirección");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profile_images/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { photoURL });

      // Force reload or update context (Context listens to realtime changes so it should auto-update)
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (!currentUser) return null; // Or meaningful loading state

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden mx-auto max-w-md bg-background-light dark:bg-background-dark pb-24 shadow-2xl">
      {/* Top App Bar - Replaced with Standard Header for consistency */}
      <div className="md:hidden sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-white/5">
        <Header title="Perfil" showSearch={false} />
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center pt-6 pb-6 px-4">
        <div className="relative group cursor-pointer" onClick={handleImageClick}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 border-4 border-white dark:border-surface-dark shadow-lg bg-emerald-100 flex items-center justify-center text-4xl font-bold text-emerald-700 uppercase overflow-hidden"
            style={userData?.photoURL ? { backgroundImage: `url("${userData.photoURL}")` } : {}}
          >
            {uploading ? (
              <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
            ) : (
              !userData?.photoURL && (userData?.displayName?.charAt(0) || currentUser.email?.charAt(0) || "U")
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 border-2 border-white dark:border-surface-dark shadow-sm group-hover:bg-emerald-600 transition-colors">
            <span className="material-symbols-outlined text-black text-[18px]">edit</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-center text-text-main dark:text-white">
            {userData?.displayName || "Usuario"}
          </h1>
          <p className="text-text-muted dark:text-gray-400 text-sm font-medium mt-1">{currentUser.email}</p>
          <div className="mt-3 bg-primary/20 px-3 py-1 rounded-full">
            <p className="text-black dark:text-primary text-xs font-bold uppercase tracking-wider">
              {userRole === 'admin' ? 'Administrador' : 'Cliente VIP'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-3 px-4 pb-6">
        <button
          onClick={() => navigate('/orders')}
          className="flex flex-1 flex-col gap-1 rounded-2xl bg-white dark:bg-surface-dark p-4 items-center text-center shadow-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <p className="text-text-main dark:text-white text-xl font-bold">{orders.length}</p>
          <p className="text-text-muted dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Pedidos</p>
        </button>
        <button
          onClick={() => navigate('/favorites')}
          className="flex flex-1 flex-col gap-1 rounded-2xl bg-white dark:bg-surface-dark p-4 items-center text-center shadow-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <p className="text-text-main dark:text-white text-xl font-bold">{userData?.favorites?.length || 0}</p>
          <p className="text-text-muted dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Favoritos</p>
        </button>
      </div>

      {/* Menu Section: My Garden */}
      <div className="px-4 mt-2 mb-2">
        <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight px-1 pb-3">Mi Jardín</h3>
        <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
          {/* List Item */}
          <button
            onClick={() => navigate('/orders')}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-black group-hover:text-black transition-colors">local_shipping</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-text-main dark:text-white text-base font-semibold leading-normal">Mis Pedidos</p>
              <p className="text-text-muted dark:text-gray-400 text-xs">Ver historial</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
          <div className="h-[1px] bg-gray-100 dark:bg-white/5 mx-4"></div>
          {/* List Item */}
          <button
            onClick={() => navigate('/favorites')}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-black group-hover:text-black transition-colors">potted_plant</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-text-main dark:text-white text-base font-semibold leading-normal">Favoritos</p>
              <p className="text-text-muted dark:text-gray-400 text-xs">Ver guardados</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="px-4 mt-6 mb-2">
        <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight px-1 pb-3">Dirección de Envío</h3>
        <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 p-4">

          {!isEditingAddress ? (
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/10 shrink-0 size-10 mt-1">
                  <span className="material-symbols-outlined text-text-main dark:text-white">location_on</span>
                </div>
                <div>
                  {userData?.shippingAddress && (userData.shippingAddress.address || userData.shippingAddress.city) ? (
                    <>
                      <p className="text-text-main dark:text-white text-base font-semibold">{userData.shippingAddress.address}</p>
                      <p className="text-text-muted dark:text-gray-400 text-sm">{userData.shippingAddress.city}, {userData.shippingAddress.zip}</p>
                    </>
                  ) : (
                    <p className="text-text-muted dark:text-gray-400 text-sm italic font-medium">NO HAY DIRECCION AGREGADA</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsEditingAddress(true)}
                className="text-primary font-bold text-sm hover:underline"
              >
                {userData?.shippingAddress && (userData.shippingAddress.address || userData.shippingAddress.city) ? 'Editar' : 'Agregar'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 animate-fade-in-up">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección de Entrega</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle y Número (ej. Av. Corrientes 1234)"
                className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Localidad (ej. Bahía Blanca / Punta Alta)"
                  className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="C.P."
                  className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white"
                />
              </div>

              {/* Shipping Cost Preview */}
              <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                <div className="text-sm">
                  <p className="font-bold text-slate-700 dark:text-gray-300">Costo de Envío Estimado:</p>
                  {previewCost !== null ? (
                    <p className="text-primary font-bold text-lg">${previewCost}</p>
                  ) : (
                    <p className="text-gray-400 text-xs text-balance">Ingresa tu dirección para calcular</p>
                  )}
                </div>
                <button
                  onClick={handleCalculateCost}
                  disabled={isCalculatingCost || !address || !city}
                  className="text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculatingCost ? 'Calculando...' : 'Calcular'}
                </button>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsEditingAddress(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAddress}
                  className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all"
                >
                  Guardar Dirección
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Sign Out */}
      <div className="px-4 mt-6 mb-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-red-500 bg-red-50 dark:bg-red-900/10 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Cerrar Sesión
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">Version 2.5.0</p>
      </div>

      <BottomNav />
    </div>
  );
}
