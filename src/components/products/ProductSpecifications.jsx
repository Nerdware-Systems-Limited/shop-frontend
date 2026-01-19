const ProductSpecifications = ({ specifications, parsedFeatures }) => {
  if (!specifications || Object.keys(specifications).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xs text-gray-600">No specifications available</p>
      </div>
    );
  }

  // Extract the actual specs object - handle nested structure
  const getSpecsObject = () => {
    // Case 1: Nested structure with 'specifications' key
    if (specifications.specifications && typeof specifications.specifications === 'object') {
      return specifications.specifications;
    }
    
    // Case 2: Flat structure (already the specs)
    // Filter out non-spec keys like 'key_features'
    const filtered = { ...specifications };
    delete filtered.key_features;
    
    return Object.keys(filtered).length > 0 ? filtered : specifications;
  };

  const specsObject = getSpecsObject();

  const formatKey = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatValue = (value) => {
    // Handle boolean
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <ul className="space-y-1">
          {value.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    // Handle objects (rare, but possible)
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    
    // Handle numbers
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    // Default: string
    return value;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Key Features Section (if available) */}
      {parsedFeatures && parsedFeatures.length > 0 && (
        <div>
          <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider mb-4 sm:mb-6 text-black">
            Key Features
          </h3>
          <ul className="space-y-2.5 sm:space-y-3 bg-gray-50 p-4 sm:p-6 border border-black">
            {parsedFeatures.map((feature, idx) => (
              <li 
                key={idx} 
                className="text-[11px] sm:text-xs md:text-sm leading-relaxed text-gray-700 flex items-start gap-2.5"
              >
                <span className="mt-0.5 text-black font-bold flex-shrink-0">•</span>
                <span className="flex-1 break-words">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technical Specifications Table */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider mb-4 sm:mb-6 text-black">
          Technical Specifications
        </h3>
        <div className="border border-black overflow-hidden">
          {Object.entries(specsObject).map(([key, value], index, array) => (
            <div
              key={key}
              className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 ${
                index !== array.length - 1 ? 'border-b border-black' : ''
              } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <dt className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-black break-words">
                {formatKey(key)}
              </dt>
              <dd className="text-[11px] sm:text-xs text-gray-700 break-words sm:text-right">
                {formatValue(value)}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSpecifications;