const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-4 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <img src="/DIRECTKEYLOGO.png" alt="DirectKey" className="h-6 w-auto" />
          <span>{new Date().getFullYear()} DirectKey. All rights reserved.</span>
        </div>
        <div className="flex gap-4">
          <a href="http://localhost:5173/terms" className="hover:text-gray-700 no-underline text-gray-500">Terms</a>
          <a href="http://localhost:5173/privacy" className="hover:text-gray-700 no-underline text-gray-500">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
