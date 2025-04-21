import React, { useState, useEffect } from 'react';
import { 
  FiCoffee, FiUser, FiPlus, FiMinus, FiTrash2, FiPrinter, 
  FiCheck, FiX, FiArrowLeft, FiArrowRight, FiClock 
} from 'react-icons/fi';
import { 
  FaUtensils, FaGlassCheers, FaIceCream, FaWineGlassAlt, 
  FaRegCheckCircle, FaRegTimesCircle, FaEdit, FaCalendarAlt,
  FaQrcode, FaTable,FaChair, FaBell
} from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, update, get, push, set } from 'firebase/database';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

// Configuração do Firebase
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

// Componente principal do sistema de pedidos
const SistemaPedidos = () => {
  const navigate = useNavigate();
  
  // Estados principais
  const [telaAtiva, setTelaAtiva] = useState('inicio');
  const [areaSelecionada, setAreaSelecionada] = useState(null);
  const [mesas, setMesas] = useState([]);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState('churrasco');
  const [pedidoEmAndamento, setPedidoEmAndamento] = useState([]);
  const [notificacao, setNotificacao] = useState({ mostrar: false, mensagem: '', tipo: '' });
  
  // Estados para eventos e comandas
  const [eventos, setEventos] = useState([]);
  const [eventoAtivo, setEventoAtivo] = useState(null);
  const [comandas, setComandas] = useState([]);
  const [comandaSelecionada, setComandaSelecionada] = useState(null);
  const [novoEvento, setNovoEvento] = useState({ nome: '', data: '', descricao: '' });
  const [novaComanda, setNovaComanda] = useState({ 
    nomeCliente: '', 
    telefone: '', 
    mesa: '', 
    observacoes: '' 
  });
  
  // Estados para modais e customização
  const [mostrarModalEvento, setMostrarModalEvento] = useState(false);
  const [mostrarModalComanda, setMostrarModalComanda] = useState(false);
  const [customizacaoItem, setCustomizacaoItem] = useState(null);
  const [pedidosPendentes, setPedidosPendentes] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('mesas');

  // Cardápio completo
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

  // Efeitos para carregar dados do Firebase
  useEffect(() => {
    const mesasRef = ref(database, 'mesas');
    const eventosRef = ref(database, 'eventos');
    const pedidosPendentesRef = ref(database, 'pedidosPendentes');

    // Listener para mesas
    const mesasListener = onValue(mesasRef, (snapshot) => {
      const data = snapshot.val();
      setMesas(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });

    // Listener para eventos
    const eventosListener = onValue(eventosRef, (snapshot) => {
      const data = snapshot.val();
      setEventos(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });

    // Listener para pedidos pendentes
    const pedidosPendentesListener = onValue(pedidosPendentesRef, (snapshot) => {
      const data = snapshot.val();
      setPedidosPendentes(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });

    return () => {
      off(mesasRef);
      off(eventosRef);
      off(pedidosPendentesRef);
    };
  }, []);

  useEffect(() => {
    if (!eventoAtivo) return;
    
    const comandasRef = ref(database, `eventos/${eventoAtivo.id}/comandas`);
    const comandasListener = onValue(comandasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const comandasData = Object.keys(data).map(key => ({ 
          id: key, 
          ...data[key],
          numeroComanda: data[key].numeroComanda || gerarNumeroComanda()
        }));
        setComandas(comandasData);
      }
    });

    return () => off(comandasRef, 'value', comandasListener);
  }, [eventoAtivo]);

  // Funções auxiliares
  const gerarNumeroComanda = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const mostrarNotificacao = (mensagem, tipo = 'sucesso') => {
    setNotificacao({ mostrar: true, mensagem, tipo });
    setTimeout(() => setNotificacao({ mostrar: false, mensagem: '', tipo: '' }), 3000);
  };

  const calcularTempoAtendimento = (horaAbertura) => {
    if (!horaAbertura) return '--:--';
    const diff = Math.floor((new Date() - new Date(horaAbertura)) / 1000);
    return `${Math.floor(diff / 60).toString().padStart(2, '0')}:${(diff % 60).toString().padStart(2, '0')}`;
  };

  // Funções para gerenciar mesas
  const selecionarArea = (area) => {
    setAreaSelecionada(area);
    setTelaAtiva('mesas');
  };

  const selecionarMesa = async (mesa) => {
    if (!mesa.ocupada) {
      const mesaAtualizada = {
        ...mesa,
        ocupada: true,
        status: 'ocupada',
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

  const reservarMesa = async (mesa) => {
    try {
      await update(ref(database, `mesas/${mesa.id}`), {
        ...mesa,
        status: 'reservada'
      });
      mostrarNotificacao(`Mesa ${mesa.numero} reservada com sucesso`);
    } catch (error) {
      console.error("Erro ao reservar mesa:", error);
      mostrarNotificacao('Erro ao reservar mesa', 'erro');
    }
  };

  const liberarMesa = async (mesa) => {
    try {
      await update(ref(database, `mesas/${mesa.id}`), {
        ...mesa,
        ocupada: false,
        status: 'livre',
        horaAbertura: null,
        pedidos: [],
        total: 0
      });
      mostrarNotificacao(`Mesa ${mesa.numero} liberada com sucesso`);
    } catch (error) {
      console.error("Erro ao liberar mesa:", error);
      mostrarNotificacao('Erro ao liberar mesa', 'erro');
    }
  };

  // Funções para gerenciar eventos
  const criarEvento = async () => {
    try {
      const novoEventoRef = push(ref(database, 'eventos'));
      await set(novoEventoRef, {
        ...novoEvento,
        criadoEm: new Date().toISOString(),
        status: 'ativo'
      });
      
      setNovoEvento({ nome: '', data: '', descricao: '' });
      setMostrarModalEvento(false);
      mostrarNotificacao('Evento criado com sucesso');
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      mostrarNotificacao('Erro ao criar evento', 'erro');
    }
  };

  const selecionarEvento = (evento) => {
    setEventoAtivo(evento);
    setTelaAtiva('comandas');
  };

  const finalizarEvento = async () => {
    try {
      await update(ref(database, `eventos/${eventoAtivo.id}`), {
        status: 'finalizado',
        finalizadoEm: new Date().toISOString()
      });
      
      setEventoAtivo(null);
      setTelaAtiva('eventos');
      mostrarNotificacao('Evento finalizado com sucesso');
    } catch (error) {
      console.error("Erro ao finalizar evento:", error);
      mostrarNotificacao('Erro ao finalizar evento', 'erro');
    }
  };

  // Funções para gerenciar comandas
  const criarComanda = async () => {
    if (!novaComanda.nomeCliente) {
      mostrarNotificacao('Informe o nome do cliente', 'erro');
      return;
    }

    try {
      const numeroComandaGerado = gerarNumeroComanda();
      const novaComandaRef = push(ref(database, `eventos/${eventoAtivo.id}/comandas`));
      
      await set(novaComandaRef, {
        ...novaComanda,
        numeroComanda: numeroComandaGerado,
        criadaEm: new Date().toISOString(),
        status: 'ativa',
        pedidos: [],
        total: 0,
        eventoId: eventoAtivo.id,
        qrCodeUrl: `${window.location.origin}/cliente?comanda=${numeroComandaGerado}`
      });
      
      setNovaComanda({ nomeCliente: '', telefone: '', mesa: '', observacoes: '' });
      setMostrarModalComanda(false);
      mostrarNotificacao(`Comanda ${numeroComandaGerado} criada com sucesso`);
    } catch (error) {
      console.error("Erro ao criar comanda:", error);
      mostrarNotificacao('Erro ao criar comanda', 'erro');
    }
  };

  const selecionarComanda = (comanda) => {
    setComandaSelecionada(comanda);
    setPedidoEmAndamento(comanda.pedidos || []);
  };

  const fecharComanda = async () => {
    try {
      await update(ref(database, `eventos/${comandaSelecionada.eventoId}/comandas/${comandaSelecionada.id}`), {
        status: 'fechada',
        fechadaEm: new Date().toISOString()
      });
      
      setComandaSelecionada(null);
      mostrarNotificacao('Comanda fechada com sucesso');
    } catch (error) {
      console.error("Erro ao fechar comanda:", error);
      mostrarNotificacao('Erro ao fechar comanda', 'erro');
    }
  };

  // Funções para gerenciar pedidos
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
      : [...pedidoEmAndamento, { ...item, quantidade: 1 }]
    );
    mostrarNotificacao(`${item.nome} adicionado`);
  };

  const removerItem = (id, observacoes = '') => {
    setPedidoEmAndamento(pedidoEmAndamento.filter(item => 
      !(item.id === id && item.observacoes === observacoes)
    ));
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

  // Funções para salvar pedidos
  const salvarPedidoMesa = async () => {
    if (pedidoEmAndamento.length === 0) {
      mostrarNotificacao('Adicione itens ao pedido', 'erro');
      return;
    }

    const total = pedidoEmAndamento.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    try {
      await update(ref(database, `mesas/${mesaSelecionada.id}`), {
        pedidos: pedidoEmAndamento,
        total: total,
        atualizadoEm: new Date().toISOString()
      });
      
      mostrarNotificacao('Pedido atualizado com sucesso');
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      mostrarNotificacao('Erro ao salvar pedido', 'erro');
    }
  };

  const salvarPedidoComanda = async () => {
    if (pedidoEmAndamento.length === 0) {
      mostrarNotificacao('Adicione itens ao pedido', 'erro');
      return;
    }

    const total = pedidoEmAndamento.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    try {
      await update(ref(database, `eventos/${comandaSelecionada.eventoId}/comandas/${comandaSelecionada.id}`), {
        pedidos: pedidoEmAndamento,
        total: total,
        atualizadoEm: new Date().toISOString()
      });
      
      mostrarNotificacao('Pedido atualizado com sucesso');
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      mostrarNotificacao('Erro ao salvar pedido', 'erro');
    }
  };

  // Funções para aprovação de pedidos
  const aprovarPedido = async (pedidoId) => {
    try {
      // Mover pedido para a mesa/comanda correspondente
      const pedidoRef = ref(database, `pedidosPendentes/${pedidoId}`);
      const pedidoSnapshot = await get(pedidoRef);
      const pedido = pedidoSnapshot.val();
      
      if (pedido.tipo === 'mesa') {
        const mesaRef = ref(database, `mesas/${pedido.mesaId}`);
        const mesaSnapshot = await get(mesaRef);
        const mesa = mesaSnapshot.val();
        
        await update(mesaRef, {
          pedidos: [...(mesa.pedidos || []), pedido],
          total: (mesa.total || 0) + pedido.total
        });
      } else if (pedido.tipo === 'comanda') {
        const comandaRef = ref(database, `eventos/${pedido.eventoId}/comandas/${pedido.comandaId}`);
        const comandaSnapshot = await get(comandaRef);
        const comanda = comandaSnapshot.val();
        
        await update(comandaRef, {
          pedidos: [...(comanda.pedidos || []), pedido],
          total: (comanda.total || 0) + pedido.total
        });
      }
      
      // Remover pedido da lista de pendentes
      await set(pedidoRef, null);
      
      mostrarNotificacao('Pedido aprovado e enviado para preparo');
    } catch (error) {
      console.error("Erro ao aprovar pedido:", error);
      mostrarNotificacao('Erro ao aprovar pedido', 'erro');
    }
  };

  const rejeitarPedido = async (pedidoId) => {
    try {
      await set(ref(database, `pedidosPendentes/${pedidoId}`), null);
      mostrarNotificacao('Pedido rejeitado');
    } catch (error) {
      console.error("Erro ao rejeitar pedido:", error);
      mostrarNotificacao('Erro ao rejeitar pedido', 'erro');
    }
  };

  // Funções para customização de itens
  const abrirCustomizacao = (item) => {
    setCustomizacaoItem({
      ...item,
      opcoes: JSON.parse(JSON.stringify(item.opcoes || {}))
    });
  };

  const fecharCustomizacao = () => {
    setCustomizacaoItem(null);
  };

  const confirmarCustomizacao = () => {
    if (!customizacaoItem) return;
    
    const observacoes = Object.entries(customizacaoItem.opcoes)
      .flatMap(([grupo, itens]) => 
        itens.filter(opcao => opcao.selecionado).map(opcao => `${grupo}: ${opcao.nome}`)
      .join(', '));

    const itemPersonalizado = {
      ...customizacaoItem,
      observacoes,
      quantidade: 1
    };

    adicionarItem(itemPersonalizado);
    fecharCustomizacao();
  };

  const toggleOpcao = (grupo, index) => {
    if (!customizacaoItem) return;
    
    const novasOpcoes = { ...customizacaoItem.opcoes };
    
    if (novasOpcoes[grupo][index].bloqueiaOutras) {
      novasOpcoes[grupo] = novasOpcoes[grupo].map((opcao, i) => ({
        ...opcao,
        selecionado: i === index
      }));
    } else {
      novasOpcoes[grupo][index].selecionado = !novasOpcoes[grupo][index].selecionado;
    }

    setCustomizacaoItem({
      ...customizacaoItem,
      opcoes: novasOpcoes
    });
  };

  // Renderização dos componentes
  const renderIconeStatusMesa = (status) => {
    switch (status) {
      case 'ocupada': return <FaChair className="text-red-500" />;
      case 'reservada': return <FaChair className="text-yellow-500" />;
      default: return <FaChair className="text-green-500" />;
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

  const renderTelaInicial = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">Alto Astral - Sistema de Pedidos</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Selecione a área para gerenciar mesas, pedidos ou eventos
        </p>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
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
                <FaTable className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Sala Interna</h3>
              <p className="text-blue-100">Mesas 1 a 8</p>
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
                <FaTable className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Esplanada</h3>
              <p className="text-amber-100">Mesas 9 a 16</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">Clique para selecionar</span>
              <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-all flex items-center justify-center">
                <FiArrowRight className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Card Eventos */}
        <div 
          onClick={() => setTelaAtiva('eventos')}
          className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-600/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center"></div>
          
          <div className="relative z-20 p-8 h-64 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <FaCalendarAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Eventos</h3>
              <p className="text-purple-100">Comandas individuais</p>
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
          <FiClock className="text-yellow-500" />
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
          {areaSelecionada} - Mesas {areaSelecionada === 'Sala' ? '1-8' : '9-16'}
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setAbaAtiva('mesas')}
            className={`px-4 py-2 ${abaAtiva === 'mesas' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100'}`}
          >
            Mesas
          </button>
          <button 
            onClick={() => setAbaAtiva('pedidos')}
            className={`px-4 py-2 relative ${abaAtiva === 'pedidos' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100'}`}
          >
            Pedidos Pendentes
            {pedidosPendentes.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pedidosPendentes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {abaAtiva === 'mesas' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mesas
            .filter(mesa => mesa.area === areaSelecionada)
            .sort((a, b) => parseInt(a.numero) - parseInt(b.numero))
            .map(mesa => (
              <div 
                key={mesa.id}
                className={`
                  p-4 rounded-xl shadow transition flex flex-col items-center border
                  ${mesa.status === 'ocupada' 
                    ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                    : mesa.status === 'reservada'
                    ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                    : 'bg-green-50 border-green-200 hover:bg-green-100'
                  }
                `}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${mesa.status === 'ocupada' 
                      ? 'bg-red-500 text-white' 
                      : mesa.status === 'reservada'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-green-500 text-white'
                    }
                  `}>
                    {mesa.numero}
                  </div>
                  {renderIconeStatusMesa(mesa.status)}
                </div>
                
                <span className="font-bold text-lg">Mesa {mesa.numero}</span>
                
                {mesa.status === 'ocupada' && (
                  <>
                    <div className="mt-2 text-sm text-gray-600 flex items-center">
                      <FiClock className="mr-1" /> 
                      {calcularTempoAtendimento(mesa.horaAbertura)}
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      € {(mesa.total || 0).toFixed(2)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {mesa.pedidos?.length || 0} itens
                    </div>
                  </>
                )}
                
                <div className="mt-3 flex space-x-2">
                  <button 
                    onClick={() => selecionarMesa(mesa)}
                    className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    {mesa.status === 'ocupada' ? 'Ver' : 'Abrir'}
                  </button>
                  {mesa.status === 'livre' && (
                    <button 
                      onClick={() => reservarMesa(mesa)}
                      className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                    >
                      Reservar
                    </button>
                  )}
                  {mesa.status !== 'livre' && (
                    <button 
                      onClick={() => liberarMesa(mesa)}
                      className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                    >
                      Liberar
                    </button>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-4">Pedidos Pendentes de Aprovação</h3>
          
          {pedidosPendentes.length === 0 ? (
            <div className="text-center py-6 text-gray-500">Nenhum pedido pendente</div>
          ) : (
            <div className="space-y-4">
              {pedidosPendentes.map(pedido => (
                <div key={pedido.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">
                        {pedido.tipo === 'mesa' ? `Mesa ${pedido.mesaNumero}` : `Comanda ${pedido.comandaNumero}`}
                      </h4>
                      <p className="text-sm text-gray-600">{pedido.clienteNome}</p>
                    </div>
                    <span className="text-sm font-semibold">€ {pedido.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-2 mt-2">
                    {pedido.itens.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm py-1">
                        <span>{item.quantidade}x {item.nome}</span>
                        <span>€ {(item.preco * item.quantidade).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <button 
                      onClick={() => rejeitarPedido(pedido.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Rejeitar
                    </button>
                    <button 
                      onClick={() => aprovarPedido(pedido.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Aprovar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTelaEventos = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => setTelaAtiva('inicio')} 
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <FiArrowLeft className="mr-2" /> Voltar
        </button>
        <h2 className="text-xl font-semibold">Eventos</h2>
        <button 
          onClick={() => setMostrarModalEvento(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventos.map(evento => (
          <div 
            key={evento.id} 
            className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            onClick={() => selecionarEvento(evento)}
          >
            <h3 className="font-bold text-lg mb-2">{evento.nome}</h3>
            <p className="text-gray-600 mb-2">{evento.descricao}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{new Date(evento.data).toLocaleDateString()}</span>
              <span className={`px-2 py-1 rounded-full ${
                evento.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {evento.status === 'ativo' ? 'Ativo' : 'Finalizado'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTelaComandas = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => {
            setEventoAtivo(null);
            setTelaAtiva('eventos');
          }} 
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <FiArrowLeft className="mr-2" /> Voltar
        </button>
        <h2 className="text-xl font-semibold">Comandas - {eventoAtivo.nome}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setMostrarModalComanda(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Nova Comanda
          </button>
          <button 
            onClick={finalizarEvento}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Finalizar Evento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {comandas.map(comanda => (
          <div 
            key={comanda.id} 
            className={`border rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
              comandaSelecionada?.id === comanda.id ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => selecionarComanda(comanda)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{comanda.nomeCliente}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                comanda.status === 'ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {comanda.status === 'ativa' ? 'Ativa' : 'Fechada'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Comanda: {comanda.numeroComanda}</span>
              {comanda.mesa && <span className="text-sm text-gray-600">Mesa: {comanda.mesa}</span>}
            </div>
            <div className="flex justify-between text-sm">
              <span>Itens: {comanda.pedidos?.length || 0}</span>
              <span className="font-semibold">€ {comanda.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        ))}
      </div>

      {comandaSelecionada && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-indigo-600 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  Comanda: {comandaSelecionada.numeroComanda}
                </h2>
                <p className="text-sm">
                  {comandaSelecionada.nomeCliente} 
                  {comandaSelecionada.mesa && ` - Mesa ${comandaSelecionada.mesa}`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <QRCodeCanvas 
                  value={comandaSelecionada.qrCodeUrl}
                  size={60}
                  level="H"
                  includeMargin={true}
                />
                <button 
                  onClick={() => setComandaSelecionada(null)}
                  className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  <FiX size={20} />
                </button>
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
                  className="bg-[#57aed1] hover:bg-[#76bdda] text-[#3d1106] rounded-lg p-4 transition flex flex-col items-center text-center h-full"
                >
                  <h3 className="font-medium mb-1">{item.nome}</h3>
                  <div className="mt-auto font-bold">€ {item.preco.toFixed(2)}</div>
                  {item.descricao && <div className="text-xs mt-1">{item.descricao}</div>}
                </button>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="max-h-64 overflow-y-auto mb-4 border rounded-lg">
                {pedidoEmAndamento.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">Nenhum item adicionado</div>
                ) : (
                  <div className="divide-y">
                    {pedidoEmAndamento.map((item, index) => (
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
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-indigo-800">
                    € {pedidoEmAndamento.reduce((sum, item) => sum + (item.preco * item.quantidade), 0).toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={salvarPedidoComanda} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                  >
                    <FiCheck className="mr-2" /> Salvar Pedido
                  </button>
                  <button 
                    onClick={fecharComanda} 
                    className="py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                  >
                    <FiPrinter className="mr-2" /> Fechar Comanda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTelaPedidoMesa = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="p-4 bg-[#FFB501] text-[#3d1106]">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setMesaSelecionada(null)} className="p-1 mr-2 rounded-full hover:bg-white hover:bg-opacity-20">
              <FiArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">Pedido - Mesa {mesaSelecionada.numero}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
              <FiClock className="mr-1" /> {calcularTempoAtendimento(mesaSelecionada.horaAbertura)}
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
              className="bg-[#57aed1] hover:bg-[#76bdda] text-[#3d1106] rounded-lg p-4 transition flex flex-col items-center text-center h-full"
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
              onClick={() => setAbaAtiva('todos')}
              className={`px-4 py-2 font-medium ${
                abaAtiva === 'todos' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
              }`}
            >
              Todos os Itens
            </button>
            <button
              onClick={() => setAbaAtiva('cozinha')}
              className={`px-4 py-2 font-medium ${
                abaAtiva === 'cozinha' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
              }`}
            >
              Cozinha
            </button>
            <button
              onClick={() => setAbaAtiva('bar')}
              className={`px-4 py-2 font-medium ${
                abaAtiva === 'bar' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
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
                    if (abaAtiva === 'todos') return true;
                    if (abaAtiva === 'cozinha') 
                      return item.categoria === 'churrasco' || 
                             item.categoria === 'burgers' || 
                             item.categoria === 'porcoes' || 
                             item.categoria === 'sobremesas';
                    if (abaAtiva === 'bar') 
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
              <span className="text-xl font-bold text-indigo-800">
                € {pedidoEmAndamento.reduce((sum, item) => sum + (item.preco * item.quantidade), 0).toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={salvarPedidoMesa} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <FiCheck className="mr-2" /> Salvar Pedido
              </button>
              <button 
                onClick={async () => {
                  await salvarPedidoMesa();
                  setMesaSelecionada(null);
                }} 
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

  // Modal para customização de itens
  const ModalCustomizacao = () => {
    if (!customizacaoItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{customizacaoItem.nome}</h3>
              <button 
                onClick={fecharCustomizacao}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {Object.keys(customizacaoItem.opcoes).map(grupo => (
                <div key={grupo}>
                  <h4 className="font-medium mb-2 capitalize">{grupo}</h4>
                  <div className="space-y-2">
                    {customizacaoItem.opcoes[grupo].map((opcao, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleOpcao(grupo, index)}
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
            </div>
          </div>
          <div className="p-4 border-t flex justify-end">
            <button
              onClick={confirmarCustomizacao}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal para criar novo evento
  const ModalNovoEvento = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Criar Novo Evento</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Evento*</label>
              <input
                type="text"
                value={novoEvento.nome}
                onChange={(e) => setNovoEvento({...novoEvento, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Ex: Aniversário João"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data*</label>
              <input
                type="date"
                value={novoEvento.data}
                onChange={(e) => setNovoEvento({...novoEvento, data: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={novoEvento.descricao}
                onChange={(e) => setNovoEvento({...novoEvento, descricao: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Detalhes do evento..."
              ></textarea>
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end space-x-3">
          <button
            onClick={() => setMostrarModalEvento(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={criarEvento}
            disabled={!novoEvento.nome || !novoEvento.data}
            className={`px-4 py-2 rounded-md text-white ${
              !novoEvento.nome || !novoEvento.data 
                ? 'bg-indigo-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            Criar Evento
          </button>
        </div>
      </div>
    </div>
  );

  // Modal para criar nova comanda
  const ModalNovaComanda = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Nova Comanda</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente*</label>
              <input
                type="text"
                value={novaComanda.nomeCliente}
                onChange={(e) => setNovaComanda({...novaComanda, nomeCliente: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Ex: João Silva"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="tel"
                value={novaComanda.telefone}
                onChange={(e) => setNovaComanda({...novaComanda, telefone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesa (opcional)</label>
              <input
                type="text"
                value={novaComanda.mesa}
                onChange={(e) => setNovaComanda({...novaComanda, mesa: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Número da mesa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={novaComanda.observacoes}
                onChange={(e) => setNovaComanda({...novaComanda, observacoes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="2"
                placeholder="Alergias, preferências..."
              ></textarea>
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end space-x-3">
          <button
            onClick={() => setMostrarModalComanda(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={criarComanda}
            disabled={!novaComanda.nomeCliente}
            className={`px-4 py-2 rounded-md text-white ${
              !novaComanda.nomeCliente 
                ? 'bg-indigo-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            Criar Comanda
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-[#FFB501] p-4 shadow-md" style={{ color: '#3d1106' }}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <FiCoffee className="mr-3" /> 
            <span>Alto Astral - Sistema de Pedidos</span>
          </h1>
          <div className="flex items-center space-x-4">
            {pedidosPendentes.length > 0 && (
              <button 
                onClick={() => setAbaAtiva('pedidos')}
                className="relative p-2 rounded-full bg-white bg-opacity-20"
              >
                <FaBell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pedidosPendentes.length}
                </span>
              </button>
            )}
          </div>
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

        {mostrarModalEvento && <ModalNovoEvento />}
        {mostrarModalComanda && <ModalNovaComanda />}
        {customizacaoItem && <ModalCustomizacao />}

        {telaAtiva === 'inicio' && renderTelaInicial()}
        {telaAtiva === 'mesas' && !mesaSelecionada && renderTelaMesas()}
        {telaAtiva === 'mesas' && mesaSelecionada && renderTelaPedidoMesa()}
        {telaAtiva === 'eventos' && !eventoAtivo && renderTelaEventos()}
        {telaAtiva === 'comandas' && renderTelaComandas()}
      </main>
    </div>
  );
};

export default SistemaPedidos;