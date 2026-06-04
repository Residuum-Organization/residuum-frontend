export const sorteios = [
  {
    id: 'campanha-verde',
    titulo: 'Recicle e Ganhe',
    patrocinador: 'Campanha Verde',
    subtitulo: 'Transforme resíduos em chances de ganhar prêmios.',
    descricao:
      'A cada descarte validado em um ponto de coleta parceiro, seus pontos são convertidos em chances para participar dos sorteios ativos.',
    imagem: null,
    pontosNecessarios: 100,
    participantes: 128,
    dataFim: '30/06/2026',
    status: 'ativo',
    progresso: 68,
    cor: '#0B6B53',
    etapas: [
      'Separe seus resíduos recicláveis em casa.',
      'Deposite em um ponto de coleta cadastrado.',
      'Registre a entrega pelo aplicativo.',
      'Ganhe pontos e concorra aos prêmios.',
    ],
    premios: [
      { posicao: '1º Lugar', titulo: 'Smart TV 50”', descricao: 'Prêmio principal da campanha.' },
      { posicao: '2º Lugar', titulo: 'Vale-compras R$ 300', descricao: 'Para usar em lojas parceiras.' },
      { posicao: '3º Lugar', titulo: 'Kit sustentável', descricao: 'Produtos reutilizáveis e ecológicos.' },
    ],
  },
  {
    id: 'bike-sustentavel',
    titulo: 'Pedale Sustentável',
    patrocinador: 'Parceiro Local',
    subtitulo: 'Concorra a uma bicicleta reciclando materiais.',
    descricao:
      'Campanha criada para incentivar a mobilidade urbana e o descarte correto de resíduos recicláveis.',
    imagem: null,
    pontosNecessarios: 150,
    participantes: 84,
    dataFim: '15/07/2026',
    status: 'ativo',
    progresso: 42,
    cor: '#11527A',
    etapas: [
      'Cadastre os materiais recicláveis.',
      'Valide a entrega no ponto de coleta.',
      'Acumule pontos durante a campanha.',
      'Participe automaticamente do sorteio.',
    ],
    premios: [
      { posicao: '1º Lugar', titulo: 'Bicicleta urbana', descricao: 'Ideal para deslocamentos no dia a dia.' },
      { posicao: '2º Lugar', titulo: 'Capacete + garrafa', descricao: 'Kit de segurança para pedalar.' },
      { posicao: '3º Lugar', titulo: 'Vale manutenção', descricao: 'Serviço em oficina parceira.' },
    ],
  },
  {
    id: 'vale-compras',
    titulo: 'Semana da Reciclagem',
    patrocinador: 'Comércio Parceiro',
    subtitulo: 'Use seus pontos para concorrer a vale-compras.',
    descricao:
      'Uma ação promocional para premiar moradores que participam ativamente da coleta seletiva.',
    imagem: null,
    pontosNecessarios: 80,
    participantes: 213,
    dataFim: '10/05/2026',
    status: 'encerrado',
    progresso: 100,
    cor: '#64748B',
    etapas: [
      'Campanha finalizada.',
      'Participações contabilizadas.',
      'Sorteio realizado pela equipe.',
      'Vencedores notificados no aplicativo.',
    ],
    premios: [
      { posicao: '1º Lugar', titulo: 'Vale-compras R$ 500', descricao: 'Premiação entregue ao vencedor.' },
      { posicao: '2º Lugar', titulo: 'Vale-compras R$ 200', descricao: 'Premiação entregue ao vencedor.' },
      { posicao: '3º Lugar', titulo: 'Vale-compras R$ 100', descricao: 'Premiação entregue ao vencedor.' },
    ],
  },
];

export const vouchers = [
  { id: 1, titulo: 'Desconto em mercado parceiro', pontos: 120, validade: 'Válido até 30/06' },
  { id: 2, titulo: 'Brinde sustentável', pontos: 90, validade: 'Válido enquanto durar o estoque' },
];
