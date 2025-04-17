import React, { useState, useEffect } from 'react';
import { FiCoffee, FiUser, FiPlus, FiMinus, FiTrash2, FiPrinter, FiCheck, FiX, FiArrowLeft, FiArrowRight,} from 'react-icons/fi';
import { FaUtensils, FaGlassCheers, FaIceCream, FaWineGlassAlt, FaClock, FaRegCheckCircle, FaRegTimesCircle, FaEdit } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, update,get } from 'firebase/database';
import { QRCodeCanvas } from 'qrcode.react';
import { AiOutlineQrcode } from 'react-icons/ai';




const firebaseConfig = {
  apiKey: "AIzaSyBbJmwq5Ia68S3UPhnaUerEl0paRdXQNqM",
  authDomain: "vivi-sala.firebaseapp.com",
  databaseURL: "https://vivi-sala-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vivi-sala",
  storageBucket: "vivi-sala.appspot.com",
  messagingSenderId: "1082904016563",
  appId: "1:1082904016563:web:044e5502b10e0ae4d922c6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const SistemaPedidos = () => {
  // Estados existentes
  // Estados existentes
  const [telaAtiva, setTelaAtiva] = useState('inicio'); // A tela ativa (início, categoria, etc.)
  const [areaSelecionada, setAreaSelecionada] = useState(null); // Área selecionada (ex: mesas, churrasco, etc.)
  const [mesas, setMesas] = useState([]); // Listagem das mesas
  const [mesaSelecionada, setMesaSelecionada] = useState(null); // Mesa selecionada
  const [categoriaAtiva, setCategoriaAtiva] = useState('churrasco'); // Categoria ativa (churrasco, burgers, etc.)
  const [pedidoEmAndamento, setPedidoEmAndamento] = useState([]); // Itens do pedido atual
  const [totalConta, setTotalConta] = useState(0); // Total da conta
  const [notificacao, setNotificacao] = useState({ mostrar: false, mensagem: '', tipo: '' }); // Notificação
  const [tempoAtendimento, setTempoAtendimento] = useState('00:00'); // Tempo de atendimento
  const [abaPedidosAtiva, setAbaPedidosAtiva] = useState('todos'); // Aba ativa de pedidos
  const [mostrarConfirmacaoCozinha, setMostrarConfirmacaoCozinha] = useState(false); // Mostrar confirmação para cozinha
  const [mostrarResumoFechamento, setMostrarResumoFechamento] = useState(false); // Mostrar resumo de fechamento
  const [customizacaoItem, setCustomizacaoItem] = useState(null); // Item sendo customizado
  
  // Novos estados para o fluxo QR Code
  const [pedidosPendentes, setPedidosPendentes] = useState([]); // Pedidos pendentes (para exibir na tela)
  const [mostrarQRCode, setMostrarQRCode] = useState(false); // Controla se o QR Code deve ser exibido
  const [modoCliente, setModoCliente] = useState(false); // Verifica se o sistema está no modo cliente
  const [pedidoCliente, setPedidoCliente] = useState([]); // Pedido feito pelo cliente (para armazenar e manipular)

  // Cardápio do restaurante
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
      { id: 37, nome: 'Meio jarro de vinho', preco: 6.00, descricao: '', categoria: 'bebidas' },
      { id: 38, nome: 'Refrigerante', preco: 2.00, descricao: '', categoria: 'bebidas' },
      { id: 39, nome: 'Sagres', preco: 2.00, descricao: '', categoria: 'bebidas' },
      { id: 40, nome: 'Sangria', preco: 15.00, descricao: '', categoria: 'bebidas' },
      { id: 41, nome: 'Sangria (0.5L)', preco: 8.00, descricao: '', categoria: 'bebidas' },
      { id: 42, nome: 'Sangria (taça)', preco: 5.00, descricao: '', categoria: 'bebidas' },
      { id: 43, nome: 'Somersby', preco: 2.50, descricao: '', categoria: 'bebidas' },
      { id: 44, nome: 'Sumo natural', preco: 3.00, descricao: '', categoria: 'bebidas' },
      { id: 45, nome: 'Super Bock', preco: 2.00, descricao: '', categoria: 'bebidas' },
      { id: 46, nome: 'Taça de vinho', preco: 3.00, descricao: '', categoria: 'bebidas' }
    ]
  };

// Atualize o useEffect que escuta as mesas para:
useEffect(() => {
  const mesasRef = ref(database, 'mesas');
  const listener = onValue(mesasRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const mesasAtualizadas = Object.keys(data).map(key => ({ 
        id: key, 
        ...data[key],
        pedidosPendentes: data[key].pedidosPendentes || []
      }));
      setMesas(mesasAtualizadas);
      
      if (mesaSelecionada) {
        const mesaAtual = mesasAtualizadas.find(m => m.id === mesaSelecionada.id);
        if (mesaAtual) {
          setMesaSelecionada(mesaAtual);
          setPedidoEmAndamento(mesaAtual.pedidos || []);
          setPedidosPendentes(mesaAtual.pedidosPendentes || []);
        }
      }
    }
  });
  
  return () => off(mesasRef, 'value', listener);
}, [mesaSelecionada?.id]);

    // Função para gerar URL do QR Code
    const gerarUrlQRCode = (mesaId) => {
      return `${window.location.origin}/cliente?mesa=${mesaId}`;
    };
    

  
// Função para adicionar pedido do cliente
const adicionarPedidoCliente = async (pedido) => {
  try {
    if (!mesaSelecionada?.id) {
      mostrarNotificacao('Nenhuma mesa selecionada', 'erro');
      return;
    }

    const pedidoCompleto = {
      itens: pedido,
      hora: new Date().toISOString(),
      status: 'pendente'
    };

    // Obter os pedidos pendentes atuais
    const mesaRef = ref(database, `mesas/${mesaSelecionada.id}`);
    const snapshot = await get(mesaRef);
    const mesaData = snapshot.val() || {};
    const pedidosPendentesAtuais = mesaData.pedidosPendentes || [];

    // Adicionar novo pedido
    await update(mesaRef, {
      pedidosPendentes: [...pedidosPendentesAtuais, pedidoCompleto]
    });

    mostrarNotificacao('Pedido enviado para aprovação do garçom');
    setModoCliente(false);
  } catch (error) {
    console.error("Erro ao enviar pedido:", error);
    mostrarNotificacao('Erro ao enviar pedido', 'erro');
  }
};
// Funções para aprovar/rejeitar pedidos
const aprovarPedido = async (pedidoIndex) => {
  const pedido = pedidosPendentes[pedidoIndex];
  const novosPedidos = [...mesaSelecionada.pedidos, ...pedido.itens];
  
  await update(ref(database, `mesas/${mesaSelecionada.id}`), {
    pedidos: novosPedidos,
    pedidosPendentes: pedidosPendentes.filter((_, i) => i !== pedidoIndex)
  });
};

