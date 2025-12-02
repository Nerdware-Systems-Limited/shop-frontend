const ProductSpecifications = ({ specifications }) => {
  if (!specifications || Object.keys(specifications).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xs text-gray-600">No specifications available</p>
      </div>
    );
  }

  const formatKey = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="max-w-4xl">
      <div className="border border-black">
        {Object.entries(specifications).map(([key, value], index, array) => (
          <div
            key={key}
            className={`grid grid-cols-2 gap-4 px-6 py-4 ${
              index !== array.length - 1 ? 'border-b border-black' : ''
            }`}
          >
            <dt className="text-xs uppercase tracking-widest font-medium">
              {formatKey(key)}
            </dt>
            <dd className="text-xs text-gray-600">
              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecifications;