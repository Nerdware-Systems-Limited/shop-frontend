import ProductCard from './ProductCard';
import Loader from '../common/Loader';

const ProductGrid = ({ products, loading, error, next }) => {
  if (loading) {
    return <Loader variant="skeleton" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-600">No products found</p>
      </div>
    );
  }
  console.log("products",products)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;