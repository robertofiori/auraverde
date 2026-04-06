import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import FilterChip from '../components/FilterChip';
import { filters } from '../data/products';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';

export default function Catalog() {
  // State for filtering and search
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();

  const [searchParams] = useSearchParams();
  const isOfertasMode = searchParams.get('badge') === 'oferta';
  const filteredProducts = products.filter(p => {
    // Si estamos en la vista de ofertas, debe tener el badge 'oferta'
    if (isOfertasMode && (!p.badge || p.badge.toLowerCase() !== 'oferta')) {
      return false;
    }

    const filterLower = activeFilter.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesFilter = activeFilter === "Todos" || 
      p.name.toLowerCase().includes(filterLower) || 
      p.type.toLowerCase().includes(filterLower) ||
      (p.description && p.description.toLowerCase().includes(filterLower));

    const matchesSearch = p.name.toLowerCase().includes(searchLower) ||
      p.type.toLowerCase().includes(searchLower) ||
      (p.description && p.description.toLowerCase().includes(searchLower));
      
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="flex h-full items-center justify-center text-primary font-bold">Cargando catálogo...</div>;
  }

  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">Error cargando productos.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-0">
        <Header onSearch={setSearchTerm} searchValue={searchTerm} />
      </div>

      <div className="px-6 py-6 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-8 h-1 bg-primary rounded-full"></span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isOfertasMode ? (
              <span className="text-gradient">Ofertas Imperdibles</span>
            ) : (
              "Nuestras Plantas"
            )}
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          {isOfertasMode 
            ? "Selección exclusiva con descuentos especiales por tiempo limitado." 
            : "Encuentra la planta perfecta para transformar tu hogar u oficina."}
        </p>
      </div>

      {/* Filters (Search moved to Header) */}
      <div className="pl-6 py-4 shrink-0 md:pl-0">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pr-6 items-center">
          <button className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transition-transform hover:scale-105">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>

          {filters.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            />
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 md:pb-8 hide-scrollbar md:px-0">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.firestoreId || product.id} 
              className="animate-scale-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <ProductCard
                {...product}
                id={product.firestoreId || product.id}
                onAddToCart={() => addToCart(product)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
