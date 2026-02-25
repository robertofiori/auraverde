import { useState } from 'react';
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
        <Header onSearch={setSearchTerm} searchValue={searchTerm} />
      </div>

      <div className="hidden md:block mb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Descubre</h2>
        <p className="text-slate-500 text-lg">Encuentra la planta perfecta para tu espacio</p>
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
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.firestoreId || product.id}
              {...product}
              id={product.firestoreId || product.id}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
