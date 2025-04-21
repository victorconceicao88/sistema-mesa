// InterfaceCliente.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiArrowLeft, FiPlus, FiMinus, FiTrash2, FiCheck, FiClock 
} from 'react-icons/fi';
import { 
  FaUtensils, FaGlassCheers, FaIceCream, FaWineGlassAlt, 
  FaQrcode, FaTable 
} from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set } from 'firebase/database';

// Configuração do Firebase (mesma do sistema principal)
const firebaseConfig = {
  apiKey: "AIzaSyDPGwoIF7ReMQsjXGngZ86vuC1P2X0iV0E",
  authDomain: "auto-astral-b5295.firebaseapp.com",
  databaseURL: "https://auto-astral-b5295-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "auto-astral-b5295",
  storageBucket: "auto-astral-b5295.appspot.com",
  messagingSenderId: "865984431676",
  appId: "1:865984431676:web:1202dc70df895259c46539"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const InterfaceCliente = ({ cardapio, onVoltar }) => {
  const [searchParams] = useSearchParams();
  const mesaNumero = searchParams.get('mesa') || null;
  const comandaNumero = searchParams.get('comanda') || null;
  
  const [pedidoCliente, setPedidoCliente] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(Object.keys(cardapio)[0]);
  const [customizacaoItem, setCustomizacaoItem] = useState(null);
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  const adicionarItem = (item) => {
    const itemExistente = pedidoCliente.find(i => 
      i.id === item.id && i.observacoes === (item.observacoes || '')
    );
    
    if (itemExistente) {
      setPedidoCliente(pedidoCliente.map(i => 
        i.id === item.id && i.observacoes === (item.observacoes || '') 
          ? { ...i, quantidade: i.quantidade + 1 } 
          : i
      ));
    } else {
      setPedidoCliente([...pedidoCliente, { ...item, quantidade: 1 }]);
    }
  };

  const removerItem = (index) => {
    setPedidoCliente(pedidoCliente.filter((_, i) => i !== index));
  };

  const ajustarQuantidade = (index, incremento) => {
    const novosItens = [...pedidoCliente];
    const novaQuantidade = novosItens[index].quantidade + incremento;
    
    if (novaQuantidade < 1) {
      removerItem(index);
    } else {
      novosItens[index].quantidade = novaQuantidade;
      setPedidoCliente(novosItens);
    }
  };

  const enviarPedido = async () => {
    if (pedidoCliente.length === 0) return;
    
    const total = pedidoCliente.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const pedidoData = {
      itens: pedidoCliente,
      total,
      timestamp: new Date().toISOString(),
      status: 'pendente'
    };

    if (mesaNumero) {
      pedidoData.tipo = 'mesa';
      pedidoData.mesaNumero = mesaNumero;
    } else if (comandaNumero) {
      pedidoData.tipo = 'comanda';
      pedidoData.comandaNumero = comandaNumero;
    }

    if (nomeCliente) pedidoData.clienteNome = nomeCliente;
    if (telefoneCliente) pedidoData.clienteTelefone = telefoneCliente;
    if (observacoes) pedidoData.observacoes = observacoes;

    try {
      const pedidosRef = ref(database, 'pedidosPendentes');
      await push(pedidosRef, pedidoData);
      
      setPedidoEnviado(true);
      setPedidoCliente([]);
      
      setTimeout(() => {
        setPedidoEnviado(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
    }
  };

  const renderIconeCategoria = (categoria) => {
    switch (categoria) {
      case 'churrasco': return <FaUtensils className="inline mr-2" />;
      case 'burgers': return <FaUtensils className="inline mr-2" />;
      case 'porcoes': return <FaUtensils className="inline mr-2" />;
      case 'bebidas': return <FaWineGlassAlt className="inline mr-2" />;
      case 'sobremesas': return <FaIceCream className="inline mr-2" />;
      default: return <FaGlassCheers className="inline mr-2" />;
    }
  };

  const ModalCustomizacao = ({ item, onClose, onConfirm }) => {
    const [opcoes, setOpcoes] = useState(JSON.parse(JSON.stringify(item.opcoes || {})));
    
    const toggleOpcao = (grupo, index) => {
      const novasOpcoes = { ...opcoes };
      
      if (novasOpcoes[grupo][index].bloqueiaOutras) {
        novasOpcoes[grupo] = novasOpcoes[grupo].map((opcao, i) => ({
          ...opcao,
          selecionado: i === index
        }));
      } else {
        novasOpcoes[grupo][index].selecionado = !novasOpcoes[grupo][index].selecionado;
      }

      setOpcoes(novasOpcoes);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
        <div className="bg-white rounded-lg p-4 max-w-md w-full">
          <h3 className="text-lg font-bold mb-2">{item.nome}</h3>
          
          {Object.entries(opcoes).map(([grupo, itens]) => (
            <div key={grupo} className="mb-4">
              <h4 className="font-medium capitalize mb-2">{grupo}</h4>
              <div className="space-y-2">
                {itens.map((opcao, i) => (
                  <div 
                    key={i}
                    className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleOpcao(grupo, i)}
                  >
                    <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center ${
                      opcao.selecionado ? 'bg-indigo-600' : 'border border-gray-300'
                    }`}>
                      {opcao.selecionado && <FiCheck className="text-white" size={14} />}
                    </div>
                    <span>{opcao.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end space-x-2 mt-4">
            <button 
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Cancelar
            </button>
            <button
            onClick={() => onConfirm({
              ...item,
              observacoes: Object.entries(opcoes)
                .flatMap(([grupo, itens]) => 
                  itens.filter(o => o.selecionado).map(o => `${grupo}: ${o.nome}`)
                )
                .join(', ')  // O .join() deve ser após o .map()
            })}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Confirmar
          </button>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#FFB501] p-4 shadow-sm" style={{ color: '#3d1106' }}>
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              {mesaNumero ? `Mesa ${mesaNumero}` : `Comanda ${comandaNumero}`}
            </h1>
            <p className="text-sm">Faça seu pedido</p>
          </div>
          <button 
            onClick={onVoltar}
            className="p-2 rounded-full bg-white bg-opacity-20"
          >
            <FiArrowLeft size={20} />
          </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {pedidoEnviado && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-4 text-center">
            Pedido enviado para aprovação!
          </div>
        )}

        {!mesaNumero && !comandaNumero && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="font-bold mb-2">Identificação</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seu nome (opcional)</label>
                <input
                  type="text"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Como devemos chamar você?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone (opcional)</label>
                <input
                  type="tel"
                  value={telefoneCliente}
                  onChange={(e) => setTelefoneCliente(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {Object.keys(cardapio).map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaAtiva(categoria)}
                className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  categoriaAtiva === categoria ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100'
                }`}
              >
                {renderIconeCategoria(categoria)}
                {categoria === 'churrasco' ? 'Churrasco' : 
                 categoria === 'burgers' ? 'Burgers' :
                 categoria === 'porcoes' ? 'Porções' :
                 categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {cardapio[categoriaAtiva].map(item => (
              <button
                key={item.id}
                onClick={() => item.customizavel ? setCustomizacaoItem(item) : adicionarItem(item)}
                className="bg-[#57aed1] hover:bg-[#76bdda] text-[#3d1106] rounded-lg p-3 transition flex flex-col items-center text-center h-full"
              >
                <h3 className="font-medium text-sm mb-1">{item.nome}</h3>
                <div className="mt-auto font-bold text-xs">€ {item.preco.toFixed(2)}</div>
                {item.descricao && <div className="text-xs mt-1">{item.descricao}</div>}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 sticky bottom-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows="2"
              placeholder="Alergias, preferências..."
            ></textarea>
          </div>

          <div className="max-h-40 overflow-y-auto mb-4">
            {pedidoCliente.length === 0 ? (
              <div className="text-center py-4 text-gray-500">Seu pedido está vazio</div>
            ) : (
              <div className="space-y-3">
                {pedidoCliente.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.quantidade}x {item.nome}</div>
                      {item.observacoes && (
                        <div className="text-xs text-gray-600">{item.observacoes}</div>
                      )}
                    </div>
                    <div className="flex items-center ml-2">
                      <span className="text-sm font-medium mr-3">€ {(item.preco * item.quantidade).toFixed(2)}</span>
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => ajustarQuantidade(index, -1)}
                          className="p-1 text-gray-500 hover:text-indigo-700"
                        >
                          <FiMinus size={14} />
                        </button>
                        <button 
                          onClick={() => ajustarQuantidade(index, 1)}
                          className="p-1 text-gray-500 hover:text-indigo-700"
                        >
                          <FiPlus size={14} />
                        </button>
                        <button 
                          onClick={() => removerItem(index)}
                          className="p-1 text-red-500"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="text-lg font-bold">
              € {pedidoCliente.reduce((sum, item) => sum + (item.preco * item.quantidade), 0).toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={enviarPedido}
            disabled={pedidoCliente.length === 0}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center ${
              pedidoCliente.length === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <FiCheck className="mr-2" /> Enviar Pedido
          </button>
        </div>
      </main>

      {customizacaoItem && (
        <ModalCustomizacao 
          item={customizacaoItem}
          onClose={() => setCustomizacaoItem(null)}
          onConfirm={(itemCustomizado) => {
            adicionarItem(itemCustomizado);
            setCustomizacaoItem(null);
          }}
        />
      )}
    </div>
  );
};

export default InterfaceCliente;