const rejeitarPedido = async (pedidoIndex) => {
  await update(ref(database, `mesas/${mesaSelecionada.id}/pedidosPendentes`), 
    pedidosPendentes.filter((_, i) => i !== pedidoIndex)
  );
};
  
    // Função para editar pedido do cliente
    const editarPedido = (pedidoIndex) => {
      setPedidoEmAndamento([
        ...pedidoEmAndamento,
        ...pedidosPendentes[pedidoIndex].itens
      ]);
      rejeitarPedido(pedidoIndex);
    };

  // Componente para mostrar pedidos pendentes
  const PedidosPendentes = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Pedidos Pendentes - Mesa {mesaSelecionada.numero}</h3>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4">
          {pedidosPendentes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum pedido pendente</div>
          ) : (
            <div className="space-y-4">
              {pedidosPendentes.map((pedido, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm text-gray-500">
                        {new Date(pedido.hora).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => aprovarPedido(index)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      >
                        Aprovar
                      </button>
                      <button 
                        onClick={() => rejeitarPedido(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    {pedido.itens.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.quantidade}x {item.nome}</span>
                          {item.observacoes && (
                            <div className="text-xs text-gray-600">{item.observacoes}</div>
                          )}
                        </div>
                        <span>€ {(item.preco * item.quantidade).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <button 
            onClick={() => setPedidosPendentes([])}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );

   // Componente para mostrar QR Code
   const ModalQRCode = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">QR Code - Mesa {mesaSelecionada.numero}</h3>
          <button onClick={() => setMostrarQRCode(false)} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="flex justify-center mb-4">
          <QRCodeCanvas 
            value={gerarUrlQRCode(mesaSelecionada.id)} 
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <p className="text-sm text-gray-600 text-center mb-4">
          Escaneie este QR Code para acessar o cardápio digital desta mesa
        </p>
      </div>
    </div>
  );

  // Interface do Cliente (simplificada)
  const InterfaceCliente = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#FFB501] p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Mesa {mesaSelecionada.numero}</h1>
          <button 
            onClick={() => setModoCliente(false)}
            className="p-2 rounded-full bg-white bg-opacity-20"
          >
            <FiArrowLeft size={20} />
          </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
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
                onClick={() => item.customizavel ? abrirCustomizacao(item) : adicionarItem(item, true)}
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
                      <button 
                        onClick={() => {
                          setPedidoCliente(pedidoCliente.filter((_, i) => i !== index));
                        }}
                        className="text-red-500 p-1"
                      >
                        <FiTrash2 size={16} />
                      </button>
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
            onClick={adicionarPedidoCliente}
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
    </div>
  );


useEffect(() => {
  if (mesaSelecionada?.horaAbertura) {
    const calcularTempo = () => {
      const diff = Math.floor((new Date() - new Date(mesaSelecionada.horaAbertura)) / 1000);
      const minutos = Math.floor(diff / 60);
      const segundos = Math.floor(diff % 60);
      setTempoAtendimento(
        `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
      );
    };
    
    calcularTempo();
    const interval = setInterval(calcularTempo, 1000);
    return () => clearInterval(interval);
  } else {
    setTempoAtendimento('00:00');
  }
}, [mesaSelecionada?.horaAbertura]);

  useEffect(() => {
    setTotalConta(pedidoEmAndamento.reduce((sum, item) => sum + (item.preco * item.quantidade), 0));
  }, [pedidoEmAndamento]);

  const mostrarNotificacao = (mensagem, tipo = 'sucesso') => {
    setNotificacao({ mostrar: true, mensagem, tipo });
    setTimeout(() => setNotificacao({ mostrar: false, mensagem: '', tipo: '' }), 3000);
  };

  const selecionarArea = (area) => {
    setAreaSelecionada(area);
    setTelaAtiva('mesas');
  };



  const selecionarMesa = async (mesa) => {
    // Se a mesa não está ocupada, marca como ocupada
    if (!mesa.ocupada) {
      const mesaAtualizada = {
        ...mesa,
        ocupada: true,
        horaAbertura: new Date().toISOString(),
        pedidos: [],
        total: 0
      };
      
      try {
        await update(ref(database, `mesas/${mesa.id}`), mesaAtualizada);
        setMesaSelecionada(mesaAtualizada);
        setPedidoEmAndamento([]);
      } catch (error) {
        console.error("Erro ao atualizar mesa:", error);
        mostrarNotificacao('Erro ao abrir mesa', 'erro');
      }
    } else {
      setMesaSelecionada(mesa);
      setPedidoEmAndamento(mesa.pedidos || []);
    }
  };
  const abrirCustomizacao = (item) => {
    setCustomizacaoItem({
      ...item,
      opcoes: JSON.parse(JSON.stringify(item.opcoes || {})) // Deep clone
    });
  };

  const fecharCustomizacao = () => {
    setCustomizacaoItem(null);
  };

  const toggleOpcao = (tipo, index) => {
    setCustomizacaoItem(prev => {
      if (!prev || !prev.opcoes) return prev;
      
      const newItem = JSON.parse(JSON.stringify(prev));
      
      // Tratamento especial para carnes
      if (tipo === 'carnes') {
        const opcao = newItem.opcoes.carnes[index];
        
        // Se for "Só maminha"
        if (opcao.nome === 'Só maminha') {
          const isSelected = opcao.selecionado;
          
          // Alterna o estado e desmarca outras
          newItem.opcoes.carnes.forEach(c => {
            c.selecionado = c.nome === 'Só maminha' ? !isSelected : false;
          });
        } 
        // Se for outra carne
        else {
          // Desmarca "Só maminha" se estiver marcada
          if (newItem.opcoes.carnes[0].selecionado) {
            newItem.opcoes.carnes[0].selecionado = false;
          }
          
          // Conta carnes selecionadas (exceto "Só maminha")
          const carnesSelecionadas = newItem.opcoes.carnes
            .slice(1)
            .filter(c => c.selecionado).length;
          
          // Se já tem 2 selecionadas e a atual não está selecionada, não faz nada
          if (carnesSelecionadas >= 2 && !opcao.selecionado) {
            return prev;
          }
          
          // Alterna o estado da carne selecionada
          newItem.opcoes.carnes[index].selecionado = !opcao.selecionado;
        }
      }
      // Para outros tipos de opções (radio buttons)
      else if (['feijao', 'acompanhamentos', 'salada', 'tipo'].includes(tipo)) {
        // Desmarca todos e marca apenas o selecionado
        newItem.opcoes[tipo].forEach((opt, i) => {
          opt.selecionado = i === index;
        });
        
        // Tratamento especial para açaí
        if (tipo === 'tipo' && newItem.opcoes.tipo[index].nome === 'Completo') {
          newItem.opcoes.adicionais?.forEach(a => {
            a.selecionado = true;
          });
        } else if (tipo === 'tipo' && newItem.opcoes.tipo[index].nome === 'Açaí puro') {
          newItem.opcoes.adicionais?.forEach(a => {
            a.selecionado = false;
          });
        }
      }
      // Para adicionais (checkboxes normais)
      else if (tipo === 'adicionais') {
        newItem.opcoes.adicionais[index].selecionado = 
          !newItem.opcoes.adicionais[index].selecionado;
      }
      
      return newItem;
    });
  };
  const confirmarCustomizacao = () => {
    const itemCustomizado = {
      ...customizacaoItem,
      observacoes: gerarObservacoes(customizacaoItem)
    };
    
    adicionarItem(itemCustomizado);
    fecharCustomizacao();
  };

  const gerarObservacoes = (item) => {
    if (!item.opcoes) return '';
    
    let observacoes = [];
    
    // Tratamento para Churrasco Misto
    if (item.nome.includes('Churrasco Misto')) {
      // Carnes
      const carnesSelecionadas = item.opcoes.carnes.filter(c => c.selecionado);
      if (carnesSelecionadas.length > 0) {
        observacoes.push(`Carnes: ${carnesSelecionadas.map(c => c.nome).join(', ')}`);
      }
    }
    
    // Feijão
    const feijaoSelecionado = item.opcoes.feijao?.find(f => f.selecionado);
    if (feijaoSelecionado) {
      observacoes.push(`Feijão: ${feijaoSelecionado.nome}`);
    }
    
    // Acompanhamentos
    const acompanhamentosSelecionados = item.opcoes.acompanhamentos?.filter(a => a.selecionado);
    if (acompanhamentosSelecionados?.length > 0) {
      observacoes.push(`Acomp: ${acompanhamentosSelecionados.map(a => a.nome).join(', ')}`);
    }
    
    // Salada
    const saladaSelecionada = item.opcoes.salada?.find(s => s.selecionado);
    if (saladaSelecionada && !saladaSelecionada.nome.includes('Não quer')) {
      observacoes.push(`Salada: ${saladaSelecionada.nome}`);
    }
    
    // Açaí - Adicionais
    if (item.nome.includes('Açaí')) {
      const adicionaisSelecionados = item.opcoes.adicionais?.filter(a => a.selecionado);
      if (adicionaisSelecionados?.length > 0) {
        observacoes.push(`Adicionais: ${adicionaisSelecionados.map(a => a.nome).join(', ')}`);
      }
    }
    
    return observacoes.join(' | ');
  };

  const adicionarItem = (item) => {
    const itemExistente = pedidoEmAndamento.find(i => 
      i.id === item.id && 
      (!i.observacoes || i.observacoes === item.observacoes)
    );
    
    setPedidoEmAndamento(itemExistente 
      ? pedidoEmAndamento.map(i => 
          i.id === item.id && 
          (!i.observacoes || i.observacoes === item.observacoes) 
            ? { ...i, quantidade: i.quantidade + 1 } 
            : i
        )
      : [...pedidoEmAndamento, { ...item, quantidade: 1, enviado: false }]
    );
    mostrarNotificacao(`${item.nome} adicionado`);
  };

  const removerItem = async (id, observacoes = '') => {
    try {
      // Filtra os itens mantendo apenas os que NÃO correspondem ao item a ser removido
      const novosPedidos = pedidoEmAndamento.filter(item => {
        // Comparação básica para itens não customizados
        if (!item.observacoes && !observacoes) {
          return item.id !== id;
        }
        // Comparação completa para itens customizados
        return !(item.id === id && item.observacoes === observacoes);
      });
  
      // Atualiza o estado local imediatamente para feedback visual
      setPedidoEmAndamento(novosPedidos);
  
      // Prepara os dados para atualização no Firebase
      const atualizacao = {
        pedidos: novosPedidos,
        itensCozinha: novosPedidos.filter(item => item.categoria !== 'bebidas'),
        itensBar: novosPedidos.filter(item => item.categoria === 'bebidas'),
        total: novosPedidos.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
      };
  
      // Atualiza no Firebase
      await update(ref(database, `mesas/${mesaSelecionada.id}`), atualizacao);
      
      mostrarNotificacao('Item removido com sucesso');
  
    } catch (error) {
      console.error("Erro ao remover item:", error);
      mostrarNotificacao('Erro ao remover item', 'erro');
      // Reverte para o estado anterior em caso de erro
      setPedidoEmAndamento([...pedidoEmAndamento]);
    }
  };
  

  const ajustarQuantidade = (id, incremento) => {
    setPedidoEmAndamento(pedidoEmAndamento.map(item => {
      if (item.id === id) {
        const novaQuantidade = item.quantidade + incremento;
        return novaQuantidade < 1 ? item : { ...item, quantidade: novaQuantidade };
      }
      return item;
    }));
  };

  const atualizarMesaNoFirebase = async (mesaAtualizada) => {
    try {
      await update(ref(database, `mesas/${mesaAtualizada.id}`), mesaAtualizada);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar mesa:', error);
      mostrarNotificacao('Erro ao salvar pedido', 'erro');
      return false;
    }
  };

  const salvarPedido = async () => {
    if (pedidoEmAndamento.length === 0) {
      mostrarNotificacao('Adicione itens ao pedido', 'erro');
      return;
    }
  
    const mesaAtualizada = {
      ...mesaSelecionada,
      ocupada: true, // Garante que a mesa está marcada como ocupada
      pedidos: pedidoEmAndamento,
      itensCozinha: pedidoEmAndamento.filter(item => 
        item.categoria !== 'bebidas'
      ),
      itensBar: pedidoEmAndamento.filter(item => 
        item.categoria === 'bebidas'
      ),
      total: pedidoEmAndamento.reduce((sum, item) => sum + (item.preco * item.quantidade), 0),
      horaAbertura: mesaSelecionada.horaAbertura || new Date().toISOString() // Mantém ou cria a hora de abertura
    };
  
    try {
      await update(ref(database, `mesas/${mesaSelecionada.id}`), mesaAtualizada);
      setMesaSelecionada(mesaAtualizada);
      
      const itensCozinha = pedidoEmAndamento.filter(item => 
        ['churrasco', 'burgers', 'porcoes', 'sobremesas'].includes(item.categoria)
      );
  
      if (abaPedidosAtiva === 'cozinha' && itensCozinha.length > 0) {
        setMostrarConfirmacaoCozinha(true);
      } else {
        mostrarNotificacao(`Pedido atualizado - Mesa ${mesaSelecionada.numero}`);
      }
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      mostrarNotificacao('Erro ao salvar pedido', 'erro');
    }
  };
  const imprimirPedidoCozinha = async (novosItens) => {
    if (!navigator.bluetooth) {
      mostrarNotificacao('Seu navegador não suporta Bluetooth', 'erro');
      return;
    }
  
    try {
      const itensCozinha = novosItens.filter(item => 
        ['churrasco', 'burgers', 'porcoes', 'sobremesas'].includes(item.categoria)
      );
  
      if (itensCozinha.length === 0) return;
  
      // Função para sanitizar texto (remove TUDO que não for ASCII básico)
      const sanitize = (text) => {
        return text
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^\x20-\x7E]/g, '')    // Mantém apenas ASCII imprimível
          .replace(/[,.!?;:]/g, ' ')        // Substitui pontuação por espaço
          .replace(/\s+/g, ' ')             // Remove espaços extras
          .trim();
      };
  
      // Configurações ESC/POS (apenas comandos básicos)
      const cmd = {
        init: new Uint8Array([0x1B, 0x40]),
        center: new Uint8Array([0x1B, 0x61, 0x01]),
        left: new Uint8Array([0x1B, 0x61, 0x00]),
        boldOn: new Uint8Array([0x1B, 0x45, 0x01]),
        boldOff: new Uint8Array([0x1B, 0x45, 0x00]),
        cut: new Uint8Array([0x1D, 0x56, 0x01]),
        lineBreak: new Uint8Array([0x0A]),
        feed: new Uint8Array([0x1B, 0x64, 0x03])
      };
  
      // Conecta à impressora
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "BlueTooth Printer" }],
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
      });
  
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
      const encoder = new TextEncoder();
  
      // Sequência de impressão
      await characteristic.writeValue(cmd.init);
      await characteristic.writeValue(cmd.center);
      await characteristic.writeValue(cmd.boldOn);
      await characteristic.writeValue(encoder.encode("COZINHA\n"));
      await characteristic.writeValue(encoder.encode(`MESA ${mesaSelecionada.numero}\n`));
      await characteristic.writeValue(encoder.encode(`${formatTime(new Date())}\n\n`));
      await characteristic.writeValue(cmd.left);
      
      // Itens do pedido (com texto sanitizado)
      for (const item of itensCozinha) {
        await characteristic.writeValue(cmd.boldOn);
        await characteristic.writeValue(encoder.encode(`${item.quantidade}x ${sanitize(item.nome)}\n`));
        await characteristic.writeValue(cmd.boldOff);
        
        if (item.observacoes) {
          const cleanObs = sanitize(item.observacoes);
          const obsLines = cleanObs.split(' ');
          let currentLine = '';
          
          // Quebra observações em linhas de até 24 caracteres
          for (const word of obsLines) {
            if ((currentLine + word).length > 24) {
              await characteristic.writeValue(encoder.encode(` ${currentLine}\n`));
              currentLine = word;
            } else {
              currentLine += (currentLine ? ' ' : '') + word;
            }
          }
          if (currentLine) {
            await characteristic.writeValue(encoder.encode(` ${currentLine}\n`));
          }
        }
        await characteristic.writeValue(cmd.lineBreak);
      }
  
      // Rodapé sanitizado
      await characteristic.writeValue(encoder.encode("------------------------\n"));
      await characteristic.writeValue(cmd.center);
      await characteristic.writeValue(encoder.encode("PEDIDO ENVIADO\n"));
      await characteristic.writeValue(encoder.encode(`${formatDate(new Date())}\n`));
      
      // Espaçamento e corte
      await characteristic.writeValue(cmd.feed);
      await characteristic.writeValue(cmd.cut);
  
    } catch (error) {
      console.error('Erro na impressao:', error);
      mostrarNotificacao('Erro ao imprimir', 'erro');
    }
  };
  
  // Funções auxiliares sanitizadas
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      .replace(/[^0-9:]/g, '');
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    }).replace(/[^0-9/]/g, '');
  };
  // Função para enviar pedido para Firebase e imprimir
  const enviarPedidoParaFirebase = async () => {
    try {
      // Filtra apenas itens não enviados
      const novosItens = pedidoEmAndamento
        .filter(item => !item.enviado)
        .map(item => ({ ...item, enviado: true }));
  
      if (novosItens.length === 0) {
        mostrarNotificacao('Nenhum item novo para enviar');
        setMostrarConfirmacaoCozinha(false);
        return;
      }
  
      // Atualiza no Firebase
      const mesaAtualizada = {
        ...mesaSelecionada,
        pedidos: [...mesaSelecionada.pedidos.filter(i => i.enviado), ...novosItens],
        itensCozinha: [
          ...(mesaSelecionada.itensCozinha || []).filter(i => i.enviado),
          ...novosItens.filter(i => ['churrasco', 'burgers', 'porcoes', 'sobremesas'].includes(i.categoria))
        ],
        itensBar: [
          ...(mesaSelecionada.itensBar || []).filter(i => i.enviado),
          ...novosItens.filter(i => i.categoria === 'bebidas')
        ]
      };
  
      await update(ref(database, `mesas/${mesaSelecionada.id}`), mesaAtualizada);
      
      // Atualiza estado local
      setMesaSelecionada(mesaAtualizada);
      setPedidoEmAndamento(mesaAtualizada.pedidos);
      
      // Envia para impressão APENAS os novos itens da cozinha
      await imprimirPedidoCozinha(novosItens);
      
      setMostrarConfirmacaoCozinha(false);
      
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      mostrarNotificacao('Erro ao enviar pedido', 'erro');
    }
  };


  const fecharConta = async () => {
    try {
      if (!mostrarResumoFechamento) {
        // Se não tem itens, fecha direto sem mostrar resumo
        if (pedidoEmAndamento.length === 0) {
          const mesaAtualizada = {
            ...mesaSelecionada,
            ocupada: false,
            pedidos: [],
            total: 0,
            horaAbertura: null
          };
          
          await update(ref(database, `mesas/${mesaSelecionada.id}`), mesaAtualizada);
          setMesaSelecionada(null);
          setPedidoEmAndamento([]);
          mostrarNotificacao(`Mesa ${mesaSelecionada.numero} fechada`);
          return;
        }
        
        setMostrarResumoFechamento(true);
        return;
      }
  
      const mesaAtualizada = {
        ...mesaSelecionada,
        ocupada: false,
        pedidos: [],
        total: 0,
        horaAbertura: null
      };
  
      await update(ref(database, `mesas/${mesaSelecionada.id}`), mesaAtualizada);
      
      setMesaSelecionada(null);
      setPedidoEmAndamento([]);
      setMostrarResumoFechamento(false);
      mostrarNotificacao(`Conta fechada - Mesa ${mesaSelecionada.numero}`);
      
    } catch (error) {
      console.error("Erro ao fechar conta:", error);
      mostrarNotificacao('Erro ao fechar conta', 'erro');
    }
  };

  const ModalConfirmacaoCozinha = () => {
    const modalContentRef = React.useRef(null);
  
    // Bloqueia o scroll da página quando a modal está aberta
    React.useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }, []);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Confirmar envio para cozinha</h3>
          </div>
          
          <div 
            ref={modalContentRef}
            className="overflow-y-auto px-6 border-t border-b"
            style={{ maxHeight: '60vh' }}
          >
            {pedidoEmAndamento
              .filter(item => 
                item.categoria === 'churrasco' || 
                item.categoria === 'burgers' || 
                item.categoria === 'porcoes' || 
                item.categoria === 'sobremesas'
              )
              .map(item => (
                <div key={`${item.id}-${item.observacoes || ''}`} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center truncate">
                      <span className="truncate">{item.nome} x {item.quantidade}</span>
                      {item.enviado && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                          Enviado
                        </span>
                      )}
                    </div>
                    {item.observacoes && (
                      <div className="text-xs text-gray-600 truncate" title={item.observacoes}>
                        {item.observacoes}
                      </div>
                    )}
                  </div>
                  <span className="ml-4 whitespace-nowrap">
                    € {(item.preco * item.quantidade).toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
  
          <div className="p-6">
            <div className="flex justify-between">
              <button 
                onClick={() => setMostrarConfirmacaoCozinha(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded flex items-center"
              >
                <FiX className="mr-2" /> Cancelar
              </button>
              <button 
                onClick={enviarPedidoParaFirebase}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
              >
                <FiCheck className="mr-2" /> Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ResumoFechamento = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Resumo da Mesa {mesaSelecionada.numero}</h3>
        </div>
        
        <div className="px-6 overflow-y-auto flex-1 border-t border-b">
          {pedidoEmAndamento.map(item => (
            <div key={`${item.id}-${item.observacoes || ''}`} className="flex justify-between py-4 border-b last:border-b-0">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.nome} x {item.quantidade}</div>
                {item.observacoes && (
                  <div className="text-xs text-gray-600 truncate" title={item.observacoes}>
                    {item.observacoes}
                  </div>
                )}
              </div>
              <span className="ml-4 whitespace-nowrap">
                € {(item.preco * item.quantidade).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="p-6 border-t">
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total:</span>
            <span>€ {totalConta.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => setMostrarResumoFechamento(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Voltar
            </button>
            <button 
              onClick={fecharConta}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
            >
              <FiPrinter className="mr-2" /> Confirmar Fechamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
 
 
  const ModalCustomizacao = () => {
    const scrollContainerRef = React.useRef(null);
  
    if (!customizacaoItem) return null;
  
    const isChurrascoMisto = customizacaoItem.nome.includes('Churrasco Misto');
  
    const handleToggleOpcao = (tipo, index) => {
      if (
        tipo === 'acompanhamentos' ||
        tipo === 'salada' ||
        tipo === 'feijao' ||
        tipo === 'tipo'
      ) {
        const updatedItem = { ...customizacaoItem };
        updatedItem.opcoes[tipo].forEach(opt => (opt.selecionado = false));
        updatedItem.opcoes[tipo][index].selecionado = true;
        setCustomizacaoItem(updatedItem);
      } else {
        toggleOpcao(tipo, index);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{ maxHeight: '90vh' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{customizacaoItem.nome}</h3>
              <button
                onClick={fecharCustomizacao}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
              >
                <FiX size={24} />
              </button>
            </div>
            <p className="text-indigo-100 text-sm mt-1">€ {customizacaoItem.preco.toFixed(2)}</p>
          </div>
  
          {/* Conteúdo com ou sem rolagem */}
          <div
            ref={scrollContainerRef}
            className={`p-5 ${isChurrascoMisto ? '' : 'overflow-y-auto'}`}
            style={{ maxHeight: 'calc(90vh - 180px)' }}
          >
            {/* Feijão */}
            {customizacaoItem.opcoes?.feijao && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tipo de Feijão</h4>
                <div className="grid grid-cols-2 gap-2">
                  {customizacaoItem.opcoes.feijao.map((opcao, index) => (
                    <label key={index} className="flex items-center p-2 rounded-lg border border-gray-200 hover:border-indigo-300 transition cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="feijao"
                        checked={opcao.selecionado}
                        onChange={() => handleToggleOpcao('feijao', index)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 block">{opcao.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
  
            {/* Acompanhamentos */}
            {customizacaoItem.opcoes?.acompanhamentos && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Acompanhamentos</h4>
                <div className="grid grid-cols-2 gap-2">
                  {customizacaoItem.opcoes.acompanhamentos.map((opcao, index) => (
                    <label key={index} className="flex items-center p-2 rounded-lg border border-gray-200 hover:border-indigo-300 transition cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="acompanhamentos"
                        checked={opcao.selecionado}
                        onChange={() => handleToggleOpcao('acompanhamentos', index)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 block">{opcao.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
  
            {/* Salada */}
            {customizacaoItem.opcoes?.salada && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Salada</h4>
                <div className="grid grid-cols-2 gap-2">
                  {customizacaoItem.opcoes.salada.map((opcao, index) => (
                    <label key={index} className="flex items-center p-2 rounded-lg border border-gray-200 hover:border-indigo-300 transition cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="salada"
                        checked={opcao.selecionado}
                        onChange={() => handleToggleOpcao('salada', index)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 block">{opcao.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
  
            {/* Carnes */}
            {customizacaoItem.opcoes?.carnes && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Carnes (máx. 2)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {customizacaoItem.opcoes.carnes.map((opcao, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg border transition text-sm ${
                        opcao.nome !== 'Só maminha' && customizacaoItem.opcoes.carnes[0].selecionado
                          ? 'border-gray-200 bg-gray-50 opacity-75'
                          : 'border-gray-200 hover:border-indigo-300 cursor-pointer'
                      }`}
                    >
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          checked={opcao.selecionado}
                          onChange={() => handleToggleOpcao('carnes', index)}
                          disabled={opcao.nome !== 'Só maminha' && customizacaoItem.opcoes.carnes[0].selecionado}
                          className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mt-1"
                        />
                        <div className="ml-2">
                          <span
                            className={`block ${
                              opcao.nome !== 'Só maminha' && customizacaoItem.opcoes.carnes[0].selecionado
                                ? 'text-gray-500'
                                : 'text-gray-700'
                            }`}
                          >
                            {opcao.nome}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                {customizacaoItem.opcoes.carnes[0].selecionado && (
                  <p className="mt-1 text-xs text-gray-500 text-center">Apenas maminha selecionada</p>
                )}
              </div>
            )}
  
            {/* Adicionais */}
            {customizacaoItem.opcoes?.adicionais && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Adicionais</h4>
                <div className="grid grid-cols-2 gap-2">
                  {customizacaoItem.opcoes.adicionais.map((opcao, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-2 rounded-lg border transition text-sm ${
                        customizacaoItem.opcoes.tipo?.some(t => t.nome === 'Açaí puro' && t.selecionado)
                          ? 'border-gray-200 bg-gray-50 opacity-75'
                          : 'border-gray-200 hover:border-indigo-300 cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={opcao.selecionado}
                        onChange={() => handleToggleOpcao('adicionais', index)}
                        disabled={customizacaoItem.opcoes.tipo?.some(t => t.nome === 'Açaí puro' && t.selecionado)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-2 block">{opcao.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
  
            {/* Tipo */}
            {customizacaoItem.opcoes?.tipo && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tipo</h4>
                <div className="grid grid-cols-2 gap-2">
                  {customizacaoItem.opcoes.tipo.map((opcao, index) => (
                    <label
                      key={index}
                      className="flex items-center p-2 rounded-lg border border-gray-200 hover:border-indigo-300 transition cursor-pointer text-sm"
                    >
                      <input
                        type="radio"
                        name="tipoAçai"
                        checked={opcao.selecionado}
                        onChange={() => handleToggleOpcao('tipo', index)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 block">{opcao.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
  
          {/* Footer */}
          <div className="bg-gray-50 px-5 py-3 border-t flex justify-end space-x-2">
            <button
              onClick={fecharCustomizacao}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarCustomizacao}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition flex items-center"
            >
              <FiPlus className="mr-1" /> Adicionar
            </button>
          </div>
        </div>
      </div>
    );
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
  const renderTelaInicial = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 font-serif">Bem-vindo ao Sistema de Pedidos</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Selecione a área para gerenciar mesas e pedidos
        </p>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Card Sala Interna */}
        <div 
          onClick={() => selecionarArea('Sala')}
          className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-800/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center"></div>
          
          <div className="relative z-20 p-8 h-64 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <FiUser className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Sala Interna</h3>
              <p className="text-blue-100">Mesas 1 a 16</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">Clique para selecionar</span>
              <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-all flex items-center justify-center">
                <FiArrowRight className="text-white" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Card Esplanada */}
        <div 
          onClick={() => selecionarArea('Esplanada')}
          className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center"></div>
          
          <div className="relative z-20 p-8 h-64 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <FiCoffee className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Esplanada</h3>
              <p className="text-amber-100">Mesas 17 a 30</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">Clique para selecionar</span>
              <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-all flex items-center justify-center">
                <FiArrowRight className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div className="mt-16 text-center">
        <div className="inline-flex items-center space-x-2 text-gray-500">
          <FaClock className="text-yellow-500" />
          <span>Horário atual: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );

  const renderTelaMesas = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => setTelaAtiva('inicio')} 
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <FiArrowLeft className="mr-2" /> Voltar
        </button>
        <h2 className="text-xl font-semibold">
          {areaSelecionada} - Mesas {areaSelecionada === 'Sala' ? '1-16' : '17-30'}
        </h2>
        <div className="w-8"></div> {/* Espaçamento para alinhamento */}
      </div>
  
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mesas
          .filter(mesa => mesa.area === areaSelecionada)
          .sort((a, b) => parseInt(a.numero) - parseInt(b.numero))
          .map(mesa => {
            // Calcula o tempo de atendimento para cada mesa ocupada
            const calcularTempo = (horaAbertura) => {
              if (!horaAbertura) return '--:--';
              const diff = Math.floor((new Date() - new Date(horaAbertura)) / 1000);
              return `${Math.floor(diff / 60).toString().padStart(2, '0')}:${(diff % 60).toString().padStart(2, '0')}`;
            };
  
            return (
              <button 
                key={mesa.id}
                onClick={() => selecionarMesa(mesa)}
                className={`
                  p-4 rounded-xl shadow transition flex flex-col items-center border
                  ${mesa.ocupada 
                    ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                    : 'bg-green-50 border-green-200 hover:bg-green-100'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2
                  ${mesa.ocupada 
                    ? 'bg-red-500 text-white' 
                    : 'bg-green-500 text-white'
                  }
                `}>
                  {mesa.numero}
                </div>
                
                <span className="font-bold text-lg">Mesa {mesa.numero}</span>
                
                {mesa.ocupada && (
                  <>
                    <div className="mt-2 text-sm text-gray-600 flex items-center">
                      <FaClock className="mr-1" /> 
                      {calcularTempo(mesa.horaAbertura)}
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      € {(mesa.total || 0).toFixed(2)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {mesa.pedidos?.length || 0} itens
                    </div>
                  </>
                )}
              </button>
            );
          })
        }
      </div>
    </div>
  );

  const renderTelaPedido = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="p-4 text-black" style={{ backgroundColor: '#FFB501' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setMesaSelecionada(null)} className="p-1 mr-2 rounded-full hover:bg-white hover:bg-opacity-20">
              <FiArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">Pedido - Mesa {mesaSelecionada.numero}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setMostrarQRCode(true)}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30"
              title="Gerar QR Code"
            >
              <AiOutlineQrcode size={24} />

            </button>
            {pedidosPendentes.length > 0 && (
              <button 
                onClick={() => setPedidosPendentes(mesaSelecionada.pedidosPendentes || [])}
                className="relative p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30"
                title="Pedidos pendentes"
              >
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pedidosPendentes.length}
                </span>
                <FiUser size={18} />
              </button>
            )}
            <span className="flex items-center text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
              <FaClock className="mr-1" /> {tempoAtendimento}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {Object.keys(cardapio).map(categoria => (
            <button
              key={categoria}
              onClick={() => setCategoriaAtiva(categoria)}
              className={`px-4 py-2 mr-2 rounded-full text-sm font-medium ${
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
  
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {cardapio[categoriaAtiva].map(item => (
            <button
              key={item.id}
              onClick={() => item.customizavel ? abrirCustomizacao(item) : adicionarItem(item)}
              className="bg-[#57aed1] hover:bg-[#76bdda] style={{ color: '#3d1106' }} rounded-lg p-4 transition flex flex-col items-center text-center h-full"
            >
              <h3 className="font-medium mb-1">{item.nome}</h3>
              <div className="mt-auto font-bold">€ {item.preco.toFixed(2)}</div>
              {item.descricao && <div className="text-xs mt-1">{item.descricao}</div>}
            </button>
          ))}
        </div>
  
        <div className="border-t pt-4">
          <div className="flex mb-4 border-b">
            <button
              onClick={() => setAbaPedidosAtiva('todos')}
              className={`px-4 py-2 font-medium ${
                abaPedidosAtiva === 'todos' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
              }`}
            >
              Todos os Itens
            </button>
            <button
              onClick={() => setAbaPedidosAtiva('cozinha')}
              className={`px-4 py-2 font-medium ${
                abaPedidosAtiva === 'cozinha' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
              }`}
            >
              Cozinha
            </button>
            <button
              onClick={() => setAbaPedidosAtiva('bar')}
              className={`px-4 py-2 font-medium ${
                abaPedidosAtiva === 'bar' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
              }`}
            >
              Bar
            </button>
          </div>
  
          <div className="max-h-64 overflow-y-auto mb-4 border rounded-lg">
            {pedidoEmAndamento.length === 0 ? (
              <div className="text-center py-6 text-gray-500">Nenhum item adicionado</div>
            ) : (
              <div className="divide-y">
                {pedidoEmAndamento
                  .filter(item => {
                    if (abaPedidosAtiva === 'todos') return true;
                    if (abaPedidosAtiva === 'cozinha') 
                      return item.categoria === 'churrasco' || 
                             item.categoria === 'burgers' || 
                             item.categoria === 'porcoes' || 
                             item.categoria === 'sobremesas';
                    if (abaPedidosAtiva === 'bar') 
                      return item.categoria === 'bebidas';
                    return true;
                  })
                  .map((item, index) => (
                    <div 
                      key={`${item.id}-${item.observacoes || ''}-${index}`} 
                      className="flex justify-between items-center p-3"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.nome}</h4>
                        {item.observacoes && (
                          <div className="text-xs text-gray-600 mt-1">{item.observacoes}</div>
                        )}
                        <div className="flex items-center mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.categoria === 'bebidas' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.categoria === 'bebidas' ? 'Bar' : 'Cozinha'}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">€ {item.preco.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button onClick={() => ajustarQuantidade(item.id, -1)} className="p-1 text-gray-500 hover:text-indigo-700">
                          <FiMinus size={16} />
                        </button>
                        <span className="mx-2 w-6 text-center">{item.quantidade}</span>
                        <button onClick={() => ajustarQuantidade(item.id, 1)} className="p-1 text-gray-500 hover:text-indigo-700">
                          <FiPlus size={16} />
                        </button>
                        <span className="mx-3 font-medium">€ {(item.preco * item.quantidade).toFixed(2)}</span>
                        <button 
                        onClick={() => removerItem(item.id, item.observacoes || '')} 
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
  
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-indigo-800">€ {totalConta.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={salvarPedido} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
                <FiCheck className="mr-2" /> Enviar Pedido
              </button>
              {/* No renderTelaPedido(), substitua o botão de fechar conta por este: */}
              <button 
                onClick={() => fecharConta()} 
                className="py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
              >
                <FiPrinter className="mr-2" /> Fechar Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

    // Renderização condicional
    if (modoCliente) {
      return (
        <InterfaceCliente 
          cardapio={cardapio}
          onEnviarPedido={adicionarPedidoCliente}
          onVoltar={() => setModoCliente(false)}
        />
      );
    }
  

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-[#fff1e4] p-4 shadow-md" style={{ color: '#280b04' }}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <FiCoffee className="mr-3" /> 
          <span>Cozinha da Vivi</span>
        </h1>
      </div>
      </header>

      <main className="container mx-auto p-4">
        {notificacao.mostrar && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white ${
            notificacao.tipo === 'erro' ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {notificacao.mensagem}
          </div>
        )}

        {mostrarQRCode && <ModalQRCode />}
        {pedidosPendentes.length > 0 && <PedidosPendentes />}
        {mostrarConfirmacaoCozinha && <ModalConfirmacaoCozinha />}
        {mostrarResumoFechamento && <ResumoFechamento />}
        {customizacaoItem && <ModalCustomizacao />}

        {telaAtiva === 'inicio' && renderTelaInicial()}
        {telaAtiva === 'mesas' && !mesaSelecionada && renderTelaMesas()}
        {mesaSelecionada && renderTelaPedido()}
      </main>
    </div>
  );
};

export default SistemaPedidos;