const FeatureTitle = ({ children, className }) => {
  return (
    <h3 className={`text-xl font-bold text-gray-800 ${className}`}>
      {children}
    </h3>
  );
};

const FeatureDescription = ({ children, className }) => {
  return (
    <p className={`text-gray-600 ${className}`}>
      {children}
    </p>
  );
};

export { FeatureTitle, FeatureDescription };
