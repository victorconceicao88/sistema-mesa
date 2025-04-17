// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SistemaPedidos from './components/SistemaPedidos';
import InterfaceCliente from './components/InterfaceCliente';

const cardapio = {
  churrasco: [
    { 
      id: 1, 
      nome: '🔥 Churrasco Misto', 
      preco: 12.00, 
      descricao: 'Escolha suas opções', 
      categoria: 'churrasco',
      customizavel: true,
      opcoes: {
        feijao: [
          { nome: 'De caldo', selecionado: false },
          { nome: 'Tropeiro', selecionado: false }
        ],
        acompanhamentos: [
          { nome: 'Banana frita', selecionado: false },
          { nome: 'Mandioca', selecionado: false },
          { nome: 'Batata frita', selecionado: false }
        ],
        salada: [
          { nome: 'Mista', selecionado: false },
          { nome: 'Vinagrete', selecionado: false },
          { nome: 'Não quer salada', selecionado: false }
        ],
        carnes: [
          { nome: 'Só maminha', selecionado: false, bloqueiaOutras: true },
          { nome: 'Peito de frango', selecionado: false },
          { nome: 'Coração', selecionado: false },
          { nome: 'Costelinha de porco', selecionado: false },
          { nome: 'Linguiça', selecionado: false }
        ]
      }
    },
    { 
      id: 2, 
      nome: '🥩 Linguiça Toscana', 
      preco: 12.00, 
      descricao: 'Escolha suas opções', 
      categoria: 'churrasco',
      customizavel: true,
      opcoes: {
        feijao: [
          { nome: 'De caldo', selecionado: false },
          { nome: 'Tropeiro', selecionado: false }
        ],
        acompanhamentos: [
          { nome: 'Banana frita', selecionado: false },
          { nome: 'Mandioca', selecionado: false },
          { nome: 'Batata frita', selecionado: false }
        ],
        salada: [
          { nome: 'Mista', selecionado: false },
          { nome: 'Vinagrete', selecionado: false },
          { nome: 'Não quer salada', selecionado: false }
        ]
      }
    },
    { 
      id: 3, 
      nome: '🐷 Costelinha', 
      preco: 12.00, 
      descricao: 'Escolha suas opções', 
      categoria: 'churrasco',
      customizavel: true,
      opcoes: {
        feijao: [
          { nome: 'De caldo', selecionado: false },
          { nome: 'Tropeiro', selecionado: false }
        ],
        acompanhamentos: [
          { nome: 'Banana frita', selecionado: false },
          { nome: 'Mandioca', selecionado: false },
          { nome: 'Batata frita', selecionado: false }
        ],
        salada: [
          { nome: 'Mista', selecionado: false },
          { nome: 'Vinagrete', selecionado: false },
          { nome: 'Não quer salada', selecionado: false }
        ]
      }
    },
    { 
      id: 4, 
      nome: '🍗 Peito de Frango', 
      preco: 12.00, 
      descricao: 'Escolha suas opções', 
      categoria: 'churrasco',
      customizavel: true,
      opcoes: {
        feijao: [
          { nome: 'De caldo', selecionado: false },
          { nome: 'Tropeiro', selecionado: false }
        ],
        acompanhamentos: [
          { nome: 'Banana frita', selecionado: false },
          { nome: 'Mandioca', selecionado: false },
          { nome: 'Batata frita', selecionado: false }
        ],
        salada: [
          { nome: 'Mista', selecionado: false },
          { nome: 'Vinagrete', selecionado: false },
          { nome: 'Não quer salada', selecionado: false }
        ]
      }
    },
    { 
      id: 5, 
      nome: '❤️ Coração', 
      preco: 12.00, 
      descricao: 'Escolha suas opções', 
      categoria: 'churrasco',
      customizavel: true,
      opcoes: {
        feijao: [
          { nome: 'De caldo', selecionado: false },
          { nome: 'Tropeiro', selecionado: false }
        ],
        acompanhamentos: [
          { nome: 'Banana frita', selecionado: false },
          { nome: 'Mandioca', selecionado: false },
          { nome: 'Batata frita', selecionado: false }
        ],
        salada: [
          { nome: 'Mista', selecionado: false },
          { nome: 'Vinagrete', selecionado: false },
          { nome: 'Não quer salada', selecionado: false }
        ]
      }
    }
  ],
  burgers: [
    { id: 6, nome: 'X-Salada', preco: 6.50, descricao: 'Pão, hambúrguer, queijo, alface e tomate', categoria: 'burgers' },
    { id: 7, nome: 'X-Bacon', preco: 8.00, descricao: 'Pão, hambúrguer, queijo, bacon', categoria: 'burgers' },
    { id: 8, nome: 'X-Especial', preco: 7.00, descricao: 'Pão, hambúrguer, queijo, ovo', categoria: 'burgers' },
    { id: 9, nome: 'X-Tudo', preco: 9.00, descricao: 'Pão, hambúrguer, queijo, presunto, ovo, bacon', categoria: 'burgers' },
    { id: 10, nome: 'X-Frango', preco: 8.00, descricao: 'Pão, frango grelhado, queijo', categoria: 'burgers' },
    { id: 11, nome: 'Combo', preco: 12.00, descricao: 'Lanche + batata + refrigerante', categoria: 'burgers' }
  ],
  porcoes: [
    { id: 12, nome: 'Queijo coalho', preco: 8.00, descricao: '', categoria: 'porcoes' },
    { id: 13, nome: 'Torresmo', preco: 7.50, descricao: '', categoria: 'porcoes' },
    { id: 14, nome: 'Carnes', preco: 10.00, descricao: '', categoria: 'porcoes' },
    { id: 15, nome: 'Porção de mandioca', preco: 6.00, descricao: '', categoria: 'porcoes' },
    { id: 16, nome: 'Batata frita', preco: 5.50, descricao: '', categoria: 'porcoes' }
  ],
  sobremesas: [
    { 
      id: 17, 
      nome: 'Açaí P', 
      preco: 6.00, 
      descricao: '300ml', 
      categoria: 'sobremesas',
      customizavel: true,
      opcoes: {
        adicionais: [
          { nome: 'Granola', selecionado: false },
          { nome: 'Leite condensado', selecionado: false },
          { nome: 'Leite ninho', selecionado: false },
          { nome: 'Banana', selecionado: false },
          { nome: 'Morango', selecionado: false }
        ],
        tipo: [
          { nome: 'Açaí puro', selecionado: false },
          { nome: 'Completo', selecionado: false }
        ]
      }
    },
    { 
      id: 18, 
      nome: 'Açaí G', 
      preco: 10.00, 
      descricao: '500ml', 
      categoria: 'sobremesas',
      customizavel: true,
      opcoes: {
        adicionais: [
          { nome: 'Granola', selecionado: false },
          { nome: 'Leite condensado', selecionado: false },
          { nome: 'Leite ninho', selecionado: false },
          { nome: 'Banana', selecionado: false },
          { nome: 'Morango', selecionado: false }
        ],
        tipo: [
          { nome: 'Açaí puro', selecionado: false },
          { nome: 'Completo', selecionado: false }
        ]
      }
    },
    { id: 19, nome: 'Pudim', preco: 3.00, descricao: '', categoria: 'sobremesas' },
    { id: 20, nome: 'Mousse', preco: 3.00, descricao: '', categoria: 'sobremesas' },
    { id: 21, nome: 'Gelado', preco: 3.00, descricao: '', categoria: 'sobremesas' },
    { id: 22, nome: 'Petit Gâteau', preco: 4.00, descricao: '', categoria: 'sobremesas' }
  ],
  bebidas: [
    { id: 23, nome: 'Água', preco: 1.00, descricao: '', categoria: 'bebidas' },
    { id: 24, nome: 'Água com gás', preco: 1.50, descricao: '', categoria: 'bebidas' },
    { id: 25, nome: 'Cachaça', preco: 1.50, descricao: '', categoria: 'bebidas' },
    { id: 26, nome: 'Café', preco: 1.00, descricao: '', categoria: 'bebidas' },
    { id: 27, nome: 'Galão', preco: 1.50, descricao: '', categoria: 'bebidas' },
    { id: 28, nome: 'Caipirinha', preco: 6.00, descricao: '', categoria: 'bebidas' },
    { id: 29, nome: 'Caneca', preco: 3.50, descricao: '', categoria: 'bebidas' },
    { id: 30, nome: 'Compal', preco: 2.00, descricao: '', categoria: 'bebidas' },
    { id: 31, nome: 'Constantino', preco: 2.00, descricao: '', categoria: 'bebidas' },
    { id: 32, nome: 'Vinho branco (garrafa)', preco: 10.00, descricao: '', categoria: 'bebidas' },
    { id: 33, nome: 'Vinho tinto (garrafa)', preco: 13.00, descricao: '', categoria: 'bebidas' },
    { id: 34, nome: 'Ice Tea', preco: 2.00, descricao: '', categoria: 'bebidas' },
    { id: 35, nome: 'Imperial', preco: 2.00, descricao: '', categoria: 'bebidas' },
    { id: 36, nome: 'Jarro de vinho', preco: 10.00, descricao: '', categoria: 'bebidas' },
    { id: 37, nome: 'Meio jarro de vinho', preco: 6.00, descricao: '', categoria: 'bebidas' }
  ]
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SistemaPedidos cardapio={cardapio} />} />
          <Route 
            path="/cliente" 
            element={
              <InterfaceCliente 
                onEnviarPedido={(pedido) => console.log('Pedido enviado:', pedido)}
                onVoltar={() => window.history.back()}
                cardapio={cardapio} // Passa o cardápio para o cliente
              />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
