# 🎬 ReelFeel

Sua comunidade oficial de curadoria de filmes. Plataforma de descoberta baseada em mood, com catálogo estilo Netflix, gamificação e comunidade cinéfila.

## Começar

```bash
open index.html
```

Funciona em qualquer navegador moderno. Não precisa instalar nada.

## Funcionalidades

### 🎬 Splash Screen
- Animação de entrada estilo Netflix
- Logo com efeito de zoom e pulsação
- Tagline "Sua comunidade oficial de curadoria de filmes"
- Barras de som animadas (sound wave)
- Transição suave para seleção de perfil

### 👥 Seleção de Perfil
- 3 perfis: Amanda, Ângelo, Visitante
- Layout vertical no mobile (um abaixo do outro)
- Animação de entrada escalonada (stagger)
- Experiência personalizada por perfil
- Persistência via localStorage

### 🏠 Home (Catálogo)
- **Hero Carousel**: Banner rotativo com destaques e setas de navegação
- **Surpreenda-me**: Painel de filtros (Mood, Gênero, XP) com layout vertical no mobile
- **Seções**:
  - Continuar Assistindo
  - Minha Lista
  - Em Alta (novidades)
  - Populares (Top 10)
  - Categorias temáticas
- **Cards de Filme**:
  - Badge de XP compacta
  - Ações no hover: ▶ Play, + Lista, ⭐ Avaliar (apenas ícones)
  - Navegação com setas centralizadas

### 📱 Feed
- **Abas Mobile**: Alterna entre "Feed" e "Resenhas em Vídeo"
- **Avaliar um Filme**: Formulário estruturado (selecionar filme → estrelas → comentar)
- **Atividade Recente**: Grid de posts com likes e comentários
- **Resenhas em Vídeo**: Grid responsivo (2 colunas no mobile)
- Layout em duas colunas (desktop)
- Paginação de posts

### 🎯 Minha Curadoria (Perfil)
- **Painel de Identidade**:
  - Avatar e nome do perfil
  - XP total com badge de nível
  - Botão compartilhar perfil
  - Gênero e diretor favoritos
- **Estatísticas**: Filmes assistidos, avaliações, horas assistidas
- **Formulário de Avaliação**: Igual ao Feed
- **Filmes Assistidos**: Grid visual com badges
- **Minhas Resenhas**: Layout multi-coluna

### 🎮 Gamificação
- **XP por Ações**: Assistir (+10), Avaliar (+15), Resenhar (+25)
- **7 Níveis**: Novato → Iniciante → Cinéfilo → Crítico → Especialista → Mestre → Lenda
- **Desafios Semanais**: Metas com recompensas
- **Filme do Dia**: Bônus diário
- **Badges**: Conquistas desbloqueáveis

## Estrutura

```
ReelFeel/
├── index.html      # Estrutura HTML principal
├── style.css       # Estilos CSS (~3000 linhas)
├── app.js          # Lógica JavaScript (~3000 linhas)
├── movies.js       # Catálogo de 24 filmes
└── README.md       # Documentação
```

## Catálogo

24 filmes curados em 6 categorias:

| Categoria | Exemplos |
|-----------|----------|
| 🧘 Contemplativos | Columbus, Paterson, Paris Texas |
| 🎨 Autorais | The Square, Holy Motors, The Handmaiden |
| 🌍 Internacionais | Shoplifters, Roma, Another Round |
| 🌀 Hipnóticos | Under the Skin, The Lobster, Titane |
| 🔥 Intensos | Climax, Uncut Gems, Burning |
| 💔 Emocionais | Marriage Story, Blue Valentine, Aftersun |

## Tecnologias

- **HTML5**: Semântico, acessível (ARIA, skip links)
- **CSS3**: 
  - Variáveis customizadas
  - Flexbox e Grid
  - Animações e transições
  - Responsivo (rem, clamp, media queries)
- **JavaScript Vanilla**:
  - Manipulação DOM
  - localStorage para persistência
  - Sistema de estado
- **APIs**: YouTube Embed para trailers

## Paleta de Cores

```css
--primary: #FF6B6B   /* Coral vibrante */
--secondary: #4ECDC4 /* Turquesa */
--dark: #0F0F0F      /* Fundo escuro */
--gold: #FFD700      /* XP e conquistas */
--muted: #888888     /* Texto secundário */
```

## Responsividade

| Breakpoint | Largura | Adaptações |
|------------|---------|------------|
| Desktop | > 1200px | Layout completo |
| Desktop médio | 992-1199px | Cards menores |
| Tablet | 768-991px | Sidebar empilhada |
| Mobile landscape | 481-767px | Nav compacta, abas |
| Mobile portrait | 361-480px | Perfil no topo, grids 2 colunas |
| Extra small | < 360px | Layout mínimo |

**Mobile Features:**
- Header: Perfil com XP/badge, dropdown para trocar perfil
- Nav: Home, Feed, Curadoria + ícone de pesquisa
- Feed: Abas para alternar entre posts e vídeos
- Surpreenda-me: Filtros empilhados verticalmente
- Cards: Maiores, setas centralizadas

---

Projeto de Imersão Front-end e IA
