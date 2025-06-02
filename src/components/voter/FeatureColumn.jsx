const FeatureColumn = ({ children, className }) => {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {children}
      </div>
    );
  };
  
  export default FeatureColumn;
  