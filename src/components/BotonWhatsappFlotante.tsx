import React from 'react';

const scrollToContactForm = () => {
  const form = document.querySelector('form');
  if (form) {
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (form.querySelector('input, select, textarea') as HTMLElement)?.focus();
  }
};

const BotonWhatsappFlotante: React.FC = () => {
  const handleClick = () => {
    scrollToContactForm();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all border-4 border-white"
      aria-label="Ir al formulario de WhatsApp"
      style={{ boxShadow: '0 4px 24px 0 #0002' }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#25D366" />
        <path d="M23.5 17.5c-.3-.2-1.8-.9-2.1-1-..." fill="#fff" />
        <path d="M16 6C10.5 6 6 10.5 6 16c0 2.1.6 4.1 1.7 5.8L6 26l4.3-1.1C11.9 25.6 13.9 26 16 26c5.5 0 10-4.5 10-10S21.5 6 16 6z" fill="#fff" fillOpacity=".2" />
      </svg>
    </button>
  );
};

export default BotonWhatsappFlotante; 