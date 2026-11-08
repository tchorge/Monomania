// Textos de regras do livro (Monomania v1.2), usados na aba Regras e nos detalhes da ficha

export const DESC_PERICIAS = {
  Agilidade: 'Coordenação da velocidade corporal e reflexos rápidos.',
  Força: 'Capacidade física bruta para aplicar potência.',
  Intelecto: 'Raciocínio lógico e capacidade de resolver problemas.',
  Presença: 'Carisma e impacto pessoal numa interação.',
  Vigor: 'Resistência física e capacidade de suportar esforço.',
  Vontade: 'Força mental para resistir a influências externas.',
  Acalmar: 'Habilidade de acalmar ou tranquilizar',
  Analisar: 'Capacidade de interpretar dados, padrões ou situações complexas.',
  Atualidades: 'Conhecimento sobre eventos e informações recentes.',
  Atletismo: 'Habilidade física em correr, saltar, escalar e derivados.',
  Burocracia: 'Conhecimento sobre processos legais e administrativos.',
  'C. Exatas': 'Saber em matemática, física e disciplinas afins.',
  'C. Humanas': 'Entendimento de história, filosofia e cultura.',
  'C. Naturais': 'Conhecimento sobre biologia, geologia e afins.',
  Defender: 'Capacidade de bloquear ou resistir a ataques.',
  Destreza: 'Habilidade precisa e ágil dos movimentos, especialmente manuais.',
  Diplomacia: 'Habilidade de negociar e lidar com conflitos sociais.',
  Furtividade: 'Aptidão para agir sem ser notado.',
  Intimidação: 'Capacidade de causar pressão psicológica através da postura.',
  Lutar: 'Habilidade no combate corpo a corpo.',
  Malandragem: 'Conhecimento e habilidade em atividades duvidosas ou ilegais.',
  Medicina: 'Conhecimentos médicos e primeiros socorros.',
  Memória: 'Capacidade de lembrar detalhes importantes.',
  Ocultismo: 'Conhecimento sobre o sobrenatural e esotérico.',
  Percepção: 'Atenção a detalhes e sinais ao redor.',
  Pesquisar: 'Habilidade de buscar informações de forma eficiente.',
  Pilotagem: 'Capacidade de conduzir meios de transporte.',
  Pontaria: 'Precisão ao disparar ou lançar objetos.',
  Preparação: 'Capacidade de estar pronto para agir primeiro em qualquer situação.',
  Religião: 'Conhecimento sobre crenças, rituais e doutrinas.',
  Sobrevivência: 'Técnicas para viver em ambientes hostis.',
  Tática: 'Estratégia e coordenação em confrontos.',
  Tecnologia: 'Conhecimento e uso de dispositivos modernos.',
  'Uso de Arma Branca': 'Habilidade com facas, espadas e similares.',
  'Uso de Arma de Fogo': 'Capacidade de manejar armas de tiro.',
  Vasculhar: 'Buscar itens ou pistas em locais físicos.',
};

export const DESC_TRACOS = {
  PER: 'Perspicácia é a capacidade de perceber, interpretar e compreender informações, situações ou comportamentos com rapidez, profundidade e clareza. Ela envolve um senso aguçado de observação e discernimento, permitindo identificar nuances e padrões que podem passar despercebidos para a maioria das pessoas.',
  AUD: 'Audácia é a disposição para enfrentar desafios, riscos ou situações difíceis com coragem e confiança, mesmo quando isso envolve incertezas ou oposição. Ela combina bravura com iniciativa, permitindo que uma pessoa aja de forma decidida e, muitas vezes, inovadora ou arriscada, sem se deixar paralisar pelo medo ou pela dúvida.',
  DET: 'Determinação é a força que motiva uma pessoa a persistir em seus objetivos, superando obstáculos, desafios ou adversidades, com foco, disciplina e resiliência. É uma qualidade que reflete compromisso inabalável e capacidade de manter-se firme, mesmo diante de dificuldades ou frustrações.',
  VIR: 'Virtude é a qualidade moral ou ética que reflete o compromisso com princípios elevados e ações corretas, guiando uma pessoa a agir com integridade, bondade e justiça. Ela é frequentemente associada a excelência do caráter e ao cultivo de qualidades positivas que beneficiam tanto o indivíduo quanto a sociedade.',
  DES: 'Desbrio é ausência de vergonha ou dignidade, uma postura marcada por descaramento, ousadia exagerada ou falta de pudor. É uma atitude em que o indivíduo age sem se preocupar com normas sociais, juízos morais ou convenções, frequentemente rompendo barreiras éticas ou emocionais.',
  RAC: 'Raciocínio é a capacidade mental de analisar informações, identificar padrões, resolver problemas e tomar decisões de forma lógica e estruturada. Ele envolve o uso da mente para processar ideias, conectar fatos e criar soluções, sendo essencial para compreender situações complexas e agir de maneira eficaz.',
};

// Condições de sanidade (Potencial de Medo)
export const CONDICOES_SANIDADE = [
  { nivel: 1, abaixo: 80, nome: 'Sentimento Estranho', texto: 'Pode apresentar sinais de inquietação ou leve paranoia. Em alguns casos, pode ver ou ouvir coisas por curtos períodos de tempo.' },
  { nivel: 2, abaixo: 70, nome: 'Mente Sobrecarregada', texto: 'Passa a ter desvantagem em determinados testes, geralmente aqueles que envolvem maior foco ou esforço contínuo.' },
  { nivel: 3, abaixo: 60, nome: 'Pesadelos Frequentes', texto: 'Quando dormir, deve rolar um teste de Vontade, podendo ter os seguintes efeitos:\nA. Desastre: Você perde sanidade em vez de recuperar.\nB. Falha: Você não recupera sanidade.\nC. Normal: Você recupera metade da sanidade\nD. Bom/Extremo/Crítico: Você recupera sanidade normalmente' },
  { nivel: 4, abaixo: 50, nome: 'Alucinações', texto: 'Começa a ter alucinações frequentes, tendo dificuldade de distinguir o que é real e o que é imaginário.' },
  { nivel: 5, abaixo: 40, nome: 'Manias Inabituais', texto: 'Começa a apresentar manias que nunca teve antes. Para definir qual, role 1d10 e veja o resultado a partir da tabela. A mania tem um tempo mínimo de duração de três interlúdios.' },
  { nivel: 6, abaixo: 30, nome: 'Lacunas de Memória', texto: 'Suas memórias se confundem, distorcendo o significado do que antes lhe era familiar. Ao se deparar com algo que normalmente reconheceria, como uma pessoa ou um lugar, role 1d3 para determinar como essa memória se manifesta. Para recuperar a familiaridade, passe em um teste de Memória com DT Extremo ou deixe o potencial de medo. Entretanto, essa condição dura, no mínimo, um interlúdio.' },
  { nivel: 7, abaixo: 20, nome: 'Transtornos Graves', texto: 'Desenvolve permanentemente um ou mais transtornos psicológicos sérios, a critério do mestre.' },
  { nivel: 8, abaixo: 10, nome: 'Rumo ao Desconhecido', texto: 'Estando de frente à insanidade, você a experiencia como se já estivesse insano, perdendo o controle total de suas ações e estando à parte da lógica da realidade, pelo menos até deixar este potencial.' },
];

export const INTRO_CONDICOES_SANIDADE = 'Condições de sanidade são adquiridos ao perder valores relativos de Pontos de Sanidade. Abaixo de 80% se adquire o primeiro status, que vai se agregando a outros a cada 10% de PS perdidos. Os status são acumulativos e só se perderão se o personagem recuperar a sanidade perdida e retornar ao nível anterior. Isso pode ser atingido ao ter momentos de descanso ou lazer, dormir e/ou ter conversas terapêuticas com outros personagens. Caso o personagem atinja 0%, ele enlouquecerá permanentemente.';

export const LACUNAS = [
  'A memória se mistura a outras, dando origem a uma nova versão. Pessoas, lugares e relações são confundidos com outros semelhantes, e você acredita fielmente nessa nova interpretação.',
  'Nenhum registro dessa memória pode ser recuperado. Você age como se fosse a primeira vez que encontra determinada pessoa, visita um lugar ou vivencia uma experiência.',
  'Algo lhe soa familiar, como se não fosse a primeira vez que vivencia aquilo. Embora não consiga compreender o motivo de imediato, parte dos sentimentos associados à memória ainda o afeta.',
];

// Manias Inabituais (1d10): frase de abertura e efeito
export const MANIAS = [
  {
    frase: 'Quem é você? O que te motiva? Quais são suas intenções e desejos? Quais foram os marcos e decisões de sua vida que resultaram em você ser do jeito que é? Isso tudo agora é um enigma, um quebra cabeça que você deve resolver.',
    efeito: 'Uma perda de identidade te assola, fazendo com que todas suas Monomanias sejam aleatoriamente alteradas por outras, sem seguir nenhum padrão específico. Em determinados marcos a critério do mestre, seja durante um gatilho, na troca de cena, interlúdio, dia ou sessão, ele trocará uma de suas Monomanias por outra aleatória, de um Traço aleatório. Neste momento, pode fazer um Pacto Mental para escolher entre determinar o Traço ou a Monomania. Seu objetivo, acima de tudo, se torna resolver este enigma e retornar sua identidade ao reorganizar suas Monomanias ao formato original.',
  },
  {
    frase: 'Em meio a toda a loucura ao seu redor, até os mais confiáveis parecem suspeitos. Você passa a desconfiar de todos a sua volta, independente de quem sejam. Verdades estão sendo ocultadas e você sabe disso. Talvez a qualquer momento quem você menos espera pode lhe apunhalar pelas costas.',
    efeito: 'Você desconsidera qualquer um como aliado e busca se isolar completamente até ter certeza de quem pode confiar. Aliados podem tentar se provar confiáveis para você através de um teste de Presença contra o seu. Caso sejam bem-sucedidos, ganham sua confiança novamente, voltando a serem aliados. Caso fracassem, passam a ser vistos e considerados como inimigos.',
  },
  {
    frase: 'As incontáveis possibilidades e probabilidades de cada mísera decisão assola seus pensamentos. Um simples toque errôneo pode causar um efeito borboleta caótico e você sabe disso.',
    efeito: 'Você sente uma dificuldade extrema para tomar decisões. Sempre que decidir realizar uma ação, deve rolar 1d3. Caso caia 1, você faz o oposto, caso caia 2, você não faz nada e caso caia 3, você age normalmente. Pode fazer um Pacto Mental para anular a rolagem e agir normalmente.',
  },
  {
    frase: 'Em meio ao caos que esteja passando, um sentimento cômico, sem sentido ou padrão, germina dentro de você. Talvez rir não seja a resposta, mas parece ser a única coisa que faz sentido no momento.',
    efeito: 'Você sente uma compulsão por rir constantemente, sejam risadinhas ou gargalhadas histéricas, independente da seriedade da situação. Pode tentar controlar suas risadas com um teste de Vontade de DT aleatória, definida pela rolagem de 1d4. (1: Crítico / 2: Extremo / 3: Bom / 4: Normal)',
  },
  {
    frase: 'Você é melhor que qualquer um ao seu redor e sabe disso. Seu ego fica compulsoriamente inflado e você busca provar sua superioridade mesmo que isto te ponha em risco.',
    efeito: 'Realizar ações que vão contra seu ego como evitar um conflito, fugir, se esconder, etc, necessitam de um teste de Vontade. A DT começa Normal porém aumenta para cada novo teste. Realizar um Pacto Mental reseta a DT para Normal. Além disso, você desconsidera qualquer um como aliado, afinal, você não precisa de ajuda.',
  },
  {
    frase: 'Falar a verdade perde o sentido no momento que você percebe que pode ditar os fatos da realidade. Uma compulsão quase incontrolável por mentir, independente da situação, toma conta de sua mente.',
    efeito: 'Caso queira falar a verdade, deve rolar um teste de Vontade de DT aleatória, definida pela rolagem de 1d4. (1: Crítico / 2: Extremo / 3: Bom / 4: Normal)',
  },
  {
    frase: 'A esta altura, você não sabe o que pode estar a espreita na escuridão portanto o melhor a se fazer é se manter na luz.',
    efeito: 'Você evita locais com baixa iluminação, especialmente os que estiverem em completa escuridão. Você não consegue descansar, relaxar ou dormir em locais escuros e permanecer nestes locais por mais de um turno causa 1 ponto de sanidade por turno caso seja de baixa iluminação, e 1d6 pontos de sanidade caso seja em completa escuridão.',
  },
  {
    frase: 'De repente, o mundo se torna cinza e monocromático. Uma forte onda de desmotivação e melancolia acarreta seu ser, ao ponto de que talvez nem mais valha a pena tentar.',
    efeito: 'Você sofre os status de Ofuscado e Cabisbaixo, e ações de lazer durante interlúdios não recuperam sanidade.',
  },
  {
    frase: 'De repente, seus sentidos ficam intensamente aflorados e extremamente sensíveis ao ambiente. Qualquer estímulo pode ser captado, lhe causando um desconforto tremendo.',
    efeito: 'Você fica Atento, porém para cada teste de Percepção bem sucedido você perde 1 ponto de sanidade. Caso o teste seja relativo de um estímulo forte e intenso, o dano passa a ser 1d6 pontos de sanidade. Sempre que for descansar, relaxar ou dormir durante um interlúdio deve rolar um teste de Percepção. Caso passe, sua mente começa a focar nos estímulos percebidos, o que resulta em recuperar metade da sanidade respectiva.',
  },
  {
    frase: 'Um sentimento quente começa a se espalhar pelo seu corpo junto ao florescer de um desejo carnal intenso. Independente de suas virtudes, saciar este desejo parece ser a única coisa que pode de acalmar.',
    efeito: 'Enquanto não saciado, você sofre os status de Cabisbaixo e Disperso. Além disso, saciar este desejo se torna o único lazer durante os interlúdios que recupera sanidade.',
  },
];

// Efeito do teste de Vontade ao dormir (Pesadelos Frequentes)
export const SONO_PESADELOS = {
  Desastre: 'Você perde sanidade em vez de recuperar.',
  Falha: 'Você não recupera sanidade.',
  Normal: 'Você recupera metade da sanidade.',
  Bom: 'Você recupera sanidade normalmente.',
  Extremo: 'Você recupera sanidade normalmente.',
  Crítico: 'Você recupera sanidade normalmente.',
};

export const LOCALIZACAO = [
  [6, 'Torso'], [7, 'Braço Esquerdo'], [8, 'Braço Direito'], [9, 'Perna Esquerda'], [10, 'Perna Direita'],
];
export const regiaoCorpo = (d10) => LOCALIZACAO.find(([max]) => d10 <= max)[1];

export const GUIA_RAPIDO = [
  ['Pacto Mental', 'Uma possibilidade ou requerimento nas monomanias, para realizá-lo é necessário sacrificar uma Pulsão da sua Pilha de Pulsões.'],
  ['Ponto de Pacto', 'Pontos que são obtidos através de Monomanias. Servem para substituir as Pulsões, eliminando a necessidade de sacrifício.'],
  ['Vantagem', 'Consiste em rolar dado(s) de d20 extra(s), além do dado padrão utilizado. Ao fim da rolagem, se mantém o melhor resultado.'],
  ['Desvantagem', 'Consiste em rolar dado(s) de d20 extra(s), além do dado padrão utilizado. Ao fim da rolagem, se mantém o pior resultado.'],
  ['Re-rolagem', 'Significa rolar novamente um dado que já foi rolado e manter o novo resultado obtido, independente se for melhor ou pior.'],
  ['Estado de Morrendo', 'É o estado que se entra ao chegar em vida 0 ou negativa. Para sair, é necessário receber tratamento e retornar a pelo menos 1 PV.'],
  ['Rodada de Imunidade', 'É uma garantia que se ativa no próximo turno que estiver no Estado de Morrendo. Assim que ela passar, é necessário rodar testes de Vigor e suceder para se manter vivo.'],
  ['Dano Mínimo', 'A soma do menor valor possível de todos os dados que foram rolados.'],
  ['Dano Máximo', 'A soma do maior valor possível de todos os dados que foram rolados.'],
  ['Cover/Cobertura', 'Qualquer tipo de cobertura/proteção física utilizada para se esconder ou se proteger de ataques.'],
  ['Teste de Combate', 'Engloba os testes de perícia de Uso de Arma de Fogo, Uso de Arma Branca, Lutar e Defender.'],
  ['Teste de Sanidade', 'Engloba os testes de perícia que podem influenciar nos Pontos de Sanidade.'],
];

export const STATUS_DESC = [
  ['Ligeiro', 'Ganha 1 vantagem em testes de Agilidade'],
  ['Suscetível', 'Ganha 1 desvantagem em testes de Agilidade'],
  ['Atento', 'Ganha 1 vantagem em testes de Percepção.'],
  ['Alheio', 'Ganha 1 desvantagem em testes de Percepção.'],
  ['Destacado', 'Ganha 1 vantagem em testes de Presença.'],
  ['Ofuscado', 'Ganha 1 desvantagem em testes de Presença.'],
  ['Motivado', 'Ganha 1 vantagem em testes de Vontade'],
  ['Cabisbaixo', 'Ganha 1 desvantagem em testes de Vontade.'],
  ['Concentrado', 'Ganha 1 vantagem em testes de Intelecto.'],
  ['Disperso', 'Ganha 1 desvantagem em testes de Intelecto.'],
  ['Renovado', 'Ganha 1 vantagem em testes de Vigor.'],
  ['Exaurido', 'Ganha 1 desvantagem em testes de Vigor.'],
  ['Fortalecido', 'Ganha 1 vantagem em testes de Força.'],
  ['Enfraquecido', 'Ganha 1 desvantagem em testes de Força.'],
];

export const CONDICOES_DESC = {
  Concussão: 'Quando se toma um ataque crítico de Impacto. É necessário rolar um teste de perícia de Vigor com DT Bom. Caso falhe, sofre uma Concussão e desmaia.',
  Pasmo: 'Quando se perde muitos PS de uma vez só. A cada 10 Pontos de Sanidade perdidos, fica paralisado por 1 turno. Quanto maior a perda, mais turnos ficará nesse estado. Se perder 20 Pontos de Sanidade, permanecerá por 2 turnos e assim por diante.',
  Sangramento: 'Quando sofre um ataque crítico de Perfuração ou Balístico. É necessário rolar um teste de Vigor no começo de cada turno. Caso falhe, sofre 1d3 pontos de dano, caso passe, evita o dano. A condição só termina após o sangramento ser estancado. Caso esteja no Estado de Morrendo o dano do sangramento irá apenas aumentar sua vida negativa.',
  Exaustão: 'Quando, por exemplo, se passa mais de 24h sem dormir. Sofre 1 desvantagem em todos os testes de perícia e perde metade do deslocamento padrão.',
};

// Aba Regras: seções de consulta, na ordem do livro
export const REGRAS = [
  {
    id: 'intro',
    titulo: 'Introdução e perícias',
    blocos: [
      ['Monomania', 'Monomania é um sistema de RPG focado na criação e no desenvolvimento aprofundado de personagens, explorando traços de personalidade moldados por desejos, dilemas e traumas que os tornam únicos em seus mundos. Versátil e adaptável a quaisquer gêneros e histórias, o sistema permite expansões e personalizações sem deixar de ser, por si só, completo, complexo e único.'],
      ['Ficha de Perícias', 'A Ficha de Perícias reúne as habilidades e competências de um personagem, se agregando a um valor que define a sua capacidade de realizar diferentes ações durante a campanha. Cada perícia representa uma área de conhecimento, prática ou aptidão que pode influenciar o sucesso do personagem em determinadas situações.'],
      ['Valores', 'Dessa forma, são estipulados valores que variam de 1-16, e em alguns casos raros podem incluir 17 ou 18. O valor da perícia define o quanto que um determinado personagem conhece sobre determinado assunto e o quão bem ele consegue colocar isso em prática.\nSeguindo este conceito, quando se rola um teste de perícia, se pode ter diferentes tipos de resultados baseados no valor rolado somado com o valor de sua perícia. Sendo assim, os resultados são definidos através de: Desastre, Falha, Normal, Bom, Extremo e Crítico.'],
      ['Capacidade e Experiência', 'O valor estipulado em cada perícia de um dado personagem determina o nível de aptidão que ele tem sobre tal e a facilidade de obter sucesso nas rolagens dos testes. Além do número designado, a tabela abaixo é uma referência que dá a noção do que esse valor representa na prática sobre a capacidade, experiência e conhecimento de um personagem sobre uma perícia.'],
      ['Desastre e Crítico', 'Desastre é sempre quando se tira 1 no d20 e Crítico é sempre que se tira 20 no d20, independentemente dos valores das perícias. Sempre que se tira um Desastre ou um Crítico algum efeito específico se desencadeia.'],
      ['Perícias Especiais', 'As Perícias Especiais definem aspectos cruciais de um personagem, e são as únicas perícias que podem ser usadas em conjunto com outras, fazendo uma média dos dois valores e abrindo a possibilidade de realizar testes mais específicos ou melhorar a performance em situações onde o valor de uma das perícias é baixo.'],
      ['Agilidade', 'Define o deslocamento de um personagem.'],
      ['Força', 'Define o valor do dado de dano atribuído para os ataques físicos de um personagem e a sua capacidade de carga.'],
      ['Vigor', 'Define o quanto de vida um personagem tem.'],
      ['Presença, Intelecto e Vontade', 'Definem o Nível de Presença Mental de um personagem e, consequentemente, a quantidade de Monomanias que ele terá. Para isso, deve-se calcular a média entre o valor que determina a perícia de Presença com a perícia de Intelecto ou Vontade. Ter Nível 4 significa ter um desenvolvimento comum e ter menos ou mais, significa um baixo ou alto desenvolvimento.'],
      ['Nível de Presença Mental', 'A Presença Mental é a capacidade e impacto que a mente de um personagem possui de compreender, influenciar, manipular e modificar o ambiente. O nível de presença mental de um personagem determinará a quantidade de monomanias. Esse nível varia do Nível 1 ao Nível 10, sendo o Nível 4 o “padrão”, cujo qual a grande maioria dos personagens terão e é considerado um desenvolvimento comum.'],
      ['Vida e Sanidade', 'Estes são os atributos que representam os limites físicos e mentais de um personagem. A vida é medida em Pontos de Vida (PV) e reflete a resistência corporal de suportar ferimentos antes de ser incapacitado ou morto. Já a sanidade é medida em Pontos de Sanidades (PS) e representa a estabilidade psicológica, indicando o quão bem um personagem lida com experiências traumáticas e situações perturbadoras.\nEnquanto a perda de vida pode levar à morte, a perda de sanidade pode resultar em colapsos mentais, loucura ou comportamentos irracionais, tornando ambos recursos essenciais para a sobrevivência e bem-estar.\nOs Pontos de Sanidade são medidos dentro de uma porcentagem de 100%, o que equivale a uma mente intacta. Conforme se é exposto a eventos tensos, bizarros ou mesmo se realiza práticas deturpadas, a sanidade mental diminui. A partir disso, seu Potencial de Medo aumenta e a mente fica suscetível a diversas condições e status.'],
      ['Ponto de Partida', 'O Ponto de Partida é uma ferramenta para criação de personagem, a mecânica delimita os valores máximos a serem estipulados e o jogador tem a liberdade de aderi-los onde preferir, baseando-se no seu personagem.\nA mecânica consiste em distribuir pontos nas 36 perícias, fundamentados no conceito do personagem. A partir disso, o sistema segue um método de progressão livre, onde, com permissão do mestre, o personagem pode aumentar e diminuir valores de determinadas perícias baseadas no desenrolar da história e nas decisões do jogador, sem seguir um método ou regra fixa.\nDependendo do desenvolvimento do personagem, ele pode se adequar em uma das cinco categorias, cada uma obtendo a possibilidade de agregar mais valores altos às perícias. Elas são: Mundano, Emergente, Hábil, Avançado e Exímio.\nApós definir onde o personagem se encaixa, deve-se adequar as suas 36 perícias ao nível de capacidade e experiência referente à próxima tabela. Cada nível tem uma quantidade de vezes que pode ser repetida e distribuída ao longo das perícias.'],
    ],
  },
  {
    id: 'tracos',
    titulo: 'Traços e Monomanias',
    blocos: [
      ['Traços', 'Os Traços são aspectos fortes da personalidade e psique de um determinado personagem e é através deles que se dá o acesso as Monomanias. Cada personagem tem seus Traços mais marcantes, e quanto mais monomanias de um mesmo traço ele possui, mais marcante é essa característica. Eles são divididos entre: Perspicácia, Audácia, Determinação, Virtude, Desbrio e Raciocínio.'],
      ['Limite de monomanias', 'A partir do Nível de Presença Mental, é dito quantas monomanias um personagem pode ter. Seguindo o seu limite, o jogador é livre para escolher quais monomanias o personagem terá e de quais traços elas serão, podendo ter várias monomanias do mesmo traço ou não ter nenhuma monomania de outro determinado traço. Através disso, você pode combinar diferentes habilidades de diferentes categorias para atender às expectativas do seu personagem.'],
      ['Mudanças', 'Conforme o comportamento, personalidade e mente de um determinado personagem vai se alterando, monomanias e traços podem se alterar também. Isso tudo pode variar e depende do desenvolvimento de cada personagem.'],
      ['Ausência de monomanias', 'A ausência de monomanias em um traço não significa que o personagem não possua características relacionadas a ele. Os traços servem apenas para destacar os aspectos mais marcantes de sua personalidade.'],
    ],
  },
  {
    id: 'mecanicas',
    titulo: 'Mecânicas gerais',
    blocos: [
      ['Dificuldade do Teste (DT)', 'Quando o mestre pede um determinado teste de perícia, ele pode estipular a Dificuldade do Teste, também chamada de DT. Essa dificuldade pode ser definida em Normal, Bom, Extremo ou Crítico, se baseando no que o mestre achar mais adequado para a situação.\nEx: Rachel tenta pular sobre um obstáculo cujo qual o mestre define a DT como Bom. Ela tira 16 no dado, tendo 12 na perícia de Atletismo, portanto, obtendo um resultado Bom. Dessa forma, Rachel consegue pular sobre o obstáculo com sucesso.'],
      ['Disputa', 'Em situações de disputa, quando se rola testes contra outro personagem, prevalece o que tirar o melhor resultado. Se ocorrer um empate, os dados são re-rolados até alguém obter um sucesso maior.\nEx: James tenta socar Robert, e tira 11 no dado, tendo 10 na perícia de Lutar, portanto, obtendo um resultado Normal. Robert tenta bloquear o ataque e tira 17 no dado, tendo 11 na perícia de Defender, portanto obtendo um resultado Bom, o que supera o resultado Normal de James. Dessa forma, Robert consegue bloquear o soco de James com sucesso.'],
      ['Teste grupal', 'Para testes grupais, se é feito um cálculo utilizando os valores dos sucessos dos testes referente a tabela abaixo. Os valores são somados e divididos pela quantidade de personagens que rolaram os testes, assim obtendo uma média grupal.\nCrítico = 6 | Extremo = 5 | Bom = 4 | Normal = 3 | Falha = 2 | Desastre = 1\nEx: Um grupo de quatro ladrões tenta invadir uma loja furtivamente, entretanto, dois seguranças estão fazendo a ronda no local. Os quatro ladrões rodaram os testes de furtividade e tiraram 1 Normal, 2 Falhas e 1 Extremo, enquanto os dois seguranças rodaram testes de percepção e tiraram Extremo e Normal.\nSeguindo a tabela: Normal (3) + 2 Falhas (2+2 = 4) + Extremo (5) = 12\nComo são quatro ladrões, o valor é dividido por 4, resultando na média de 3, que seguindo a tabela resulta em uma média grupal de Normal.\nEnquanto isso, os seguranças: Extremo (5) + Normal (3) = 8\nComo são dois seguranças, o valor é dividido por 2, resultando na média de 4, que seguindo a tabela resulta em uma média grupal de Bom. Logo, os seguranças estavam mais atentos e percebem os ladrões tentando invadir o local.\nCaso o resultado final seja um número com vírgula, o valor deve ser arredondado, entretanto, se houver um empate de sucessos, é levado em consideração o resultado da média de maior valor. Caso também haja empate, os testes são re-rolados.'],
      ['Resultados', 'Quando se efetua um teste de perícia, são obtidos resultados que variam entre: Desastre, Falha, Normal, Bom, Extremo e Crítico.'],
      ['Desastre', 'Ocorre quando se tira 1 no d20, é considerado como o pior resultado possível. Desta forma, sempre que se tira um desastre, o jogador recebe uma penalidade específica relacionada ao teste que está tentando efetuar.\nEx: O personagem tenta pular uma cerca e tira desastre. A partir disso, o mestre define uma penalidade para esta ação, deixando o personagem com algum status ou aplicando um determinado dano pelo tombo que o personagem levou.'],
      ['Normal', 'Ter um sucesso normal representa que se conseguiu ter sucesso no teste, mas sem nenhum destaque.\nEx: O personagem está procurando por pistas e tira um normal, passando na DT estipulada pelo mestre. Dessa forma, ele encontra uma determinada pista, porém sem ganhar nenhuma informação ou até encontrar outra pista extra que exigiria um resultado melhor, por estar mais escondida.'],
      ['Bom', 'Ter um sucesso bom representa que se teve um desempenho notável ao executar um determinado teste.\nEx: O personagem vasculha um armário para procurar um item específico, cujo qual a DT é normal, mas tirou bom. Isso significa que o personagem teve um desempenho acima do esperado e pode ser recompensado com algo extra, como uma informação além do que se esperava. Caso a DT fosse bom, pois o objeto estava mais escondido, o personagem apenas obtém o que procura.'],
      ['Extremo', 'Ter um sucesso extremo representa executar excepcionalmente um determinado teste. Em situações fora de combate, assim como um bom, o personagem é recompensado com algo extra mais relevante. Já em combate, quando for aplicar o dano proveniente de um ataque, sempre se ganha +1 dado de dano.'],
      ['Crítico', 'Ocorre quando se tira 20 no d20, é considerado como o melhor resultado possível. Mesmo que o sucesso exceda desse valor ou seja alcançado em uma soma, ele sempre será considerado como 20, portanto, crítico. Ter um sucesso crítico representa que você executou perfeitamente um determinado teste. Em combate, ao atacar, se ganha +1 dado de dano assim como no extremo, entretanto, o valor desse dado será “fixo”, ou seja, ele não precisará ser rolado pois sempre terá o valor máximo. Além disso, se liberam ações ou se ganham status específicos.'],
      ['Cenas', 'As cenas são intervalos específicos dentro da narrativa, servindo para delimitar determinados momentos, separando diferentes eventos ou situações. Elas marcam mudanças de tempo, espaço ou contexto, ajudando a estruturar a história de forma organizada e permitindo a ativação de diversas monomanias.\nQuando uma cena termina, outra começa, sinalizando uma transição, seja uma passagem de horas, uma troca de ambiente ou uma mudança no foco da ação. Esta demarcação permite que a história flua naturalmente, mantendo a coesão, o ritmo da narrativa e o ciclo das monomanias.\nAlgumas cenas são: Combates, investigações, lazeres, descansos, etc. Quando se inicia um combate por exemplo, uma nova cena se inicia, liberando ou ciclando uma gama de monomanias. Ao terminar, muitas monomanias se desativam, já que várias só podem ser utilizadas em cenas específicas ou tem uma durabilidade que se esgota ao fim de uma cena.'],
      ['Ações', 'As ações representam tudo que um personagem pode fazer durante a narrativa. Dentro de situações específicas, elas podem ser limitadas por turnos, testes e recursos disponíveis. Quando limitadas em turnos, geralmente se pode realizar 1 Ação Padrão ou 2 Ações Rápidas, além de uma Ação de Movimento. As ações são possíveis de serem realizadas seguindo o padrão abaixo:'],
      ['Ação Prolongada', 'Se classifica como uma ação mais complexa, que exige mais de um turno para ser concluída.\nEx: Realizar um tratamento médico completo.'],
      ['Ação Padrão', 'Se classifica como uma ação completa, podendo ser simples ou complexa, mas que se inicia e se finaliza durante o mesmo turno.\nEx: Atacar um inimigo.'],
      ['Ação Rápida', 'Se classifica como uma ação simples que ocorre de maneira rápida, não envolvendo muita complexidade.\nEx: Sacar um item, destravar uma arma, etc.'],
      ['Ação Livre', 'Se classifica como uma ação que se é livre para conduzir, não gastando sua ação do turno.\nEx: Gritar, fazer um gesto simples, etc.'],
      ['Ação de Movimento', 'Se classifica como uma ação passiva, consistindo em se deslocar de um ponto a outro em um cenário, dentro do limite de deslocamento atribuido ao personagem. Além da Ação de Movimento, é possível utilizar as outras ações do turno para se locomover além do deslocamento atribuido, sendo assim, uma Ação Rápida equivale a metade do deslocamento, enquanto o deslocamento completo equivale a uma Ação Padrão (ou duas Ações Rápidas).'],
      ['Pulsões', 'As Pulsões são obtidas a partir da ativação das monomanias e atuam como um recurso extra, podendo ser utilizadas tanto para acrescentar 1d6 nas suas rolagens de teste de perícia, quanto para realizar um Pacto Mental.\nQuando obtidas, algumas pulsões devem obrigatoriamente ser utilizadas em momentos específicos, como no turno da ativação ou no próximo turno, porém quando isso não é citado significa que a pulsão deve ser armazenada na Pilha de Pulsões, podendo ser utilizada a qualquer momento, quando o jogador achar mais adequado.\nMais de uma pulsão pode ser utilizada ao mesmo tempo, entretanto, elas só podem ser utilizadas durante a cena. Se o personagem sai de uma cena ou a mesma se finaliza, a pilha de pulsões é instantaneamente esvaziada e o personagem perde todas as pulsões acumuladas.'],
      ['Pacto Mental', 'Um Pacto Mental é uma possibilidade ou requerimento que pode ocorrer em diversas monomanias. Para realizar um Pacto Mental, é necessário sacrificar uma pulsão da sua pilha de pulsões, liberando assim alguma vantagem de determinada monomania.'],
      ['Pontos de Pacto', 'Já os Pontos de Pacto podem ser obtidos e acumulados através de algumas monomanias. Eles servem como uma ferramenta para realizar um Pacto Mental, eliminando a necessidade de sacrificar uma pulsão.'],
    ],
  },
  {
    id: 'combate',
    titulo: 'Combate',
    blocos: [
      ['Iniciativa e Turnos', 'Quando uma cena de combate se inicia, todos os envolvidos devem rolar suas iniciativas. Para definir a ordem de quem age primeiro, diferentemente de um teste de perícia convencional, deve-se rolar um d20 e somar o resultado obtido com o valor da perícia de Preparação. A partir disso, a ordem de iniciativa é organizada do maior ao menor valor.\nSe ao fazer a soma, dois personagens tirarem o mesmo valor, o parâmetro de desempate se torna apenas o valor da perícia de Preparação. Caso esses dois personagens também tenham o mesmo valor na perícia, rolam-se os dados novamente e ganha quem tirar o maior valor.\nApós ter a ordem da iniciativa definida, se inicia o combate. Quem tirou o maior valor age primeiro e assim por diante. Em cada turno, os personagens podem realizar ações e ativar monomanias. Depois de todos os personagens realizarem as suas ações nos seus respectivos turnos, a iniciativa cicla novamente até o combate finalizar.'],
      ['Ataques', 'Um ataque dentro de um cenário de RPG ocorre usualmente dentro de cenas de combates, podendo ser efetuado de diversas maneiras e em diferentes circunstâncias. Os ataques podem ser realizados de duas formas:'],
      ['Utilizando o Corpo', 'São ataques realizados com o corpo do personagem, como socos, chutes, empurrões, mordidas, etc. Ocupam uma Ação Padrão.'],
      ['Utilizando Arma', 'São ataques realizados com a arma que o personagem estiver portando. Ocupam uma Ação Padrão.'],
      ['Tipos de ataque', 'Dentro disso, existem dois tipos de ataques e os ataques especiais, sendo eles:'],
      ['Ataque de Contato', 'Se classificam como os ataques que são realizados no corpo a corpo, dando a possibilidade de seu alvo de se esquivar ou defender. Se o ataque de contato for realizado com uma arma de distância, o ataque é considerado com um Ataque a Queima-roupa.'],
      ['Ataque a Queima-roupa', 'Consiste em atacar com uma arma de distância mas no corpo a corpo, permitindo que o alvo também possa se defender. Caso o atacante acerte o ataque, ele ganha +1 dado de dano.'],
      ['Ataque a Distância', 'Se classificam como os ataques que são realizados a uma distância relativa, normalmente dando apenas a possibilidade de seu alvo se esquivar. Além disso, realizar um ataque a distância libera a ação de Mirar.'],
      ['Mirar', 'Consiste em utilizar sua Ação Padrão para mirar, assim ganhando uma vantagem ao rolar o teste na sua próxima ação ofensiva de ataque a distância.'],
      ['Ataque Surpresa', 'O alvo é pego de surpresa, portanto não pode reagir. Pode ser um golpe repentino antes de um combate começar, ou um ataque realizado de forma inesperada dentro de um combate.'],
      ['Ataque Furtivo', 'O atacante precisa estar furtivo, dentro ou fora de um combate, para então realizar o ataque que se for bem-sucedido ignorará a reação do alvo e dará +1 dado de dano para o atacante. Após isso, o(s) alvo(s) pode(m) realizar um teste de Percepção para tentar localizar de onde o ataque veio, caso consiga(m), o próximo não será mais furtivo.'],
      ['Ataque de Oportunidade', 'É uma ataque de reação, que um personagem pode realizar quando um alvo se expõe de alguma forma durante o combate. Apesar de ser muito narrativo e circunstancial, geralmente ocorre fora do turno, quando um indivíduo se aproxima ou se afasta de outro cujo qual estava atacando.'],
      ['Contra-ataque', 'Consiste em uma resposta rápida e ofensiva a um ataque inimigo, aproveitando sua abertura ou erro para retaliar. Pode ocorrer através da ativação de monomanias, do desastre de seu oponente ou de um crítico de sua defesa.'],
      ['Rolagem de Localização (1d10)', 'É um sistema de localização de dano para definir a localização do ferimento do alvo de um ataque, ele consiste em rolar um dado de 1d10 que revela em qual região do corpo a lesão se localizou:\n1-6 → Torso (60% de chance)\n7 → Braço Esquerdo (10% de chance)\n8 → Braço Direito (10% de chance)\n9 → Perna Esquerda (10% de chance)\n10 → Perna Direita (10% de chance)'],
      ['Cobertura', 'É um sistema que engloba qualquer tipo de cobertura/proteção física utilizada para se esconder ou se proteger de ataques. Dependendo do tipo de cobertura que o personagem estiver, ele obterá determinada imunidade:\nLeve (Ex: indivíduo, móvel pequeno) → Ataques de resultado Normal são considerados Fracasso.\nParcial (Ex: escombro, carro) → Ataques de resultado Bom são considerados um Fracasso.\nCompleto (Ex: casa, conteiner) → Não pode ser alvo direto de um ataque.'],
      ['Crítico e Desastre em combate', 'Quando se tira crítico ou desastre dentro de um combate, temos alguns cenários que podem se decorrer:'],
      ['Atacando: crítico', 'Se for um ataque crítico, o valor do dado extra de dano se torna fixo. O que significa que, assim como no sucesso Extremo, se ganha um +1 dado de dano, entretanto esse dado não precisa ser rolado e sempre será considerado o seu valor máximo.'],
      ['Atacando: desastre de contato', 'Se for um ataque desastroso de contato, o oponente pode realizar um Contra-ataque. Caso isso não seja possível, a arma que o atacante estiver portando é derrubada e gastará uma Ação Rápida para ser buscada.'],
      ['Atacando: desastre a distância', 'Caso seja um ataque desastroso a distância, dependendo da arma, ela pode travar por 1d3 turnos, fazendo com que o atacante perca a sua ação do turno para destravar, ou acertar um aliado caso ele esteja em um ângulo de acerto.'],
      ['Desviando: crítico', 'Se estiver desviando e tirar um crítico, se ganha o status de Ligeiro apenas durante o próximo teste.'],
      ['Defendendo: crítico', 'Se estiver defendendo e tirar um crítico, se ganha uma Contra-ação, que permite que o jogador escolha entre tomar a arma do oponente ou contra-atacá-lo.'],
      ['Desviando ou defendendo: desastre', 'Se estiver desviando ou defendendo e tirar um desastre, se ganha o status de Suscetível apenas durante o próximo teste.'],
    ],
  },
  {
    id: 'fuga',
    titulo: 'Fuga e Perseguição',
    blocos: [
      ['Raio de Distância', 'Uma cena de fuga e perseguição consiste em um ou mais personagens fugindo de outro(s) personagem(s). Ao iniciar uma cena de fuga e perseguição, o(s) fugitivo(s) e perseguidor(es) rolam iniciativa e o mestre define o valor do raio de distância baseado na cena que se decorria anteriormente utilizando a tabela abaixo. O objetivo do perseguidor é chegar na distância 0, o que libera ações corporais como atacar ou segurar e o objetivo do fugitivo é chegar na distância 10, que representa que ele conseguiu fugir totalmente do perseguidor.\nColado: 0/10 · Muito Perto: 1/10 · Perto: 2/10 · Próximo: 3/10 · Razoável: 4/10 · Meio a Meio: 5/10 · Afastado: 6/10 · Distante: 7/10 · Muito Distante: 8/10 · Remoto: 9/10 · Fuga: 10/10'],
      ['Resultados na fuga', 'Além da distância, os sucessos dos testes afetam diretamente em quanto o raio diminui ou aumenta:\nDesastre: -1 ou +1\nFalha: 0\nNormal: +1 ou -1\nBom: +2 ou -2\nExtremo: +3 ou -3\nCrítico: +4 ou -4'],
      ['Ações de Fugitivo', 'Durante a cena, o fugitivo tem algumas opções de ação durante o seu turno. As ações consistem em Avançar, Esconder-se ou Bloquear o Caminho.'],
      ['Avançar (fugitivo)', 'É a ação principal e utilizada para avançar na fuga. É necessário rolar um teste de Atletismo contra o perseguidor, ou outra perícia que se adeque a situação. Caso bem-sucedido, aumenta a distância com valor referente ao sucesso do dado.'],
      ['Esconder-se', 'Só pode ocorrer em um ambiente possível de se esconder. É necessário estar pelo menos a Meio a Meio no raio de distância e fora da linha de visão direta do perseguidor. Deve-se rolar um teste de Furtividade contra o teste de Percepção do perseguidor, caso seja mais de um, será feita uma média da percepção de todos. Se for bem-sucedido, o fugitivo consegue ficar escondido, paralisando o avanço, porém indetectável.'],
      ['Bloquear o Caminho', 'Consiste em rolar um teste de Percepção para identificar um obstáculo que poderá ser utilizado para atrasar o perseguidor. Caso o fugitivo consiga identificar algo, ele pode usar uma Ação Rápida para armar o obstáculo. Se o perseguidor cair no obstáculo, ele não avança e perde seu próximo turno, mas se desviar do obstáculo, ele avança normalmente.'],
      ['Ações de Perseguidor', 'Durante a cena, assim como o fugitivo, o perseguidor tem algumas opções de ação durante o seu turno. As ações consistem em Perseguir, Rastrear ou Atacar.'],
      ['Perseguir', 'É a ação principal e utilizada para avançar na cena. É necessário rolar um teste de Atletismo contra o fugitivo, ou outra perícia que se adeque a situação. Caso bem-sucedido, diminui a distância com valor referente ao sucesso do dado.'],
      ['Rastrear', 'Permite utilizar uma Ação Padrão para tentar encontrar rastros de um dos fugitivos que foi perdido de vista. Portanto, o perseguidor deve rolar um teste de percepção contra o teste de Furtividade do fugitivo. Caso bem-sucedido, o perseguidor identifica onde o fugitivo está e pode se aproximar, diminuindo o Raio de Distância até 0 caso o fugitivo não saiba que foi encontrado.'],
      ['Atacar (perseguidor)', 'Geralmente um ataque ocorre quando a distância é 0, entretanto, caso esteja utilizando uma arma de distância, pode usar a Ação Padrão do seu turno para atacar. Contudo, o perseguidor só pode atacar se o alcance da arma condizer com o raio de distância, se a distância for muito grande, apenas armas de longo alcance específicas podem ser utilizadas.'],
    ],
  },
  {
    id: 'lesao',
    titulo: 'Lesão e Tratamento',
    blocos: [
      ['Tipos de Lesão', 'Lesões podem ocorrer aos personagens de várias formas diferentes, mas geralmente em combates. Existem alguns tipos de lesões, cada uma com gravidades diferentes e formas distintas de tratamento. Os três principais tipos de lesão são:'],
      ['Lesão Comum', 'Uma lesão comum se decorre quando se toma qualquer tipo de dano com um valor menor que o valor da metade de sua vida máxima.'],
      ['Lesão Grave', 'As lesões graves se decorrem quando se toma um dano de valor equivalente a metade ou mais do valor da sua vida máxima, mas ainda abaixo do valor total. Entrar no Estado de Morrendo enquanto estiver com uma lesão grave resulta em uma morte imediata.'],
      ['Lesão Fatal', 'A lesão fatal é a mais séria e se decorre quando você toma um dano de valor igual ou superior ao valor total da sua vida máxima, também resultando em uma morte imediata.'],
      ['Desmaio', 'Existem algumas circunstâncias onde um personagem pode vir a desmaiar. A principal e mais comum é quando a vida atingir um valor entre 1 e 3, onde o personagem desmaia instantaneamente. Quando se desmaia, é necessário rolar testes de Vigor até obter sucesso, para então retornar ao Estado de Consciência. Acordar de um desmaio ocupa a ação padrão do turno, a menos que se tire um crítico, que permite com que o personagem acorde como uma Ação Livre.'],
      ['Estado de Morrendo', 'Um personagem entra no Estado de Morrendo ao atingir 0 no valor de vida ou quando fica com vida negativa. A vida negativa deve ser estabilizada a pelo menos 1 Ponto de Vida para sair do Estado de Morrendo.\nSe o indivíduo estiver com Lesão Grave ele deve ser estabilizado e curará apenas 1 PV. Apenas depois de tratada com sucesso, você pode realizar o tratamento médico para tentar tirar o alvo do Estado de Morrendo.\nQuando entrar no Estado de Morrendo, o personagem ganha 1 Rodada de Imunidade, que faz com que o indivíduo não precise rodar teste de Vigor para resistir a morte. Se a Rodada de Imunidade passar e o mesmo não tiver recuperado vida suficiente, ele deve rolar testes de Vigor para continuar vivo. Falhar resulta na morte. Os testes continuarão até atingir pelo menos 1 PV por qualquer meio.'],
      ['Tipos de Tratamento', 'Para curar qualquer tipo de lesão, seja ela mínima ou grave, é necessário tratá-las. Existem tanto tratamentos improvisados quanto tratamentos completos, podendo ser utilizadas ataduras, panos rasgados ou kits medicinais.\nPara curar, é necessário rodar um teste de perícia de Medicina, que se bem-sucedida, se cura um determinado valor referente ao método utilizado.\nSe estiver com a sanidade instável, também existem tratamentos alternativos como terapia ou conversas, que geralmente consistem em rodar um teste de Acalmar para tentar tranquilizar outro personagem que esteja com problemas psicológicos. O valor de sanidade regenerado varia pela situação e escolha do mestre.'],
      ['Descanso', 'Durante um interlúdio. além dos métodos medicinais, é possível curar tanto PV quanto PS a partir do descanso e horas de sono. Quanto mais horas de sono, mais o corpo e a mente se regeneram (tabela na ficha, em "Mais detalhes").'],
    ],
  },
  {
    id: 'status',
    titulo: 'Status e Condições',
    blocos: [
      ['Status', 'Um status é uma circunstância que um personagem pode adquirir que lhe dá benefícios ou malefícios. Existe uma gama de status que um indivíduo pode ganhar e eles só se perdem em situações específicas ou após um período de tempo.\n' + STATUS_DESC.map(([n, d]) => `${n}: ${d}`).join('\n')],
      ...Object.entries(CONDICOES_DESC).map(([n, d]) => [n, d]),
      ['Condições de Sanidade', INTRO_CONDICOES_SANIDADE],
    ],
  },
  {
    id: 'equip',
    titulo: 'Equipamento',
    blocos: [
      ['Capacidade de Carga', 'Essa mecânica determina quanto peso e espaço um personagem consegue transportar sem comprometer sua mobilidade e seu desempenho.\nUtilizando apenas o próprio corpo e os bolsos de suas vestimentas, um personagem consegue transportar uma carga equivalente a metade do valor da perícia de Força. Para carregar itens além desse limite, será necessário utilizar equipamentos externos, como mochilas, pochetes, coldres e coletes, que oferecem espaços adicionais para o transporte de itens.\nA capacidade total de carga de um personagem é determinada pelo valor de sua perícia de Força. Ao ultrapassar esse limite, o personagem fica sobrecarregado e passa a sofrer penalidades. Independentemente dos equipamentos utilizados, um personagem nunca poderá carregar mais do que o dobro de sua capacidade padrão.'],
      ['Categoria', 'Os equipamentos são classificados em categorias que variam de 0 à 10 e que representam sua qualidade e valor. Essa classificação permite estabelecer a importância relativa dos itens e adaptar sua disponibilidade às necessidades de cada campanha.\nNo início da campanha, o mestre pode definir uma quantidade de categorias que cada personagem terá disponível para montar seu equipamento. Dessa forma, os jogadores podem escolher os itens que melhor se adequam à sua estratégia e ao estilo de jogo do seu personagem.\nEquipamentos e itens de categoria 0 que possuam alguma funcionalidade devem ter sua quantidade determinada por uma rolagem de 1d4, definindo quantas unidades o personagem possui.'],
    ],
  },
];
