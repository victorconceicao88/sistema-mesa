// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SistemaPedidos from './components/SistemaPedidos';
import InterfaceCliente from './components/InterfaceCliente'; // 👈 importar aqui

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SistemaPedidos />} />
          <Route 
            path="/cliente" 
            element={
              <InterfaceCliente 
                mesa={{ numero: 1 }} 
                cardapio={{
                  churrasco: [],
                  burgers: [],
                  porcoes: [],
                  bebidas: [],
                  sobremesas: []
                }} 
                onEnviarPedido={(pedido) => console.log('Pedido enviado:', pedido)}
                onVoltar={() => window.history.back()}
              />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
