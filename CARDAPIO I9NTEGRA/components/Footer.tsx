import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informações do restaurante */}
          <div>
            <h3 className="text-xl font-bold mb-4">Integra Bar & Restaurante</h3>
            <p className="text-gray-300 mb-4">
              Desfrute dos melhores sabores em um ambiente acolhedor e moderno.
              Nossa missão é proporcionar experiências gastronômicas únicas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                📘 Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                📷 Instagram
              </a>
            </div>
          </div>

          {/* Horário de funcionamento */}
          <div>
            <h3 className="text-xl font-bold mb-4">Horário de Funcionamento</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Segunda a Sexta:</span>
                <span>18h às 00h</span>
              </div>
              <div className="flex justify-between">
                <span>Sábado:</span>
                <span>18h às 01h</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo:</span>
                <span>18h às 23h</span>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <span>contato@integra.com.br</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>Rua das Flores, 123<br />São Paulo, SP - 01234-567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Integra Bar & Restaurante. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 