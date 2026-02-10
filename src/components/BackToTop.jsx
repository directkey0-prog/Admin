import { useState, useEffect } from 'react';
import { FiChevronUp } from 'react-icons/fi';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-50 w-11 h-11 bg-navy-900 hover:bg-navy-800 text-white rounded-full flex items-center justify-center shadow-lg transition-all border-0 cursor-pointer opacity-80 hover:opacity-100"
      aria-label="Back to top"
    >
      <FiChevronUp className="text-lg" />
    </button>
  );
};

export default BackToTop;
