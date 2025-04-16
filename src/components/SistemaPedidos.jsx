import React, { useState, useEffect } from 'react';
import { FiCoffee, FiUser, FiPlus, FiMinus, FiTrash2, FiPrinter, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';
import { FaUtensils, FaGlassCheers, FaIceCream, FaWineGlassAlt, FaClock } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
// eslint-disable-next-line
import { getDatabase, ref, push, set, onValue, off, update } from 'firebase/database';


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
  const [telaAtiva, setTelaAtiva] = useState('inicio');
  const [areaSelecionada, setAreaSelecionada] = useState(null);
  const [mesas, setMesas] = useState([]);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState('churrasco');
  const [pedidoEmAndamento, setPedidoEmAndamento] = useState([]);
  const [totalConta, setTotalConta] = useState(0);
  const [notificacao, setNotificacao] = useState({ mostrar: false, mensagem: '', tipo: '' });
  const [tempoAtendimento, setTempoAtendimento] = useState('00:00');
  const [abaPedidosAtiva, setAbaPedidosAtiva] = useState('todos');
  const [mostrarConfirmacaoCozinha, setMostrarConfirmacaoCozinha] = useState(false);
  const [mostrarResumoFechamento, setMostrarResumoFechamento] = useState(false);
  const [customizacaoItem, setCustomizacaoItem] = useState(null);

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
      const mesasAtualizadas = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      setMesas(mesasAtualizadas);
      
      // Atualiza a mesa selecionada se existir
      if (mesaSelecionada) {
        const mesaAtual = mesasAtualizadas.find(m => m.id === mesaSelecionada.id);
        if (mesaAtual) {
          setMesaSelecionada(mesaAtual);
          // IMPORTANTE: Atualiza o pedido em andamento com os dados do Firebase
          setPedidoEmAndamento(mesaAtual.pedidos || []);
        }
      }
    }
  });
  
  return () => off(mesasRef, 'value', listener);
}, [mesaSelecionada?.id]);

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
      
      // Cria uma cópia profunda do item e suas opções
      const newItem = JSON.parse(JSON.stringify(prev));
      
      // Tratamento especial para carnes no Churrasco Misto
      if (tipo === 'carnes' && newItem.opcoes.carnes?.[index]?.nome === 'Só maminha') {
        const isSelected = newItem.opcoes.carnes[index].selecionado;
        
        // Alterna o estado de "Só maminha" e desmarca todas as outras
        newItem.opcoes.carnes.forEach(c => {
          c.selecionado = c.nome === 'Só maminha' ? !isSelected : false;
        });
      } 
      // Se marcar qualquer outra carne
      else if (tipo === 'carnes' && newItem.opcoes.carnes?.[index]?.nome !== 'Só maminha') {
        // Desmarca "Só maminha" se estiver marcada
        if (newItem.opcoes.carnes[0].selecionado) {
          newItem.opcoes.carnes[0].selecionado = false;
        }
        
        // Alterna o estado da carne selecionada
        newItem.opcoes.carnes[index].selecionado = !newItem.opcoes.carnes[index].selecionado;
        
        // Limita a 2 carnes selecionadas (exceto "Só maminha")
        const carnesSelecionadas = newItem.opcoes.carnes
          .slice(1) // Ignora "Só maminha"
          .filter(c => c.selecionado).length;
        
        if (carnesSelecionadas > 2) {
          newItem.opcoes.carnes[index].selecionado = false;
        }
      }
      // Tratamento especial para tipos de açaí (radio buttons)
      else if (tipo === 'tipo' && newItem.opcoes.tipo?.[index]) {
        // Marca apenas o tipo selecionado e desmarca os outros
        newItem.opcoes.tipo.forEach((t, i) => {
          t.selecionado = i === index;
        });
        
        // Se for "Completo", marca todos os adicionais
        if (newItem.opcoes.tipo[index].nome === 'Completo') {
          newItem.opcoes.adicionais?.forEach(a => {
            a.selecionado = true;
          });
        } 
        // Se for "Açaí puro", desmarca todos os adicionais
        else if (newItem.opcoes.tipo[index].nome === 'Açaí puro') {
          newItem.opcoes.adicionais?.forEach(a => {
            a.selecionado = false;
          });
        }
      }
      // Para todas as outras opções (checkboxes normais)
      else if (newItem.opcoes[tipo]?.[index]) {
        newItem.opcoes[tipo][index].selecionado = !newItem.opcoes[tipo][index].selecionado;
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
  
      const mesaAtualizada = {
        ...mesaSelecionada,
        pedidos: [
          ...mesaSelecionada.pedidos.filter(item => item.enviado), // Mantém só os já enviados
          ...novosItens // Adiciona os novos
        ],
        itensCozinha: [
          ...(mesaSelecionada.itensCozinha || []).filter(item => item.enviado),
          ...novosItens.filter(item => item.categoria !== 'bebidas')
        ],
        itensBar: [
          ...(mesaSelecionada.itensBar || []).filter(item => item.enviado),
          ...novosItens.filter(item => item.categoria === 'bebidas')
        ]
      };
  
      await update(ref(database, `mesas/${mesaSelecionada.id}`), mesaAtualizada);
      
      setMesaSelecionada(mesaAtualizada);
      setPedidoEmAndamento(mesaAtualizada.pedidos);
      setMostrarConfirmacaoCozinha(false);
      mostrarNotificacao(`Pedido enviado - Mesa ${mesaSelecionada.numero}`);
  
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Resumo da Mesa {mesaSelecionada.numero}</h3>
        <div className="max-h-96 overflow-y-auto mb-6 border rounded p-3">
          {pedidoEmAndamento.map(item => (
            <div key={`${item.id}-${item.observacoes || ''}`} className="flex justify-between py-2 border-b last:border-b-0">
              <div>
                <div>{item.nome} x {item.quantidade}</div>
                {item.observacoes && <div className="text-xs text-gray-600">{item.observacoes}</div>}
              </div>
              <span>€ {(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>€ {totalConta.toFixed(2)}</span>
          </div>
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
  );
  const ModalCustomizacao = () => {
    const scrollContainerRef = React.useRef(null);
    const scrollPosition = React.useRef(0);
    const firstRender = React.useRef(true);
  
    React.useEffect(() => {
      // Restaurar scroll apenas na primeira renderização
      if (firstRender.current && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPosition.current;
        firstRender.current = false;
      }
    }, [customizacaoItem]);
  
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        scrollPosition.current = scrollContainerRef.current.scrollTop;
      }
    };
  
    const handleOptionChange = (tipo, index) => {
      if (scrollContainerRef.current) {
        scrollPosition.current = scrollContainerRef.current.scrollTop;
      }
      toggleOpcao(tipo, index);
    };
  
    if (!customizacaoItem) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
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
  
          <div
            ref={scrollContainerRef}
            className="p-5 overflow-y-auto max-h-[70vh]"
            onScroll={handleScroll}
          >
            {/* Acompanhamentos */}
            {customizacaoItem.opcoes?.acompanhamentos && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Acompanhamentos (Escolha 1)
                </h4>
                <div className="space-y-2">
                  {customizacaoItem.opcoes.acompanhamentos.map((opcao, index) => (
                    <label
                      key={index}
                      className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="acompanhamentos"
                        checked={opcao.selecionado}
                        onChange={() => handleOptionChange('acompanhamentos', index)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-3 block text-gray-700">{opcao.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
  
            {/* Salada */}
            {customizacaoItem.opcoes?.salada && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Salada (Escolha 1)
                </h4>
                <div className="space-y-2">
                  {customizacaoItem.opcoes.salada.map((opcao, index) => (
                    <label
                      key={index}
                      className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="salada"
                        checked={opcao.selecionado}
                        onChange={() => handleOptionChange('salada', index)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-3 block text-gray-700">{opcao.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
  
            {/* Carnes */}
            {customizacaoItem.opcoes?.carnes && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Carnes</h4>
                <div className="space-y-3">
                  {customizacaoItem.opcoes.carnes.map((opcao, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border transition ${
                        opcao.nome !== 'Só maminha' && customizacaoItem.opcoes.carnes[0].selecionado
                          ? 'border-gray-200 bg-gray-50 opacity-75'
                          : 'border-gray-200 hover:border-indigo-300 cursor-pointer'
                      }`}
                    >
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          checked={opcao.selecionado}
                          onChange={() => handleOptionChange('carnes', index)}
                          disabled={
                            opcao.nome !== 'Só maminha' &&
                            customizacaoItem.opcoes.carnes[0].selecionado
                          }
                          className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mt-0.5"
                        />
                        <div className="ml-3">
                          <span
                            className={`block ${
                              opcao.nome !== 'Só maminha' && customizacaoItem.opcoes.carnes[0].selecionado
                                ? 'text-gray-500'
                                : 'text-gray-700'
                            }`}
                          >
                            {opcao.nome}
                          </span>
                          {opcao.nome !== 'Só maminha' &&
                            customizacaoItem.opcoes.carnes[0].selecionado && (
                              <span className="block text-xs text-gray-400 mt-1">(desative "Só maminha")</span>
                            )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {customizacaoItem.opcoes.carnes[0].selecionado
                    ? 'Apenas maminha selecionada'
                    : "Selecione até 2 carnes (exceto 'Só maminha')"}
                </p>
              </div>
            )}
  
            {/* Adicionais */}
            {customizacaoItem.opcoes?.adicionais && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Adicionais</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customizacaoItem.opcoes.adicionais.map((opcao, index) => (
                    <label
                      key={index}
                      className={`flex items-start p-3 rounded-lg border transition ${
                        customizacaoItem.opcoes.tipo?.some(t => t.nome === 'Açaí puro' && t.selecionado)
                          ? 'border-gray-200 bg-gray-50 opacity-75'
                          : 'border-gray-200 hover:border-indigo-300 cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={opcao.selecionado}
                        onChange={() => handleOptionChange('adicionais', index)}
                        disabled={customizacaoItem.opcoes.tipo?.some(t => t.nome === 'Açaí puro' && t.selecionado)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5"
                      />
                      <span
                        className={`ml-3 block ${
                          customizacaoItem.opcoes.tipo?.some(t => t.nome === 'Açaí puro' && t.selecionado)
                            ? 'text-gray-500'
                            : 'text-gray-700'
                        }`}
                      >
                        {opcao.nome}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
  
            {/* Tipo */}
            {customizacaoItem.opcoes?.tipo && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Tipo</h4>
                <div className="space-y-2">
                  {customizacaoItem.opcoes.tipo.map((opcao, index) => (
                    <label
                      key={index}
                      className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="tipoAçai"
                        checked={opcao.selecionado}
                        onChange={() => handleOptionChange('tipo', index)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-3 block text-gray-700">{opcao.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
  
          <div className="bg-gray-50 px-5 py-4 border-t flex justify-end space-x-3">
            <button
              onClick={fecharCustomizacao}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarCustomizacao}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition flex items-center shadow-md"
            >
              <FiPlus className="mr-2" /> Adicionar ao Pedido
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
    <div className="flex flex-col items-center justify-center h-full py-8">
      <h2 className="text-2xl font-bold mb-8 text-indigo-900">Selecione a Área</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
        <button onClick={() => selecionarArea('Sala')} className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-md transition flex flex-col items-center border border-indigo-100">
          <div className="bg-indigo-100 p-4 rounded-full mb-4"><FiUser className="text-indigo-600 text-2xl" /></div>
          <h3 className="text-xl font-semibold text-indigo-800 mb-2">Sala Interna</h3>
          <p className="text-gray-600">Mesas 1 a 16</p>
        </button>
        <button onClick={() => selecionarArea('Esplanada')} className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-md transition flex flex-col items-center border border-indigo-100">
          <div className="bg-indigo-100 p-4 rounded-full mb-4"><FiCoffee className="text-indigo-600 text-2xl" /></div>
          <h3 className="text-xl font-semibold text-indigo-800 mb-2">Esplanada</h3>
          <p className="text-gray-600">Mesas 17 a 30</p>
        </button>
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
      <div className="bg-indigo-800 p-4 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setMesaSelecionada(null)} className="p-1 mr-2 rounded-full hover:bg-white hover:bg-opacity-20">
              <FiArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">Pedido - Mesa {mesaSelecionada.numero}</h2>
          </div>
          <div className="flex items-center">
            <span className="flex items-center mr-3 text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-4 transition flex flex-col items-center text-center h-full"
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-[#ffb501] text-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <FiCoffee className="mr-3" /> 
          <span>Cozinha da Vivi</span>
        </h1>
        <div className="bg-black text-[#ffeb00] px-4 py-1 rounded-full text-sm font-semibold shadow">
          Garçom
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

        {mostrarConfirmacaoCozinha && <ModalConfirmacaoCozinha />}
        {mostrarResumoFechamento && <ResumoFechamento />}
        {customizacaoItem && <ModalCustomizacao />}

        {telaAtiva === 'inicio' && renderTelaInicial()}
        {telaAtiva === 'mesas' && !mesaSelecionada && renderTelaMesas()}
        {mesaSelecionada && renderTelaPedido()}
      </main>

      <footer className="bg-gray-100 border-t p-4 text-center text-sm text-gray-600">
        Sistema de Pedidos © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default SistemaPedidos;