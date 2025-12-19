import { useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import FilterChip from '../components/FilterChip';
import { filters } from '../data/products';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();

  // Show loading state wrapper or just handle it conditionally

  const filteredProducts = products.filter(p => {
    const matchesFilter = activeFilter === "Todos" || p.type.includes(activeFilter) || p.name.includes(activeFilter);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="md:hidden">
        <Header />
      </div>

      <div className="hidden md:block mb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Descubre</h2>
        <p className="text-slate-500 text-lg">Encuentra la planta perfecta para tu espacio</p>
      </div>

      <div className="px-6 md:px-0 mb-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            placeholder="Buscar plantas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Filters */}
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
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.firestoreId || product.id}
              {...product}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
