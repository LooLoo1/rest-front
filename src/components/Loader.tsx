const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full border-4 border-[#DCB73C] border-t-transparent" style={{ height: '2em', width: '2em' }}></div>
    </div>
  );
};

export default Loader;
