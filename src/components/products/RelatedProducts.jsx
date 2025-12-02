import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../../actions/productActions';
import ProductCard from './ProductCard';
import { Skeleton } from '../ui/skeleton';

const RelatedProducts = ({ category, currentProductId }) => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.productList);

  useEffect(() => {
    if (category) {
      dispatch(listProducts({ category, ordering: '-created_at' }));
    }
  }, [dispatch, category]);

  // Filter out current product and limit to 4 items
  const relatedProducts = products
    ?.filter(p => p.id !== currentProductId)
    .slice(0, 4) || [];

  if (!loading && relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-20 border-t border-black pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-light tracking-[0.2em] uppercase">
          You May Also Like
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;