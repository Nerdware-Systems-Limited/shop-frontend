import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const productImages = images?.length > 0 
    ? images.sort((a, b) => b.is_primary - a.is_primary)
    : [{ image: '/placeholder.jpg', alt_text: productName }];

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 border border-black overflow-hidden group">
        <img
          src={productImages[selectedImage].image}
          alt={productImages[selectedImage].alt_text || productName}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {productImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white border border-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white border border-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-white border border-black">
          <span className="text-[9px] uppercase tracking-widest">
            {selectedImage + 1} / {productImages.length}
          </span>
        </div>
      </div>

      {/* Thumbnail Grid */}
      {productImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square bg-gray-50 border overflow-hidden transition-colors ${
                selectedImage === index ? 'border-black' : 'border-gray-300 hover:border-black'
              }`}
            >
              <img
                src={image.image}
                alt={image.alt_text || `${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;