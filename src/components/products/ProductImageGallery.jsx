import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

const ProductImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});
  const [imageDimensions, setImageDimensions] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const imageRef = useRef(null);
  const zoomImageRef = useRef(null);
  const containerRef = useRef(null);

  // Sort and prepare images
  const productImages = images?.length > 0 
    ? images.sort((a, b) => (b.is_primary || 0) - (a.is_primary || 0))
    : [{ image: '/placeholder.jpg', alt_text: productName }];

  // Get image dimensions for adaptive sizing
  const loadImageDimensions = useCallback((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      setImageDimensions(prev => ({
        ...prev,
        [index]: {
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio,
          orientation: aspectRatio > 1 ? 'landscape' : aspectRatio < 1 ? 'portrait' : 'square'
        }
      }));
      setImageLoaded(prev => ({ ...prev, [index]: true }));
    };
  }, []);

  // Load dimensions for all images
  useEffect(() => {
    productImages.forEach((image, index) => {
      if (!imageDimensions[index]) {
        loadImageDimensions(image.image, index);
      }
    });
  }, [productImages, imageDimensions, loadImageDimensions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isZoomed) {
        if (e.key === 'Escape') {
          setIsZoomed(false);
          setZoomLevel(1);
          setPanPosition({ x: 0, y: 0 });
        }
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === '+' || e.key === '=') handleZoomIn();
        if (e.key === '-') handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, selectedImage, zoomLevel]);

  // Preload adjacent images
  useEffect(() => {
    const preloadImage = (index) => {
      if (productImages[index] && !imageLoaded[index]) {
        loadImageDimensions(productImages[index].image, index);
      }
    };

    preloadImage(selectedImage);
    preloadImage((selectedImage + 1) % productImages.length);
    preloadImage((selectedImage - 1 + productImages.length) % productImages.length);
  }, [selectedImage, productImages, imageLoaded, loadImageDimensions]);

  const handlePrevious = useCallback(() => {
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [productImages.length]);

  const handleNext = useCallback(() => {
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [productImages.length]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
    if (zoomLevel <= 1.5) {
      setPanPosition({ x: 0, y: 0 });
    }
  };

  // Touch swipe support
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrevious();
  };

  // Get container aspect ratio based on image dimensions
  const getContainerStyle = () => {
    const dims = imageDimensions[selectedImage];
    if (!dims) return { aspectRatio: '1/1' };

    // Adaptive container based on image orientation
    if (dims.orientation === 'landscape') {
      return { aspectRatio: '4/3' };
    } else if (dims.orientation === 'portrait') {
      return { aspectRatio: '3/4' };
    }
    return { aspectRatio: '1/1' };
  };

  // Get image fit style based on dimensions
  const getImageFitClass = () => {
    const dims = imageDimensions[selectedImage];
    if (!dims) return 'object-contain';

    // Use cover for images close to container aspect ratio, contain for very different ratios
    const containerAspect = dims.orientation === 'landscape' ? 4/3 : dims.orientation === 'portrait' ? 3/4 : 1;
    const aspectDiff = Math.abs(dims.aspectRatio - containerAspect);
    
    return aspectDiff < 0.3 ? 'object-cover' : 'object-contain';
  };

  // Pan handlers for zoomed view
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      const rect = zoomImageRef.current.getBoundingClientRect();
      setPanPosition({
        startX: e.clientX - panPosition.x,
        startY: e.clientY - panPosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - panPosition.startX,
        y: e.clientY - panPosition.startY,
        startX: panPosition.startX,
        startY: panPosition.startY
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image Container - Adaptive Aspect Ratio */}
        <div 
          ref={containerRef}
          className="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 overflow-hidden group rounded-lg shadow-sm transition-shadow hover:shadow-md"
          style={getContainerStyle()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Loading State with Skeleton */}
          {!imageLoaded[selectedImage] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-gray-200 border-t-black rounded-full animate-spin" />
                <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-b-gray-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
              </div>
            </div>
          )}

          {/* Main Image with Adaptive Sizing */}
          <div className="relative w-full h-full">
            <img
              ref={imageRef}
              src={productImages[selectedImage].image}
              alt={productImages[selectedImage].alt_text || productName}
              className={`w-full h-full ${getImageFitClass()} transition-all duration-500 ease-out p-4 ${
                imageLoaded[selectedImage] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              onLoad={() => setImageLoaded(prev => ({ ...prev, [selectedImage]: true }))}
              loading="eager"
              draggable={false}
            />
          </div>

          {/* Navigation Arrows with Enhanced Styling */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                aria-label="Previous image"
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2.5 md:p-3 bg-white/95 backdrop-blur-md border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white hover:border-black hover:scale-110 shadow-lg active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2.5 md:p-3 bg-white/95 backdrop-blur-md border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white hover:border-black hover:scale-110 shadow-lg active:scale-95"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
              </button>
            </>
          )}

          {/* Zoom Button */}
          <button
            onClick={() => setIsZoomed(true)}
            aria-label="Zoom image"
            className="absolute top-2 md:top-4 right-2 md:right-4 p-2.5 md:p-3 bg-white/95 backdrop-blur-md border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white hover:border-black hover:scale-110 shadow-lg active:scale-95"
          >
            <Maximize2 className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </button>

          {/* Image Info Badge */}
          <div className="absolute top-2 md:top-4 left-2 md:left-4 px-3 py-1.5 bg-white/95 backdrop-blur-md border border-gray-200 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[10px] md:text-xs font-medium text-gray-600">
              {imageDimensions[selectedImage]?.width} × {imageDimensions[selectedImage]?.height}
            </span>
          </div>

          {/* Image Counter with Progress Bar */}
          <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 space-y-2">
            <div className="px-3 py-1.5 bg-white/95 backdrop-blur-md border border-gray-200 rounded-full shadow-lg">
              <span className="text-[10px] md:text-xs font-semibold tracking-wide">
                {selectedImage + 1} / {productImages.length}
              </span>
            </div>
            {/* Progress indicator */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-300 ease-out"
                style={{ width: `${((selectedImage + 1) / productImages.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Mobile Swipe Indicators */}
          {productImages.length > 1 && (
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Go to image ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    selectedImage === index 
                      ? 'bg-black w-8' 
                      : 'bg-gray-300 hover:bg-gray-400 w-2'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Thumbnail Grid */}
        {productImages.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {productImages.map((image, index) => {
              const dims = imageDimensions[index];
              return (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`relative bg-gradient-to-br from-gray-50 to-gray-100 border rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-black ring-2 ring-black ring-offset-2 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-400 hover:shadow-md hover:scale-105'
                  }`}
                  style={{
                    aspectRatio: dims?.aspectRatio || 1
                  }}
                >
                  <img
                    src={image.image}
                    alt={image.alt_text || `${productName} ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    loading="lazy"
                  />
                  {/* Primary Badge */}
                  {image.is_primary && (
                    <div className="absolute top-1 left-1 px-2 py-0.5 bg-black text-white text-[9px] font-bold rounded-md shadow-md">
                      #1
                    </div>
                  )}
                  {/* Image number overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-bold opacity-0 hover:opacity-100 transition-opacity">
                      {index + 1}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Advanced Fullscreen Zoom Modal with Pan & Zoom */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/97 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300"
          onClick={() => {
            if (zoomLevel === 1) {
              setIsZoomed(false);
            }
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setIsZoomed(false);
              setZoomLevel(1);
              setPanPosition({ x: 0, y: 0 });
            }}
            aria-label="Close zoom"
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white transition-all z-20 hover:scale-110 active:scale-95"
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              aria-label="Zoom in"
              disabled={zoomLevel >= 3}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              aria-label="Zoom out"
              disabled={zoomLevel <= 1}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <div className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white text-xs font-medium text-center">
              {Math.round(zoomLevel * 100)}%
            </div>
          </div>

          {/* Navigation in Zoom */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white transition-all z-20 hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white transition-all z-20 hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </>
          )}

          {/* Zoomed Image with Pan Support */}
          <div 
            className={`relative ${zoomLevel > 1 ? 'cursor-move' : 'cursor-zoom-in'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              ref={zoomImageRef}
              src={productImages[selectedImage].image}
              alt={productImages[selectedImage].alt_text || productName}
              className="max-w-full max-h-[90vh] object-contain transition-transform duration-300 select-none"
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                transformOrigin: 'center'
              }}
              draggable={false}
            />
          </div>

          {/* Info Bar at Bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white z-20">
            <span className="text-sm font-semibold">
              {selectedImage + 1} / {productImages.length}
            </span>
            <div className="w-px h-4 bg-white/30" />
            <span className="text-xs text-gray-300">
              {imageDimensions[selectedImage]?.width} × {imageDimensions[selectedImage]?.height}px
            </span>
            <div className="w-px h-4 bg-white/30" />
            <span className="text-xs text-gray-300 capitalize">
              {imageDimensions[selectedImage]?.orientation}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageGallery;