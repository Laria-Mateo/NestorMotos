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
      <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#25D366" />
        <path fill="#fff" d="M16.7 15.3l-1.6 1.6c-2.9-1.1-5.4-3.6-6.5-6.5l1.6-1.6c.2-.2.3-.5.2-.8l-.5-2a1 1 0 00-1-.8H6a1 1 0 00-1 1c.1 3.9 1.7 7.6 4.4 10.3s6.4 4.3 10.3 4.4a1 1 0 001-1v-1.9a1 1 0 00-.8-1l-2-.5c-.3-.1-.6 0-.8.2z"/>
      </svg>
    </button>
  );
};

export default BotonWhatsappFlotante; 