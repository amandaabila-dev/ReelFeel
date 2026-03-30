/* ReelFeel - Aplicação Principal */

const app = {
    currentUser: null,
    currentProfile: null,
    currentFilters: { mood: [], genre: [], style: 'all', decade: null },
    catalogFilter: 'all',
    catalogFilterType: 'category',
    selectedMovieId: null,
    selectedMovieRating: 0,
    quickRateMovieId: null,
    currentVideoMovieId: null,
    watchlist: [],
    continueWatching: [],
    posts: [],
    selectedPostType: 'rating',
    selectedPostRating: 0,
    selectedAvatar: null,
    movies: MOVIES
};

const BADGES = {
    'first_review': { icon: '⭐', name: 'Crítico Iniciante', condition: s => s.totalReviews >= 1 },
    'five_reviews': { icon: '🎬', name: 'Cinéfilo', condition: s => s.totalReviews >= 5 },
    'ten_reviews': { icon: '🏆', name: 'Crítico Experiente', condition: s => s.totalReviews >= 10 },
    'high_rater': { icon: '❤️', name: 'Amante de Filmes', condition: s => s.avgRating >= 4 },
    'diverse_taste': { icon: '🎨', name: 'Cinéfilo Versátil', condition: s => s.favoriteGenres.length >= 4 },
    'weekly_warrior': { icon: '⚔️', name: 'Guerreiro Semanal', condition: s => s.currentStreak >= 7 },
    'movie_master': { icon: '👑', name: 'Mestre do Cinema', condition: s => s.totalReviews >= 20 }
};

const MOOD_LABELS = { relaxed: 'Relaxado', adventurous: 'Aventureiro', romantic: 'Romântico', thoughtful: 'Reflexivo', curious: 'Curioso', nostalgic: 'Nostálgico' };
const ALL_BADGES = [
    { id: 'first_review', icon: '⭐', name: 'Primeira Crítica', desc: 'Avalie seu primeiro filme', check: r => r.length >= 1 },
    { id: 'critic_5', icon: '🎬', name: 'Cinéfilo', desc: 'Avalie 5 filmes', check: r => r.length >= 5 },
    { id: 'critic_10', icon: '🏆', name: 'Crítico Experiente', desc: 'Avalie 10 filmes', check: r => r.length >= 10 },
    { id: 'five_star', icon: '⭐', name: 'Nota Máxima', desc: 'Dê 5 estrelas', check: r => r.some(x => x.rating === 5) },
    { id: 'genre_drama', icon: '🎭', name: 'Amante de Drama', desc: 'Avalie 3 dramas', check: (r, m) => countGenre(r, m, 'Drama') >= 3 },
    { id: 'genre_romance', icon: '💕', name: 'Romântico', desc: 'Avalie 3 romances', check: (r, m) => countGenre(r, m, 'Romance') >= 3 },
    { id: 'genre_thriller', icon: '😱', name: 'Caçador de Emoções', desc: 'Avalie 3 thrillers', check: (r, m) => countGenre(r, m, 'Thriller') >= 3 }
];

const AVATAR_OPTIONS = ['🎬', '🎭', '🎥', '📽️', '🍿', '⭐', '🌟', '🎪', '🎨', '🎯', '🦋', '🔥', '💎', '🌙', '☀️', '🌊'];

// Feed Mock Data
const MOCK_FEED = [
    {
        id: 1,
        user: { name: 'Lucas Cinéfilo', avatar: 'https://ui-avatars.com/api/?name=Lucas&background=6366f1&color=fff' },
        type: 'review',
        movieId: 1,
        rating: 5,
        text: 'Forrest Gump é atemporal. Uma história de vida que emociona a cada vez que assisto.',
        likes: 24,
        comments: 8,
        time: '2h'
    },
    {
        id: 2,
        user: { name: 'Marina Films', avatar: 'https://ui-avatars.com/api/?name=Marina&background=ec4899&color=fff' },
        type: 'watching',
        movieId: 10,
        text: 'Gladiador 2 começando! Ansiedade para ver a continuação dessa saga épica.',
        likes: 15,
        comments: 12,
        time: '3h'
    },
    {
        id: 3,
        user: { name: 'Pedro Cult', avatar: 'https://ui-avatars.com/api/?name=Pedro&background=10b981&color=fff' },
        type: 'review',
        movieId: 13,
        rating: 5,
        text: 'Duna: Parte 2 superou todas as expectativas. Denis Villeneuve é um gênio!',
        likes: 56,
        comments: 23,
        time: '5h'
    },
    {
        id: 4,
        user: { name: 'Julia Arte', avatar: 'https://ui-avatars.com/api/?name=Julia&background=f59e0b&color=fff' },
        type: 'list',
        text: 'Atualizei minha lista de favoritos! Adicionei O Poderoso Chefão.',
        likes: 8,
        comments: 2,
        time: '6h'
    },
    {
        id: 5,
        user: { name: 'Carlos Drama', avatar: 'https://ui-avatars.com/api/?name=Carlos&background=8b5cf6&color=fff' },
        type: 'review',
        movieId: 28,
        rating: 5,
        text: 'Coringa é uma obra perturbadora e brilhante. Joaquin Phoenix merecia todos os prêmios!',
        likes: 42,
        comments: 18,
        time: '8h'
    },
    {
        id: 6,
        user: { name: 'Ana Épica', avatar: 'https://ui-avatars.com/api/?name=Ana&background=ef4444&color=fff' },
        type: 'watching',
        movieId: 13,
        text: 'Reassistindo Duna: Parte 2. Cada detalhe visual é uma obra de arte.',
        likes: 19,
        comments: 7,
        time: '12h'
    },
    {
        id: 7,
        user: { name: 'Thiago Classic', avatar: 'https://ui-avatars.com/api/?name=Thiago&background=3b82f6&color=fff' },
        type: 'review',
        movieId: 2,
        rating: 5,
        text: 'O Poderoso Chefão definiu o cinema de máfia para sempre. Obra-prima absoluta!',
        likes: 38,
        comments: 23,
        time: '1h'
    },
    {
        id: 8,
        user: { name: 'Fernanda Cinema', avatar: 'https://ui-avatars.com/api/?name=Fernanda&background=a855f7&color=fff' },
        type: 'watching',
        movieId: 10,
        text: 'Gladiador 2 é pura adrenalina. As cenas de batalha são de tirar o fôlego!',
        likes: 38,
        comments: 14,
        time: '4h'
    },
    {
        id: 9,
        user: { name: 'Roberto SciFi', avatar: 'https://ui-avatars.com/api/?name=Roberto&background=06b6d4&color=fff' },
        type: 'review',
        movieId: 11,
        rating: 5,
        text: 'Interestelar é uma experiência transcendental. A trilha sonora do Hans Zimmer é de arrepiar!',
        likes: 67,
        comments: 31,
        time: '30min'
    },
    {
        id: 10,
        user: { name: 'Camila Thriller', avatar: 'https://ui-avatars.com/api/?name=Camila&background=f97316&color=fff' },
        type: 'review',
        movieId: 5,
        rating: 5,
        text: 'Clube da Luta quebra todas as regras. O twist final é inesquecível!',
        likes: 45,
        comments: 19,
        time: '45min'
    },
    {
        id: 11,
        user: { name: 'Diego Fantasy', avatar: 'https://ui-avatars.com/api/?name=Diego&background=84cc16&color=fff' },
        type: 'watching',
        movieId: 15,
        text: 'Maratona de O Senhor dos Anéis! Começando pelo O Retorno do Rei.',
        likes: 52,
        comments: 28,
        time: '1h'
    },
    {
        id: 12,
        user: { name: 'Beatriz Animação', avatar: 'https://ui-avatars.com/api/?name=Beatriz&background=d946ef&color=fff' },
        type: 'review',
        movieId: 23,
        rating: 5,
        text: 'A Viagem de Chihiro é pura magia. Miyazaki é um gênio absoluto!',
        likes: 73,
        comments: 35,
        time: '2h'
    }
];

const trailerTimers = new Map();
const activeTrailers = new Map();
var currentReviewPlaying = null;
var videoUploadData = { file: null, youtubeId: null, tags: [], rating: 0 };
var searchTimeout = null;

// Perfis pré-definidos
const PROFILES = {
    amanda: {
        id: 'amanda',
        name: 'Amanda',
        avatar: 'assets/amanda.png',
        color: '#FF6B6B',
        bio: 'Apaixonada por cinema autoral e histórias intensas',
        favorites: [4, 5, 6, 19, 21],
        continueWatching: [{ movieId: 17, progress: 65 }, { movieId: 6, progress: 30 }],
        xp: 1250,
        level: 8,
        preferredGenres: ['Drama', 'Romance', 'Autoral'],
        stats: {
            totalReviews: 24,
            avgRating: 4.3,
            moviesWatched: 47,
            hoursWatched: 94,
            favoriteGenre: 'Drama'
        },
        reviews: [
            { movieId: 2, rating: 5, text: 'O Poderoso Chefão é perfeição absoluta. Cada cena é uma aula de cinema.', date: '2024-01-18' },
            { movieId: 5, rating: 5, text: 'Clube da Luta quebrou minha mente. Fincher é um gênio.', date: '2024-01-15' },
            { movieId: 27, rating: 5, text: 'Parasita mereceu cada Oscar. Bong Joon-ho criou uma obra-prima.', date: '2024-01-10' },
            { movieId: 11, rating: 4, text: 'Interestelar me fez chorar. A trilha sonora é transcendental.', date: '2024-01-05' },
            { movieId: 19, rating: 4, text: 'O Silêncio dos Inocentes ainda me dá arrepios.', date: '2023-12-28' }
        ]
    },
    angelo: {
        id: 'angelo',
        name: 'Ângelo',
        avatar: 'assets/angelo.png',
        color: '#4ECDC4',
        bio: 'Cinéfilo de thrillers e filmes hipnóticos',
        favorites: [11, 14, 16, 18, 17],
        continueWatching: [{ movieId: 15, progress: 45 }],
        xp: 890,
        level: 6,
        preferredGenres: ['Thriller', 'Mistério', 'Hipnótico'],
        stats: {
            totalReviews: 18,
            avgRating: 4.1,
            moviesWatched: 35,
            hoursWatched: 72,
            favoriteGenre: 'Thriller'
        },
        reviews: [
            { movieId: 7, rating: 5, text: 'Heath Ledger como Coringa é a melhor atuação que já vi.', date: '2024-01-20' },
            { movieId: 8, rating: 5, text: 'Matrix revolucionou o cinema de ação. Ainda impressiona.', date: '2024-01-12' },
            { movieId: 20, rating: 5, text: 'Se7en é perturbador de um jeito brilhante.', date: '2024-01-08' },
            { movieId: 12, rating: 4, text: 'A Origem é um quebra-cabeça fascinante.', date: '2024-01-02' },
            { movieId: 14, rating: 4, text: 'Blade Runner 2049 é visualmente deslumbrante.', date: '2023-12-25' }
        ]
    },
    visitante: {
        id: 'visitante',
        name: 'Visitante',
        avatar: 'assets/visitante.png',
        color: '#888888',
        bio: 'Explorando o catálogo',
        favorites: [],
        continueWatching: [],
        xp: 0,
        level: 1,
        preferredGenres: [],
        stats: {
            totalReviews: 0,
            avgRating: 0,
            moviesWatched: 0,
            hoursWatched: 0,
            favoriteGenre: '-'
        },
        reviews: []
    }
};

// Utilitários
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const getLS = (key, def = '[]') => JSON.parse(localStorage.getItem(key) || def);
const setLS = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const userKey = key => app.currentUser ? `${key}_${app.currentUser.id}` : key;

// Inicialização
window.addEventListener('load', () => {
    loadUserData();
    initializeDailyMovie();
    initializeWeeklyChallenge();
    
    const savedProfile = localStorage.getItem('currentProfile');
    const splashScreen = $('splash-screen');
    
    if (savedProfile) {
        // Perfil salvo: pula splash e vai direto
        if (splashScreen) splashScreen.classList.add('hidden');
        selectProfile(savedProfile);
    } else {
        // Sem perfil: mostra splash e depois perfis
        renderProfileSelect();
        
        // Aguarda a animação da splash terminar (2.8s)
        setTimeout(() => {
            if (splashScreen) splashScreen.classList.add('hidden');
            showPage('profile-select');
            
            // Ativa animação dos perfis
            const profileSelect = $('profile-select');
            if (profileSelect) {
                profileSelect.classList.add('animate-in');
            }
        }, 2800);
    }
});

function logout() {
    app.currentUser = null;
    app.currentProfile = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentProfile');
    updateNavigation();
    renderProfileSelect();
    showPage('profile-select');
    showToast('Até logo!', 'info');
    
    // Ativa animação dos perfis
    setTimeout(() => {
        const profileSelect = $('profile-select');
        if (profileSelect) {
            profileSelect.classList.remove('animate-in');
            void profileSelect.offsetWidth;
            profileSelect.classList.add('animate-in');
        }
    }, 50);
}

function loadUserData() {
    const stored = localStorage.getItem('currentUser');
    if (stored) app.currentUser = JSON.parse(stored);
    const profile = localStorage.getItem('currentProfile');
    if (profile && PROFILES[profile]) app.currentProfile = PROFILES[profile];
}

// Seleção de Perfil
function renderProfileSelect() {
    const container = $('profiles-grid');
    if (!container) return;
    
    container.innerHTML = Object.values(PROFILES).map(profile => `
        <button class="profile-card" onclick="selectProfile('${profile.id}')" style="--profile-color: ${profile.color}">
            <div class="profile-card-avatar">
                <img src="${profile.avatar}" alt="${profile.name}">
            </div>
            <span class="profile-card-name">${profile.name}</span>
        </button>
    `).join('');
}

function selectProfile(profileId) {
    const profile = PROFILES[profileId];
    if (!profile) return;
    
    app.currentProfile = profile;
    localStorage.setItem('currentProfile', profileId);
    
    // Simula login do perfil como usuário
    app.currentUser = {
        id: profile.id,
        name: profile.name,
        email: `${profile.id}@reelfeel.com`
    };
    setLS('currentUser', app.currentUser);
    
    // Carrega dados específicos do perfil
    loadProfileData(profile);
    
    updateNavigation();
    updateGamificationDisplay();
    
    if (profile.id === 'visitante') {
        // Visitante vai para seleção de perfil (sem acesso completo)
        showToast('Selecione um perfil para continuar', 'info');
        showPage('profile-select');
    } else {
        showPage('catalog');
        showToast(`Olá, ${profile.name}! 👋`, 'success');
    }
}

function loadProfileData(profile) {
    // Carrega favoritos
    app.watchlist = profile.favorites || [];
    setLS(userKey('watchlist'), app.watchlist);
    
    // Carrega continuar assistindo
    app.continueWatching = profile.continueWatching || [];
    setLS(userKey('continueWatching'), app.continueWatching);
    
    // Carrega XP
    localStorage.setItem(`xp_${profile.id}`, profile.xp.toString());
    
    // Carrega avatar
    const avatars = getLS('avatars', '{}');
    avatars[profile.id] = { emoji: profile.avatar };
    setLS('avatars', avatars);
    
    // Carrega bio
    const profiles = getLS('profiles', '{}');
    profiles[profile.id] = { name: profile.name, bio: profile.bio };
    setLS('profiles', profiles);
}

function toggleProfileMenu() {
    const dropdown = $('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function focusSearch() {
    const searchInput = $('search-input');
    if (searchInput) {
        searchInput.focus();
        searchInput.style.width = '100%';
        searchInput.style.opacity = '1';
        searchInput.style.position = 'relative';
    }
}

document.addEventListener('click', (e) => {
    const dropdown = $('profile-dropdown');
    const profileBtn = $('header-profile-btn');
    if (dropdown && !dropdown.contains(e.target) && !profileBtn?.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

function switchProfile() {
    app.currentUser = null;
    app.currentProfile = null;
    localStorage.removeItem('currentProfile');
    localStorage.removeItem('currentUser');
    renderProfileSelect();
    showPage('profile-select');
    
    // Ativa animação dos perfis
    setTimeout(() => {
        const profileSelect = $('profile-select');
        if (profileSelect) {
            profileSelect.classList.remove('animate-in');
            void profileSelect.offsetWidth; // Force reflow
            profileSelect.classList.add('animate-in');
        }
    }, 50);
}

// Navegação
function updateNavigation() {
    const isLogged = !!app.currentUser;
    const isVisitante = app.currentProfile?.id === 'visitante';
    
    // Mostrar/esconder elementos do header
    $('main-nav')?.classList.toggle('hidden', !isLogged || isVisitante);
    $('search-container')?.classList.toggle('hidden', !isLogged || isVisitante);
    $('header-profile-btn')?.classList.toggle('hidden', !isLogged);
    $('switch-profile-btn')?.classList.toggle('hidden', !isLogged);
    
    // Atualizar avatar, nome, XP e Badge no header
    if (isLogged && app.currentProfile) {
        const avatarEl = $('header-profile-avatar');
        const nameEl = $('header-profile-name');
        const levelEl = $('header-profile-level');
        const xpEl = $('header-profile-xp');
        
        if (avatarEl) {
            avatarEl.innerHTML = `<img src="${app.currentProfile.avatar}" alt="${app.currentProfile.name}">`;
        }
        if (nameEl) nameEl.textContent = app.currentProfile.name;
        
        const xp = parseInt(localStorage.getItem(`xp_${app.currentUser?.id}`) || '0');
        const level = getUserLevel();
        if (levelEl) levelEl.innerHTML = `${level.icon} ${level.name}`;
        if (xpEl) xpEl.textContent = `${xp} XP`;
    }
    
    if (isLogged && !isVisitante) {
        loadWatchlist(); 
        loadContinueWatching(); 
    }
}

function goToHome() {
    if (app.currentUser && app.currentProfile?.id !== 'visitante') {
        showPage('catalog');
    } else {
        switchProfile();
    }
}

function renderCatalog() {
    if (!app.currentProfile || app.currentProfile.id === 'visitante') return;
    
    const container = $('catalog-content');
    if (!container) return;
    
    // Escolhe 4 filmes para o carrossel de destaque
    const topRatedMovies = [...app.movies].sort((a, b) => b.platformRating - a.platformRating).slice(0, 4);
    
    container.innerHTML = `
        <!-- HERO CAROUSEL (estilo Netflix) -->
        <section class="netflix-hero-carousel">
            <div class="hero-slides" id="hero-slides">
                ${topRatedMovies.map((movie, index) => {
                    const heroUrl = movie.poster || `https://img.youtube.com/vi/${movie.trailerId}/maxresdefault.jpg`;
                    return `
                        <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}" style="background-image: linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%), url('${heroUrl}')">
                            <div class="hero-content">
                                <span class="hero-badge">Destaque para você</span>
                                <h1 class="hero-title">${movie.title}</h1>
                                <p class="hero-meta">${movie.year} • ${movie.genres.join(' • ')} • ${movie.duration}</p>
                                <p class="hero-description">${movie.description}</p>
                                <div class="hero-actions">
                                    <button class="btn btn-hero-play" onclick="watchMovie(${movie.id})">
                                        <span>▶</span> Assistir
                                    </button>
                                    <button class="btn btn-hero-info" onclick="openReviewModal(${movie.id})">
                                        <span>ℹ</span> Mais Informações
                                    </button>
                                    <button class="btn btn-hero-add" onclick="toggleWatchlist(${movie.id})">
                                        <span>${app.watchlist.includes(movie.id) ? '✓' : '+'}</span>
                                    </button>
                                </div>
                            </div>
                            <div class="hero-rating">
                                <span class="hero-stars">⭐ ${movie.platformRating}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <button class="hero-arrow hero-arrow-left" onclick="prevHeroSlide()">‹</button>
            <button class="hero-arrow hero-arrow-right" onclick="nextHeroSlide()">›</button>
            <div class="hero-indicators">
                ${topRatedMovies.map((_, index) => `
                    <button class="hero-indicator ${index === 0 ? 'active' : ''}" onclick="goToHeroSlide(${index})"></button>
                `).join('')}
            </div>
        </section>

        <!-- Surpreenda-me Panel -->
        <section class="surprise-panel" id="surprise-panel">
            <div class="surprise-panel-content" id="surprise-sidebar"></div>
        </section>

        <!-- CATÁLOGO -->
        <div class="netflix-catalog">
            
            <!-- Continuar Assistindo -->
            <section class="netflix-row" id="row-continue">
                <div class="row-header">
                    <h2 class="row-title">Continuar Assistindo</h2>
                    <div class="slider-indicators" id="indicators-continue"></div>
                </div>
                <div class="row-wrapper">
                    <button class="row-arrow left" onclick="scrollRow(this, -1)">‹</button>
                    <div class="row-content" id="continue-content"></div>
                    <button class="row-arrow right" onclick="scrollRow(this, 1)">›</button>
                </div>
            </section>

            <!-- Minha Lista -->
            <section class="netflix-row" id="row-mylist">
                <div class="row-header">
                    <h2 class="row-title">Minha Lista</h2>
                    <div class="slider-indicators" id="indicators-mylist"></div>
                </div>
                <div class="row-wrapper">
                    <button class="row-arrow left" onclick="scrollRow(this, -1)">‹</button>
                    <div class="row-content" id="mylist-content"></div>
                    <button class="row-arrow right" onclick="scrollRow(this, 1)">›</button>
                </div>
            </section>

            <!-- Populares -->
            <section class="netflix-row" id="row-popular">
                <div class="row-header">
                    <h2 class="row-title">Populares no ReelFeel</h2>
                    <div class="slider-indicators" id="indicators-popular"></div>
                </div>
                <div class="row-wrapper">
                    <button class="row-arrow left" onclick="scrollRow(this, -1)">‹</button>
                    <div class="row-content row-numbered" id="toprated-content"></div>
                    <button class="row-arrow right" onclick="scrollRow(this, 1)">›</button>
                </div>
            </section>

            <!-- Thriller -->
            <section class="netflix-row" id="row-thriller">
                <div class="row-header">
                    <h2 class="row-title">Thriller e Suspense</h2>
                    <div class="slider-indicators" id="indicators-thriller"></div>
                </div>
                <div class="row-wrapper">
                    <button class="row-arrow left" onclick="scrollRow(this, -1)">‹</button>
                    <div class="row-content" id="cat-thriller"></div>
                    <button class="row-arrow right" onclick="scrollRow(this, 1)">›</button>
                </div>
            </section>

            <!-- Drama -->
            <section class="netflix-row" id="row-drama">
                <div class="row-header">
                    <h2 class="row-title">Drama</h2>
                    <div class="slider-indicators" id="indicators-drama"></div>
                </div>
                <div class="row-wrapper">
                    <button class="row-arrow left" onclick="scrollRow(this, -1)">‹</button>
                    <div class="row-content" id="cat-drama"></div>
                    <button class="row-arrow right" onclick="scrollRow(this, 1)">›</button>
                </div>
            </section>

            <!-- Animação -->
            <section class="netflix-row" id="row-animacao">
                <div class="row-header">
                    <h2 class="row-title">Animação</h2>
                    <div class="slider-indicators" id="indicators-animacao"></div>
                </div>
                <div class="row-wrapper">
                    <button class="row-arrow left" onclick="scrollRow(this, -1)">‹</button>
                    <div class="row-content" id="cat-animacao"></div>
                    <button class="row-arrow right" onclick="scrollRow(this, 1)">›</button>
                </div>
            </section>
        </div>
    `;
    
    // Renderiza conteúdo
    renderNetflixHome();
    updateGamificationDisplay();
    startHeroCarousel();
}

// Hero Carousel
let heroCarouselInterval = null;
let currentHeroSlide = 0;

function startHeroCarousel() {
    if (heroCarouselInterval) clearInterval(heroCarouselInterval);
    heroCarouselInterval = setInterval(() => {
        const slides = $$('.hero-slide');
        if (slides.length === 0) return;
        currentHeroSlide = (currentHeroSlide + 1) % slides.length;
        goToHeroSlide(currentHeroSlide);
    }, 5000);
}

function goToHeroSlide(index) {
    const slides = $$('.hero-slide');
    if (slides.length === 0) return;
    currentHeroSlide = ((index % slides.length) + slides.length) % slides.length;
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentHeroSlide);
    });
    $$('.hero-indicator').forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentHeroSlide);
    });
}

function prevHeroSlide() {
    goToHeroSlide(currentHeroSlide - 1);
}

function nextHeroSlide() {
    goToHeroSlide(currentHeroSlide + 1);
}

let feedCurrentPage = 1;
const FEED_POSTS_PER_PAGE = 3;

function getPostLikes() {
    return JSON.parse(localStorage.getItem('postLikes') || '[]');
}

function togglePostLike(postId) {
    if (!app.currentUser) {
        showToast('Faça login para curtir!', 'warning');
        return;
    }
    
    const likes = getPostLikes();
    const index = likes.indexOf(postId);
    const post = MOCK_FEED.find(p => p.id === postId);
    
    if (index > -1) {
        likes.splice(index, 1);
        if (post) post.likes = Math.max(0, post.likes - 1);
        showToast('Curtida removida', 'info');
    } else {
        likes.push(postId);
        if (post) post.likes++;
        showToast('Curtido!', 'success');
    }
    
    localStorage.setItem('postLikes', JSON.stringify(likes));
    renderFeedPosts(feedCurrentPage);
}

function togglePostComments(postId) {
    const commentsSection = $(`comments-${postId}`);
    if (commentsSection) {
        commentsSection.classList.toggle('hidden');
    }
}

function sendPostComment(postId) {
    if (!app.currentUser || !app.currentProfile) {
        showToast('Faça login para comentar!', 'warning');
        return;
    }
    
    const input = $(`comment-input-${postId}`);
    const text = input?.value?.trim();
    
    if (!text) {
        showToast('Escreva um comentário!', 'warning');
        return;
    }
    
    const post = MOCK_FEED.find(p => p.id === postId);
    if (post) {
        if (!post.commentsList) post.commentsList = [];
        post.commentsList.push({
            author: app.currentProfile.name,
            text: text
        });
        post.comments++;
    }
    
    input.value = '';
    renderFeedPosts(feedCurrentPage);
    
    // Reabrir a seção de comentários
    setTimeout(() => {
        const commentsSection = $(`comments-${postId}`);
        if (commentsSection) commentsSection.classList.remove('hidden');
    }, 100);
    
    showToast('Comentário adicionado!', 'success');
    addXP(5);
}

function renderFeedPosts(page = 1) {
    const container = $('feed-posts-grid');
    if (!container) return;
    
    feedCurrentPage = page;
    const totalPosts = MOCK_FEED.length;
    const totalPages = Math.ceil(totalPosts / FEED_POSTS_PER_PAGE);
    const startIndex = (page - 1) * FEED_POSTS_PER_PAGE;
    const endIndex = startIndex + FEED_POSTS_PER_PAGE;
    const postsToShow = MOCK_FEED.slice(startIndex, endIndex);
    
    const postsHtml = postsToShow.map(post => {
        const movie = post.movieId ? app.movies.find(m => m.id === post.movieId) : null;
        
        let content = '';
        if (post.type === 'review' && movie) {
            content = `
                <div class="feed-post-movie">
                    <img src="${movie.poster}" alt="${movie.title}">
                    <div>
                        <span class="feed-movie-title">${movie.title}</span>
                        <span class="feed-rating">${'★'.repeat(post.rating)}${'☆'.repeat(5-post.rating)}</span>
                    </div>
                </div>
                <p class="feed-post-text">${post.text}</p>
            `;
        } else if (post.type === 'watching' && movie) {
            content = `
                <div class="feed-post-movie">
                    <img src="${movie.poster}" alt="${movie.title}">
                    <div>
                        <span class="feed-movie-title">${movie.title}</span>
                        <span class="feed-watching">▶ Assistindo agora</span>
                    </div>
                </div>
                <p class="feed-post-text">${post.text}</p>
            `;
        } else {
            content = `<p class="feed-post-text">${post.text}</p>`;
        }
        
        const postId = post.id || Date.now() + Math.random();
        const isLiked = getPostLikes().includes(postId);
        const postComments = post.commentsList || [];
        
        return `
            <article class="feed-post" data-post-id="${postId}">
                <div class="feed-post-header">
                    <img src="${post.user.avatar}" alt="${post.user.name}" class="feed-avatar">
                    <div class="feed-user-info">
                        <span class="feed-username">${post.user.name}</span>
                        <span class="feed-time">${post.time}</span>
                    </div>
                </div>
                <div class="feed-post-content">
                    ${content}
                </div>
                <div class="feed-post-actions">
                    <button class="feed-action ${isLiked ? 'liked' : ''}" onclick="togglePostLike(${postId})">
                        <span class="action-icon">${isLiked ? '❤️' : '🤍'}</span>
                        <span class="action-count">${post.likes}</span> curtidas
                    </button>
                    <button class="feed-action" onclick="togglePostComments(${postId})">
                        <span class="action-icon">💬</span>
                        <span class="action-count">${post.comments}</span> comentários
                    </button>
                </div>
                <div class="feed-post-comments hidden" id="comments-${postId}">
                    <div class="comments-list" id="comments-list-${postId}">
                        ${postComments.map(c => `
                            <div class="comment-item">
                                <span class="comment-author">${c.author}:</span>
                                <span class="comment-text">${c.text}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="comment-input-wrapper">
                        <input type="text" class="comment-input" id="comment-input-${postId}" placeholder="Escreva um comentário...">
                        <button class="comment-send-btn" onclick="sendPostComment(${postId})">Enviar</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
    
    const paginationHtml = totalPages > 1 ? `
        <div class="feed-pagination">
            <button class="feed-pagination-btn" onclick="renderFeedPosts(${page - 1})" ${page <= 1 ? 'disabled' : ''}>‹ Anterior</button>
            <span class="feed-pagination-info">${page} de ${totalPages}</span>
            <button class="feed-pagination-btn" onclick="renderFeedPosts(${page + 1})" ${page >= totalPages ? 'disabled' : ''}>Próximo ›</button>
        </div>
    ` : '';
    
    container.innerHTML = postsHtml + paginationHtml;
}

function renderTrendingMixed() {
    const container = $('trending-mixed-content');
    if (!container) return;
    
    // Mix de filmes em alta + resenhas recentes
    const trendingMovies = [...app.movies]
        .sort((a, b) => b.platformRating - a.platformRating)
        .slice(0, 6);
    
    const videoReviews = getVideoReviews().slice(0, 3);
    
    let html = '<div class="trending-grid">';
    
    // Filmes
    trendingMovies.forEach((movie, i) => {
        const posterUrl = movie.poster || `https://img.youtube.com/vi/${movie.trailerId}/hqdefault.jpg`;
        html += `
            <article class="trending-item trending-movie" onclick="watchMovie(${movie.id})">
                <div class="trending-poster">
                    <img src="${posterUrl}" alt="${movie.title}" loading="lazy" onerror="this.src='https://img.youtube.com/vi/${movie.trailerId}/hqdefault.jpg'">
                    <div class="trending-overlay">
                        <span class="trending-play">▶</span>
                    </div>
                    <span class="trending-badge movie-badge">Filme</span>
                </div>
                <div class="trending-info">
                    <h4>${movie.title}</h4>
                    <span>⭐ ${movie.platformRating}</span>
                </div>
            </article>`;
    });
    
    // Resenhas
    videoReviews.forEach(review => {
        const movie = app.movies.find(m => m.id === review.movieId);
        html += `
            <article class="trending-item trending-review" onclick="openReviewPlayer('${review.id}')">
                <div class="trending-poster">
                    <img src="https://img.youtube.com/vi/${review.youtubeId}/hqdefault.jpg" alt="${review.title}" loading="lazy">
                    <div class="trending-overlay">
                        <span class="trending-play">▶</span>
                    </div>
                    <span class="trending-badge review-badge">📹 Resenha</span>
                </div>
                <div class="trending-info">
                    <h4>${review.title}</h4>
                    <span>${review.authorName} • ${formatNumber(review.views)} views</span>
                </div>
            </article>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function updateHomeWeeklyChallenge() {
    const challenge = getLS('weeklyChallenge', 'null');
    const container = $('home-weekly-challenge');
    if (!container || !challenge) return;
    
    const startReviews = getLS('challengeStartReviews');
    const currentReviews = getLS('reviews');
    const weekReviews = currentReviews.filter(r => !startReviews.find(s => s.movieId === r.movieId && s.userId === r.userId));
    
    const progress = challenge.check(weekReviews, app.movies);
    const percentage = Math.min((progress / challenge.target) * 100, 100);
    const completed = progress >= challenge.target;
    
    container.innerHTML = `
        <div class="home-challenge-card ${completed ? 'completed' : ''}">
            <div class="challenge-left">
                <span class="challenge-emoji">${completed ? '🏆' : '🎯'}</span>
            </div>
            <div class="challenge-center">
                <h3>${challenge.title}</h3>
                <p>${challenge.desc}</p>
                <div class="challenge-progress-bar">
                    <div class="challenge-progress-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="challenge-progress-text">${progress}/${challenge.target}</span>
            </div>
            <div class="challenge-right">
                <span class="challenge-reward">+${challenge.xp} XP</span>
                ${completed && !localStorage.getItem('challengeClaimed_' + getWeekStart()) ? 
                    `<button class="btn btn-primary btn-sm" onclick="claimChallengeReward()">Resgatar</button>` : 
                    completed ? '<span class="challenge-done">✓ Completo</span>' : ''}
            </div>
        </div>
    `;
}

function loadWatchlist() {
    if (!app.currentUser) return;
    app.watchlist = getLS(userKey('watchlist'));
}

function getWatchlist() { return app.currentUser ? getLS(userKey('watchlist')) : []; }
function saveWatchlist(list) { if (app.currentUser) { app.watchlist = list; setLS(userKey('watchlist'), list); } }
function getUserReviews() { return app.currentUser ? getLS('reviews').filter(r => r.userId === app.currentUser.id) : []; }
function loadContinueWatching() { if (app.currentUser) app.continueWatching = getLS(userKey('continueWatching')); }

function showPage(pageName) {
    const protectedPages = ['discover', 'profile', 'feed', 'catalog'];
    const isVisitante = app.currentProfile?.id === 'visitante';
    
    if ((!app.currentUser || isVisitante) && protectedPages.includes(pageName)) {
        return switchProfile();
    }
    
    $$('.page').forEach(p => p.classList.add('hidden'));
    const page = $(pageName);
    if (page) page.classList.remove('hidden');
    
    $$('nav a').forEach(l => l.classList.remove('active'));
    const activeNav = $('nav-' + pageName);
    if (activeNav) activeNav.classList.add('active');
    
    // Esconde header na seleção de perfil
    const header = document.querySelector('header');
    if (header) {
        header.classList.toggle('hidden', pageName === 'profile-select');
    }
    
    if (pageName === 'profile-select') {
        renderProfileSelect();
    }
    if (pageName === 'profile') loadUserProfile();
    if (pageName === 'catalog' && app.currentUser && !isVisitante) {
        renderCatalog();
    }
    if (pageName === 'discover') { 
        $('recommendations-container')?.classList.add('hidden'); 
        $('no-results')?.classList.remove('hidden'); 
    }
    if (pageName === 'feed') renderFeed();
    if (pageName === 'curadoria') renderCuradoria();
}

// UI Helpers
function showError(id, msg) { const el = $(id); if (el) { el.textContent = msg; el.classList.remove('hidden'); } }
function clearError(id) { const el = $(id); if (el) el.classList.add('hidden'); }
function showSuccess(id, msg) { const el = $(id); if (el) { el.textContent = msg; el.classList.remove('hidden'); } }

// Navegação das rows
function scrollRow(btn, direction) {
    const wrapper = btn.parentElement;
    const row = wrapper.querySelector('.row-content');
    if (!row) return;
    
    const scrollAmount = row.clientWidth * 0.8;
    const maxScroll = row.scrollWidth - row.clientWidth;
    
    if (direction === 1 && row.scrollLeft >= maxScroll - 10) {
        row.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction === -1 && row.scrollLeft <= 10) {
        row.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
        row.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
    
    setTimeout(() => updateRowArrows(wrapper), 350);
}

function updateRowArrows(wrapper) {
    const row = wrapper.querySelector('.row-content');
    const leftArrow = wrapper.querySelector('.row-arrow.left');
    if (!row || !leftArrow) return;
    
    const atStart = row.scrollLeft <= 10;
    leftArrow.classList.toggle('hidden', atStart);
}

function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// Surpreenda-me com Moods e Gêneros
const SURPRISE_MOODS = [
    { id: 'emotional', emoji: '😢', label: 'Emotivo' },
    { id: 'excited', emoji: '🤩', label: 'Animado' },
    { id: 'thoughtful', emoji: '🤔', label: 'Reflexivo' },
    { id: 'relaxed', emoji: '😌', label: 'Relaxado' },
    { id: 'dark', emoji: '🌑', label: 'Sombrio' },
    { id: 'nostalgic', emoji: '📼', label: 'Nostálgico' }
];

const SURPRISE_GENRES = [
    { id: 'Drama', label: 'Drama' },
    { id: 'Thriller', label: 'Thriller' },
    { id: 'Animação', label: 'Animação' },
    { id: 'Ação', label: 'Ação' },
    { id: 'Ficção Científica', label: 'Sci-Fi' },
    { id: 'Fantasia', label: 'Fantasia' }
];

const SURPRISE_XP = [
    { id: '10', label: '+10 XP', emoji: '⭐' },
    { id: '15', label: '+15 XP', emoji: '🌟' },
    { id: '25', label: '+25 XP', emoji: '💫' }
];

let selectedMood = null;
let selectedGenre = null;
let selectedXP = null;

function renderSurpriseButton() {
    const container = $('surprise-sidebar');
    if (!container) return;
    
    container.innerHTML = `
        <div class="surprise-compact">
            <div class="surprise-chips-row">
                <div class="surprise-filter-group">
                    <span class="surprise-section-label">Mood</span>
                    <div class="surprise-chips-inline">
                        ${SURPRISE_MOODS.map(mood => `
                            <button class="surprise-chip-icon" onclick="selectSurpriseMood('${mood.id}')" data-mood="${mood.id}" title="${mood.label}">
                                ${mood.emoji}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <span class="surprise-divider">|</span>
                <div class="surprise-filter-group">
                    <span class="surprise-section-label">Gênero</span>
                    <div class="surprise-chips-inline">
                        ${SURPRISE_GENRES.slice(0, 4).map(genre => `
                            <button class="surprise-chip-text" onclick="selectSurpriseGenre('${genre.id}')" data-genre="${genre.id}">
                                ${genre.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <span class="surprise-divider">|</span>
                <div class="surprise-filter-group">
                    <span class="surprise-section-label">XP</span>
                    <div class="surprise-chips-inline">
                        ${SURPRISE_XP.map(xp => `
                            <button class="surprise-chip-xp" onclick="selectSurpriseXP('${xp.id}')" data-xp="${xp.id}">
                                ${xp.emoji}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
            <button class="surprise-btn-compact" id="surprise-btn">
                🎲 Surpreenda-me
            </button>
        </div>
    `;
}

function selectSurpriseMood(moodId) {
    selectedMood = selectedMood === moodId ? null : moodId;
    $$('[data-mood]').forEach(btn => btn.classList.toggle('active', btn.dataset.mood === selectedMood));
    updateSurpriseBtn();
}

function selectSurpriseGenre(genreId) {
    selectedGenre = selectedGenre === genreId ? null : genreId;
    $$('[data-genre]').forEach(btn => btn.classList.toggle('active', btn.dataset.genre === selectedGenre));
    updateSurpriseBtn();
}

function selectSurpriseXP(xpId) {
    selectedXP = selectedXP === xpId ? null : xpId;
    $$('[data-xp]').forEach(btn => btn.classList.toggle('active', btn.dataset.xp === selectedXP));
    updateSurpriseBtn();
}

function updateSurpriseBtn() {
    const btn = $('surprise-btn');
    if (btn) btn.disabled = !(selectedMood || selectedGenre || selectedXP);
}

function surpriseMe() {
    if (!selectedMood && !selectedGenre) {
        showToast('Selecione um mood ou gênero!', 'info');
        return;
    }
    
    const moodToStyle = {
        'emotional': ['drama', 'classico'],
        'excited': ['acao', 'thriller', 'epico'],
        'thoughtful': ['drama', 'ficcao'],
        'relaxed': ['animacao', 'classico'],
        'dark': ['thriller', 'drama'],
        'nostalgic': ['classico', 'animacao']
    };
    
    let filteredMovies = app.movies;
    
    // Filtrar por mood
    if (selectedMood) {
        const styles = moodToStyle[selectedMood] || [];
        filteredMovies = filteredMovies.filter(m => styles.includes(m.style));
    }
    
    // Filtrar por gênero
    if (selectedGenre) {
        filteredMovies = filteredMovies.filter(m => m.genres.includes(selectedGenre));
    }
    
    if (filteredMovies.length === 0) {
        showToast('Nenhum filme encontrado', 'info');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredMovies.length);
    const randomMovie = filteredMovies[randomIndex];
    
    if (randomMovie) {
        showSurpriseMovie(randomMovie);
    }
}

function showSurpriseMovie(movie) {
    const modal = document.createElement('div');
    modal.className = 'surprise-modal';
    modal.innerHTML = `
        <div class="surprise-modal-content">
            <button class="surprise-close" onclick="this.closest('.surprise-modal').remove()">×</button>
            <div class="surprise-poster">
                <img src="${movie.poster}" alt="${movie.title}">
            </div>
            <div class="surprise-info">
                <h2>${movie.title}</h2>
                <div class="surprise-meta">
                    <span>${movie.year}</span>
                    <span>•</span>
                    <span>${movie.duration}</span>
                    <span>•</span>
                    <span>⭐ ${movie.platformRating}</span>
                </div>
                <p class="surprise-genres">${movie.genres.join(' • ')}</p>
                <p class="surprise-description">${movie.description}</p>
                <div class="surprise-actions">
                    <button class="btn btn-primary" onclick="watchMovie(${movie.id}); this.closest('.surprise-modal').remove();">
                        ▶ Assistir Agora
                    </button>
                    <button class="btn btn-outline" onclick="toggleWatchlist(${movie.id}); this.closest('.surprise-modal').remove();">
                        + Minha Lista
                    </button>
                    <button class="btn btn-ghost" onclick="this.closest('.surprise-modal').remove(); surpriseMe();">
                        🎲 Outro Filme
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Netflix Home
function renderNetflixHome() {
    if (!app.currentUser) return;
    
    // Renderiza botão Surpreenda-me
    renderSurpriseButton();
    
    // Minha Lista (com destaque do primeiro filme)
    const watchlistMovies = app.movies.filter(m => app.watchlist.includes(m.id));
    const mylistContainer = $('mylist-content');
    const mylistRow = $('row-mylist');
    
    if (mylistContainer && mylistRow) {
        if (watchlistMovies.length) {
            mylistContainer.innerHTML = watchlistMovies.map(m => createNetflixCard(m)).join('');
            mylistRow.style.display = '';
        } else {
            if (mylistRow) mylistRow.style.display = 'none';
        }
    }
    
    // Continuar Assistindo
    const continueMovies = app.continueWatching.map(c => app.movies.find(m => m.id === c.movieId)).filter(Boolean);
    const continueContainer = $('continue-content');
    const continueRow = $('row-continue');
    if (continueContainer) {
        if (continueMovies.length) {
            continueContainer.innerHTML = continueMovies.map(m => createNetflixCard(m, null, true)).join('');
            if (continueRow) continueRow.style.display = '';
        } else {
            if (continueRow) continueRow.style.display = 'none';
        }
    }
    
    // Set para rastrear filmes já exibidos (evitar repetição)
    const displayedMovies = new Set();
    
    // Adiciona filmes da watchlist e continuar assistindo ao set
    watchlistMovies.forEach(m => displayedMovies.add(m.id));
    continueMovies.forEach(m => displayedMovies.add(m.id));
    
    // Populares (Top 10 com ranking, excluindo já exibidos)
    const allByRating = [...app.movies].sort((a, b) => b.platformRating - a.platformRating);
    const popularMovies = allByRating.filter(m => !displayedMovies.has(m.id)).slice(0, 10);
    const topratedContainer = $('toprated-content');
    const topratedRow = topratedContainer?.closest('.netflix-row');
    if (topratedContainer) {
        if (popularMovies.length) {
            topratedContainer.innerHTML = popularMovies.map((m, i) => createNetflixCard(m, i + 1)).join('');
            popularMovies.forEach(m => displayedMovies.add(m.id));
            if (topratedRow) topratedRow.style.display = '';
        } else {
            if (topratedRow) topratedRow.style.display = 'none';
        }
    }
    
    // Por Categoria (excluindo já exibidos, esconde seções vazias)
    const categoryMap = {
        'Thriller': 'cat-thriller',
        'Drama': 'cat-drama',
        'Animação': 'cat-animacao'
    };
    
    Object.entries(categoryMap).forEach(([category, containerId]) => {
        const container = $(containerId);
        const row = container?.closest('.netflix-row');
        if (container) {
            const movies = app.movies.filter(m => m.category === category && !displayedMovies.has(m.id));
            if (movies.length) {
                container.innerHTML = movies.map(m => createNetflixCard(m)).join('');
                movies.forEach(m => displayedMovies.add(m.id));
                if (row) row.style.display = '';
            } else {
                if (row) row.style.display = 'none';
            }
        }
    });
    
    // Configura listeners de trailer nos cards
    setupCardListeners();
    
    // Atualiza indicadores de slider
    updateSliderIndicators('indicators-continue', continueMovies.length);
    updateSliderIndicators('indicators-mylist', watchlistMovies.length);
    updateSliderIndicators('indicators-popular', popularMovies.length);
    
    // Indicadores por categoria
    Object.entries(categoryMap).forEach(([category, containerId]) => {
        const indicatorId = 'indicators-' + containerId.replace('cat-', '');
        const count = app.movies.filter(m => m.category === category && !displayedMovies.has(m.id)).length;
        updateSliderIndicators(indicatorId, count);
    });
    
    // Verifica overflow para mostrar/esconder setas (com delay para garantir renderização)
    setTimeout(checkRowOverflow, 100);
}

function checkRowOverflow() {
    document.querySelectorAll('.row-wrapper').forEach(wrapper => {
        const content = wrapper.querySelector('.row-content');
        if (!content) return;
        
        const hasOverflow = content.scrollWidth > content.clientWidth;
        wrapper.classList.toggle('has-overflow', hasOverflow);
        
        updateRowArrows(wrapper);
    });
}

window.addEventListener('resize', checkRowOverflow);

function setupCardListeners() {
    document.querySelectorAll('.movie-card').forEach(card => {
        if (card.dataset.listenersAdded) return;
        card.dataset.listenersAdded = 'true';
        
        card.addEventListener('mouseenter', () => startTrailerPreview(card));
        card.addEventListener('mouseleave', () => stopTrailerPreview(card));
    });
}

function updateSliderIndicators(indicatorId, count) {
    const container = $(indicatorId);
    if (!container) return;
    const numIndicators = Math.ceil(count / 4);
    if (numIndicators <= 1) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = Array.from({ length: numIndicators }, (_, i) => 
        `<div${i === 0 ? ' class="active"' : ''}></div>`
    ).join('');
}

function renderNetflixRow(title, movies, showRank = false, showProgress = false) {
    if (!movies.length) return '';
    return `<section class="netflix-row"><h2 class="netflix-row-title">${title}</h2><div class="netflix-row-content">${movies.map((m, i) => createNetflixCard(m, showRank ? i + 1 : null, showProgress)).join('')}</div></section>`;
}

function createNetflixCard(movie, rank, showProgress) {
    const posterUrl = movie.poster || `https://img.youtube.com/vi/${movie.trailerId}/maxresdefault.jpg`;
    const isInWatchlist = app.watchlist.includes(movie.id);
    
    // Progresso (do filme ou salvo)
    const progress = movie.progress || (showProgress ? getWatchProgress(movie.id) : 0);
    const progressHtml = progress > 0 ? `<div class="card-progress"><div class="card-progress-bar" style="width: ${progress}%"></div></div>` : '';
    
    // Badge TOP10
    const top10Html = movie.top10 ? `<div class="badge-top10"><span class="top">TOP</span><span class="number">10</span></div>` : '';
    
    // Score de relevância aleatório
    const matchScore = Math.floor(Math.random() * 20 + 80);
    
    // Badge de idade
    const isMature = movie.intensity >= 4;
    const ageText = isMature ? 'A16' : '14';
    const ageClass = isMature ? 'mature' : '';
    
    const isWatched = app.continueWatching?.some(c => c.movieId === movie.id && c.progress >= 90);
    
    return `
        <article class="movie-card${progress > 0 ? ' has-progress' : ''}" data-movie-id="${movie.id}">
            ${rank ? `<span class="card-rank">${rank}</span>` : ''}
            ${top10Html}
            <div class="card-xp-badge">+10 XP</div>
            <div class="card-poster">
                <img src="${posterUrl}" alt="${movie.title}" loading="lazy">
                <div class="card-trailer" data-trailer-id="${movie.trailerId}"></div>
                ${progressHtml}
                <div class="card-title-overlay">
                    <h3 class="card-title">${movie.title}</h3>
                </div>
                <div class="card-hover-actions">
                    <div class="hover-action-btn" title="Minha Lista">
                        <span class="hover-action-icon">${isInWatchlist ? '✓' : '+'}</span>
                    </div>
                    <div class="hover-action-btn play-btn" title="Assistir">
                        <span class="hover-action-icon">▶</span>
                    </div>
                    <div class="hover-action-btn" title="Avaliar">
                        <span class="hover-action-icon">⭐</span>
                    </div>
                </div>
            </div>
            <div class="card-hover">
                <div class="card-hover-content">
                    <h4 class="card-hover-title">${movie.title}</h4>
                    <div class="card-actions">
                        <div class="card-actions-left">
                            <button class="card-btn play" onclick="watchMovie(${movie.id}); event.stopPropagation();">▶</button>
                            <button class="card-btn" onclick="toggleWatchlist(${movie.id}, this); event.stopPropagation();">${isInWatchlist ? '✓' : '+'}</button>
                            <button class="card-btn" onclick="openQuickRate(${movie.id}); event.stopPropagation();">👍</button>
                        </div>
                        <div class="card-actions-right">
                            <button class="card-btn" onclick="openReviewModal(${movie.id}); event.stopPropagation();">ℹ</button>
                        </div>
                    </div>
                    <div class="card-info">
                        <span class="card-match">${matchScore}% relevante</span>
                        <span class="card-age ${ageClass}">${ageText}</span>
                        <span class="card-duration">${movie.duration}</span>
                        <span class="card-resolution">HD</span>
                    </div>
                    <div class="card-genres">
                        ${movie.genres.map(g => `<span>${g}</span>`).join('')}
                    </div>
                </div>
            </div>
        </article>`;
}

function getWatchProgress(movieId) {
    const item = app.continueWatching.find(c => c.movieId === movieId);
    return item ? item.progress : 0;
}

// Trailer Preview com Transform Origin Dinâmico
function startTrailerPreview(card) {
    const movieId = parseInt(card.dataset.movieId);
    const trailerContainer = card.querySelector('.card-trailer');
    const trailerId = trailerContainer?.dataset.trailerId;
    if (!trailerId || !trailerContainer) return;
    
    // Aplica transform-origin baseado na posição do card
    const rect = card.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    if (rect.left < 100) {
        card.classList.add('origin-left');
    } else if (rect.right > windowWidth - 100) {
        card.classList.add('origin-right');
    }
    
    const delay = 500;
    const timerId = setTimeout(() => {
        const img = card.querySelector('.card-poster img');
        trailerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerId}&modestbranding=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        trailerContainer.classList.add('active');
        if (img) img.classList.add('playing-video');
        activeTrailers.set(movieId, { muted: true });
    }, delay);
    trailerTimers.set(movieId, timerId);
}

function stopTrailerPreview(card) {
    const movieId = parseInt(card.dataset.movieId);
    if (trailerTimers.has(movieId)) { 
        clearTimeout(trailerTimers.get(movieId)); 
        trailerTimers.delete(movieId); 
    }
    const trailerContainer = card.querySelector('.card-trailer');
    const img = card.querySelector('.card-poster img');
    if (trailerContainer) {
        trailerContainer.innerHTML = '';
        trailerContainer.classList.remove('active');
    }
    if (img) img.classList.remove('playing-video');
    card.classList.remove('origin-left', 'origin-right');
    activeTrailers.delete(movieId);
}

function toggleTrailerSound(btn, event) {
    event.stopPropagation();
    const card = btn.closest('.netflix-card');
    const iframe = card.querySelector('.netflix-card-trailer iframe');
    const movieId = parseInt(card.dataset.movieId);
    if (!iframe || !activeTrailers.has(movieId)) return;
    const state = activeTrailers.get(movieId);
    state.muted = !state.muted;
    const src = iframe.src;
    iframe.src = state.muted ? src.replace('mute=0', 'mute=1') : src.replace('mute=1', 'mute=0');
    btn.textContent = state.muted ? '🔇' : '🔊';
}

// Watch Movie
function watchMovie(movieId) {
    const movie = app.movies.find(m => m.id === movieId);
    if (!movie) return;
    app.currentVideoMovieId = movieId;
    $('video-modal-title').textContent = movie.title;
    $('video-modal-year').textContent = `${movie.year} • ${movie.duration}`;
    $('video-modal-description').textContent = movie.description;
    $('video-player-container').innerHTML = `<iframe src="https://www.youtube.com/embed/${movie.trailerId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    $('video-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (app.currentUser) updateContinueWatching(movieId);
}

function closeVideoModal() {
    $('video-player-container').innerHTML = '';
    $('video-modal').classList.remove('active');
    document.body.style.overflow = '';
    app.currentVideoMovieId = null;
}

function updateContinueWatching(movieId) {
    if (!app.currentUser) return;
    const existing = app.continueWatching.findIndex(c => c.movieId === movieId);
    if (existing > -1) app.continueWatching.splice(existing, 1);
    app.continueWatching.unshift({ movieId, progress: Math.floor(Math.random() * 80) + 10, updatedAt: new Date().toISOString() });
    app.continueWatching = app.continueWatching.slice(0, 10);
    setLS(userKey('continueWatching'), app.continueWatching);
}

// Watchlist
function toggleWatchlist(movieId, btn) {
    if (!app.currentUser) return showPage('login');
    const index = app.watchlist.indexOf(movieId);
    if (index > -1) { app.watchlist.splice(index, 1); if (btn) btn.textContent = '+'; showToast('Removido da lista', 'info'); }
    else { app.watchlist.push(movieId); if (btn) btn.textContent = '✓'; showToast('Adicionado à lista!', 'success'); }
    saveWatchlist(app.watchlist);
}

function toggleWatchlistDiscover(movieId, btn) {
    toggleWatchlist(movieId, null);
    if (btn) btn.textContent = app.watchlist.includes(movieId) ? '✓ Na Lista' : '+ Lista';
}

function markAsWatched(movieId, btn) {
    if (!app.currentUser) return showPage('login');
    const existing = app.continueWatching.find(c => c.movieId === movieId);
    if (existing) {
        existing.progress = 100;
    } else {
        app.continueWatching.push({ movieId, progress: 100, lastWatched: new Date().toISOString() });
    }
    setLS(userKey('continueWatching'), app.continueWatching);
    if (btn) {
        const icon = btn.querySelector('.hover-action-icon');
        if (icon) icon.textContent = '👁️';
    }
    showToast('Marcado como assistido!', 'success');
    addXP(5);
}

function recommendMovie(movieId) {
    if (!app.currentUser) return showPage('login');
    const movie = app.movies.find(m => m.id === movieId);
    if (!movie) return;
    showToast(`Você indicou "${movie.title}"!`, 'success');
    addXP(5);
}

// Rating
function openQuickRate(movieId) {
    const movie = app.movies.find(m => m.id === movieId);
    if (!movie) return;
    app.quickRateMovieId = movieId;
    app.selectedMovieRating = 0;
    $('quick-rate-title').textContent = movie.title;
    $('quick-rate-year').textContent = movie.year;
    renderStars('quick-rate-stars', 0, selectQuickRating);
    $('quick-rate-overlay').classList.add('active');
    $('quick-rate-modal').classList.add('active');
}

function closeQuickRate() {
    $('quick-rate-overlay').classList.remove('active');
    $('quick-rate-modal').classList.remove('active');
    app.quickRateMovieId = null;
}

function selectQuickRating(rating) { app.selectedMovieRating = rating; renderStars('quick-rate-stars', rating, selectQuickRating); }

function saveQuickRate() {
    if (!app.currentUser) return showPage('login');
    if (!app.selectedMovieRating) return showToast('Selecione uma nota!', 'warning');
    const reviews = getLS('reviews');
    const existing = reviews.findIndex(r => r.userId === app.currentUser.id && r.movieId === app.quickRateMovieId);
    const review = { userId: app.currentUser.id, movieId: app.quickRateMovieId, rating: app.selectedMovieRating, comment: '', date: new Date().toISOString() };
    if (existing > -1) reviews[existing] = review; else reviews.push(review);
    setLS('reviews', reviews);
    closeQuickRate();
    showToast('Avaliação salva!', 'success');
    addXP(10);
    checkBadges();
    updateWeeklyChallengeDisplay();
}

function openReviewModal(movieId) {
    const movie = app.movies.find(m => m.id === movieId);
    if (!movie) return;
    app.selectedMovieId = movieId;
    app.selectedMovieRating = 0;
    $('modal-movie-title').textContent = movie.title;
    $('modal-movie-year').textContent = movie.year;
    $('modal-movie-description').textContent = movie.description;
    $('modal-comment').value = '';
    renderStars('modal-rating', 0, selectModalRating);
    $('review-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    $('review-modal').classList.remove('active');
    document.body.style.overflow = '';
    app.selectedMovieId = null;
}

function selectModalRating(rating) { app.selectedMovieRating = rating; renderStars('modal-rating', rating, selectModalRating); }

function saveReview() {
    if (!app.currentUser) return showPage('login');
    if (!app.selectedMovieRating) return showToast('Selecione uma nota!', 'warning');
    const reviews = getLS('reviews');
    const existing = reviews.findIndex(r => r.userId === app.currentUser.id && r.movieId === app.selectedMovieId);
    const review = { userId: app.currentUser.id, movieId: app.selectedMovieId, rating: app.selectedMovieRating, comment: $('modal-comment').value, date: new Date().toISOString() };
    if (existing > -1) reviews[existing] = review; else reviews.push(review);
    setLS('reviews', reviews);
    closeModal();
    showToast('Avaliação salva!', 'success');
    addXP(15);
    checkBadges();
    updateWeeklyChallengeDisplay();
}

function renderStars(containerId, rating, onClick) {
    const container = $(containerId);
    container.innerHTML = [1,2,3,4,5].map(i => `<button class="star ${i <= rating ? 'active' : ''}" onclick="${onClick.name}(${i})">★</button>`).join('');
}

// Gamification
function addXP(amount) {
    if (!app.currentUser) return;
    const key = `xp_${app.currentUser.id}`;
    const current = parseInt(localStorage.getItem(key) || '0');
    const oldLevel = getUserLevel();
    
    localStorage.setItem(key, current + amount);
    
    const newLevel = getUserLevel();
    if (newLevel.level > oldLevel.level) {
        showAchievementNotification(newLevel.icon, `Nível ${newLevel.level}!`, `Você agora é: ${newLevel.name}`);
    }
    
    updateGamificationDisplay();
}

function updateGamificationDisplay() {
    if (!app.currentUser) return;
    
    const xp = parseInt(localStorage.getItem(`xp_${app.currentUser.id}`) || '0');
    const level = getUserLevel();
    const progress = getLevelProgress();
    
    // Atualiza barra de progresso do nível se existir
    if ($('level-progress-bar')) {
        $('level-progress-bar').style.width = `${progress}%`;
    }
    if ($('level-info')) {
        const next = getNextLevel();
        $('level-info').textContent = level === next ? 'Nível Máximo!' : `${level.name} → ${next.name}`;
    }
}

function checkBadges() {
    const reviews = getUserReviews();
    const genres = new Set();
    reviews.forEach(r => { const m = app.movies.find(x => x.id === r.movieId); if (m) m.genres.forEach(g => genres.add(g)); });
    const stats = { totalReviews: reviews.length, avgRating: reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0, favoriteGenres: [...genres] };
    Object.entries(BADGES).forEach(([id, badge]) => { if (badge.condition(stats)) {} });
}

function initializeDailyMovie() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailyMovieDate');
    if (stored !== today) {
        const movie = app.movies[Math.floor(Math.random() * app.movies.length)];
        setLS('dailyMovie', movie);
        localStorage.setItem('dailyMovieDate', today);
        // Bonus diário: +5 XP por voltar todo dia
        if (app.currentUser) {
            const lastVisit = localStorage.getItem(`lastVisit_${app.currentUser.id}`);
            if (lastVisit && lastVisit !== today) {
                addXP(5);
            }
            localStorage.setItem(`lastVisit_${app.currentUser.id}`, today);
        }
    }
}

// Desafios Semanais
const WEEKLY_CHALLENGES = [
    { id: 'watch_3_genres', title: 'Explorador de Gêneros', desc: 'Avalie filmes de 3 gêneros diferentes', target: 3, xp: 50, check: (r, m) => new Set(r.flatMap(x => m.find(y => y.id === x.movieId)?.genres || [])).size },
    { id: 'rate_5_movies', title: 'Maratonista', desc: 'Avalie 5 filmes esta semana', target: 5, xp: 75, check: r => r.length },
    { id: 'high_ratings', title: 'Amante do Cinema', desc: 'Dê 3 avaliações de 4+ estrelas', target: 3, xp: 40, check: r => r.filter(x => x.rating >= 4).length },
    { id: 'write_reviews', title: 'Crítico', desc: 'Escreva 2 resenhas com comentários', target: 2, xp: 60, check: r => r.filter(x => x.comment && x.comment.length > 10).length },
    { id: 'international', title: 'Cidadão do Mundo', desc: 'Avalie 2 filmes internacionais', target: 2, xp: 45, check: (r, m) => r.filter(x => m.find(y => y.id === x.movieId)?.category === 'Internacional').length }
];

function initializeWeeklyChallenge() {
    const weekStart = getWeekStart();
    const storedWeek = localStorage.getItem('challengeWeek');
    
    if (storedWeek !== weekStart) {
        // Nova semana, novo desafio
        const challenge = WEEKLY_CHALLENGES[Math.floor(Math.random() * WEEKLY_CHALLENGES.length)];
        setLS('weeklyChallenge', challenge);
        localStorage.setItem('challengeWeek', weekStart);
        localStorage.setItem('challengeStartReviews', JSON.stringify(getLS('reviews')));
    }
    
    updateWeeklyChallengeDisplay();
}

function getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).toDateString();
}

function updateWeeklyChallengeDisplay() {
    const challenge = getLS('weeklyChallenge', 'null');
    const container = $('weekly-challenge-display');
    if (!container || !challenge) return;
    
    const startReviews = getLS('challengeStartReviews');
    const currentReviews = getLS('reviews');
    const weekReviews = currentReviews.filter(r => !startReviews.find(s => s.movieId === r.movieId && s.userId === r.userId));
    
    const progress = challenge.check(weekReviews, app.movies);
    const percentage = Math.min((progress / challenge.target) * 100, 100);
    const completed = progress >= challenge.target;
    
    container.innerHTML = `
        <div class="challenge-card ${completed ? 'completed' : ''}">
            <div class="challenge-header">
                <span class="challenge-icon">${completed ? '✅' : '🎯'}</span>
                <div class="challenge-info">
                    <h3>${challenge.title}</h3>
                    <p>${challenge.desc}</p>
                </div>
                <span class="challenge-xp">+${challenge.xp} XP</span>
            </div>
            <div class="challenge-progress">
                <div class="challenge-progress-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="challenge-status">${progress}/${challenge.target} ${completed ? '- Completo!' : ''}</div>
            ${completed && !localStorage.getItem('challengeClaimed_' + getWeekStart()) ? 
                `<button class="btn btn-primary btn-sm" onclick="claimChallengeReward()">Resgatar Recompensa</button>` : ''}
        </div>
    `;
}

function claimChallengeReward() {
    const challenge = getLS('weeklyChallenge', 'null');
    if (!challenge) return;
    
    addXP(challenge.xp);
    localStorage.setItem('challengeClaimed_' + getWeekStart(), 'true');
    showToast(`🎉 +${challenge.xp} XP! Desafio completo!`, 'success');
    showAchievementNotification('🏆', 'Desafio Semanal', `Você completou: ${challenge.title}`);
    updateWeeklyChallengeDisplay();
}

// Notificação de Conquista
function showAchievementNotification(icon, title, desc) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">${icon}</div>
        <div class="achievement-info">
            <strong>${title}</strong>
            <span>${desc}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Sistema de Níveis
const LEVELS = [
    { level: 1, name: 'Novato', minXP: 0, icon: '🌱' },
    { level: 2, name: 'Iniciante', minXP: 100, icon: '🎬' },
    { level: 3, name: 'Cinéfilo', minXP: 300, icon: '🎭' },
    { level: 4, name: 'Crítico', minXP: 600, icon: '⭐' },
    { level: 5, name: 'Especialista', minXP: 1000, icon: '🏆' },
    { level: 6, name: 'Mestre', minXP: 1500, icon: '👑' },
    { level: 7, name: 'Lenda', minXP: 2500, icon: '🌟' }
];

function getUserLevel() {
    if (!app.currentUser) return LEVELS[0];
    const xp = parseInt(localStorage.getItem(`xp_${app.currentUser.id}`) || '0');
    return [...LEVELS].reverse().find(l => xp >= l.minXP) || LEVELS[0];
}

function getNextLevel() {
    const current = getUserLevel();
    return LEVELS.find(l => l.minXP > current.minXP) || current;
}

function getLevelProgress() {
    if (!app.currentUser) return 0;
    const xp = parseInt(localStorage.getItem(`xp_${app.currentUser.id}`) || '0');
    const current = getUserLevel();
    const next = getNextLevel();
    if (current === next) return 100;
    return ((xp - current.minXP) / (next.minXP - current.minXP)) * 100;
}

// Discover
function selectMood(mood) {
    $$('.mood-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-mood="${mood}"]`).classList.add('active');
    app.currentFilters.style = mood === 'relaxed' ? 'contemplativo' : mood === 'adventurous' ? 'intenso' : mood === 'romantic' ? 'emocional' : mood === 'thoughtful' ? 'autoral' : mood === 'curious' ? 'hipnotico' : mood === 'nostalgic' ? 'internacional' : 'all';
    $('mood-label-display').textContent = MOOD_LABELS[mood] || mood;
}

function toggleChip(btn, type, value) {
    if (type === 'decade') {
        $$('#decade-chips .filter-chip').forEach(c => c.classList.remove('active'));
        app.currentFilters.decade = app.currentFilters.decade === value ? null : value;
        if (app.currentFilters.decade) btn.classList.add('active');
        return;
    }
    btn.classList.toggle('active');
    if (type === 'genre') {
        const i = app.currentFilters.genre.indexOf(value);
        if (i > -1) app.currentFilters.genre.splice(i, 1); else app.currentFilters.genre.push(value);
    } else if (type === 'style') {
        if (!app.currentFilters.styleList) app.currentFilters.styleList = [];
        const i = app.currentFilters.styleList.indexOf(value);
        if (i > -1) app.currentFilters.styleList.splice(i, 1); else app.currentFilters.styleList.push(value);
        app.currentFilters.style = app.currentFilters.styleList[0] || 'all';
    }
}

function clearDiscoverFilters() {
    app.currentFilters = { mood: [], genre: [], style: 'all', styleList: [], decade: null };
    $$('.mood-card, .filter-chip').forEach(c => c.classList.remove('active'));
    $('mood-label-display').textContent = 'Nenhum';
    $('recommendations-container').classList.add('hidden');
    $('no-results').classList.remove('hidden');
}

function filterMovies() {
    return app.movies.filter(m => {
        if (app.currentFilters.style !== 'all' && m.style !== app.currentFilters.style) return false;
        if (app.currentFilters.genre.length && !app.currentFilters.genre.some(g => m.genres.includes(g))) return false;
        if (app.currentFilters.decade) {
            const start = parseInt(app.currentFilters.decade), end = start + 9;
            if (m.year < start || m.year > end) return false;
        }
        return true;
    });
}

function getRecommendations() {
    const filtered = filterMovies();
    if (!filtered.length) return showToast('Nenhum filme encontrado!', 'warning');
    $('movies-grid').innerHTML = filtered.map(m => createDiscoverCard(m)).join('');
    $('results-count').textContent = `${filtered.length} filme${filtered.length > 1 ? 's' : ''}`;
    $('no-results').classList.add('hidden');
    $('recommendations-container').classList.remove('hidden');
}

function getRandomPick() {
    const filtered = filterMovies();
    if (!filtered.length) return showToast('Nenhum filme encontrado!', 'warning');
    const movie = filtered[Math.floor(Math.random() * filtered.length)];
    $('movies-grid').innerHTML = createDiscoverCard(movie);
    $('results-count').textContent = '1 filme';
    $('no-results').classList.add('hidden');
    $('recommendations-container').classList.remove('hidden');
}

function createDiscoverCard(movie) {
    const posterUrl = movie.poster || `https://img.youtube.com/vi/${movie.trailerId}/hqdefault.jpg`;
    const isInWatchlist = getWatchlist().includes(movie.id);
    return `
        <article class="discover-card">
            <div class="discover-card-banner">
                <img src="${posterUrl}" alt="${movie.title}" loading="lazy" onerror="this.style.display='none';">
                <div class="discover-card-overlay"><button class="discover-card-play" onclick="watchMovie(${movie.id})" aria-label="Assistir ${movie.title}">▶</button></div>
                <span class="discover-card-rating">⭐ ${movie.platformRating}</span>
            </div>
            <div class="discover-card-content">
                <h3 class="discover-card-title">${movie.title}</h3>
                <p class="discover-card-meta">${movie.year} • ${movie.genres.slice(0, 2).join(', ')}</p>
                <p class="discover-card-desc">${movie.description.substring(0, 100)}...</p>
                <div class="discover-card-actions">
                    <button class="btn btn-primary btn-sm" onclick="openReviewModal(${movie.id})">⭐ Avaliar</button>
                    <button class="btn btn-outline btn-sm" onclick="toggleWatchlistDiscover(${movie.id}, this)">${isInWatchlist ? '✓ Na Lista' : '+ Lista'}</button>
                </div>
            </div>
        </article>`;
}

// Profile
function loadUserProfile() {
    if (!app.currentUser) return;
    const reviews = getUserReviews();
    const watchlist = getWatchlist();
    const xp = parseInt(localStorage.getItem(`xp_${app.currentUser.id}`) || '0');
    const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
    
    const profiles = getLS('profiles', '{}');
    const profile = profiles[app.currentUser.id] || {};
    
    // Nome e bio
    const nameEl = $('profile-name');
    if (nameEl) nameEl.textContent = profile.name || app.currentUser.name;
    const bioEl = $('profile-bio');
    if (bioEl) bioEl.textContent = profile.bio || 'Cinéfilo apaixonado';
    
    // Avatar (usa imagem do perfil atual)
    const avatarImg = $('profile-avatar-img');
    if (avatarImg && app.currentProfile) {
        avatarImg.src = app.currentProfile.avatar;
        avatarImg.alt = app.currentProfile.name;
    }
    
    // Mini stats
    const miniReviews = $('mini-reviews');
    if (miniReviews) miniReviews.textContent = reviews.length;
    const miniWatchlist = $('mini-watchlist');
    if (miniWatchlist) miniWatchlist.textContent = watchlist.length;
    const miniXp = $('mini-xp');
    if (miniXp) miniXp.textContent = xp;
    
    // Stats completas
    const totalReviews = $('total-reviews');
    if (totalReviews) totalReviews.textContent = reviews.length;
    const avgRatingEl = $('avg-rating');
    if (avgRatingEl) avgRatingEl.textContent = avgRating;
    const userXp = $('user-xp');
    if (userXp) userXp.textContent = xp;
    
    // Barras de progresso
    const reviewsBar = $('reviews-bar');
    if (reviewsBar) reviewsBar.style.width = Math.min(reviews.length * 5, 100) + '%';
    const ratingBar = $('rating-bar');
    if (ratingBar) ratingBar.style.width = (parseFloat(avgRating) / 5 * 100) + '%';
    const xpBar = $('xp-bar');
    if (xpBar) xpBar.style.width = Math.min(xp / 10, 100) + '%';
    
    // Seção de Nível
    const level = getUserLevel();
    const nextLevel = getNextLevel();
    const levelProgress = getLevelProgress();
    
    if ($('profile-level-icon')) $('profile-level-icon').textContent = level.icon;
    if ($('profile-level-name')) $('profile-level-name').textContent = `Nível ${level.level}: ${level.name}`;
    if ($('level-info')) {
        $('level-info').textContent = level === nextLevel 
            ? 'Nível Máximo Alcançado!' 
            : `${xp} XP / ${nextLevel.minXP} XP para ${nextLevel.name}`;
    }
    if ($('level-progress-bar')) $('level-progress-bar').style.width = `${levelProgress}%`;
    
    updateCinephileIdentity(reviews);
    switchProfileTab('reviews');
}

function updateCinephileIdentity(reviews) {
    if (reviews.length < 3) {
        $('cinephile-identity').textContent = 'Avalie mais filmes para descobrir sua identidade...';
        $('identity-tags').innerHTML = '';
        return;
    }
    const genreCount = {};
    reviews.forEach(r => { const m = app.movies.find(x => x.id === r.movieId); if (m) m.genres.forEach(g => genreCount[g] = (genreCount[g] || 0) + 1); });
    const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
    const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    const identity = avgRating >= 4 ? 'Otimista Cinematográfico' : avgRating >= 3 ? 'Crítico Equilibrado' : 'Crítico Exigente';
    $('cinephile-identity').textContent = identity;
    $('identity-tags').innerHTML = topGenres.map(g => `<span class="identity-tag">${g}</span>`).join('');
}

function switchProfileTab(tabName) {
    $$('.profile-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    $$('.profile-tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tabName}`));
    if (tabName === 'reviews') renderProfileReviews();
    if (tabName === 'watchlist') renderProfileWatchlist();
    if (tabName === 'badges') renderProfileBadges();
    if (tabName === 'genres') renderProfileGenres();
}

function renderProfileReviews() {
    const reviews = getUserReviews();
    const container = $('user-reviews');
    if (!reviews.length) { container.innerHTML = '<p class="empty-state">Você ainda não avaliou nenhum filme.</p>'; return; }
    container.innerHTML = reviews.map(r => {
        const m = app.movies.find(x => x.id === r.movieId);
        if (!m) return '';
        const posterUrl = m.poster || `https://img.youtube.com/vi/${m.trailerId}/hqdefault.jpg`;
        return `<div class="review-card"><div class="review-card-poster" style="background-image: url('${posterUrl}')"></div><div class="review-card-info"><h4>${m.title}</h4><div class="review-card-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>${r.comment ? `<p class="review-card-comment">"${r.comment}"</p>` : ''}</div></div>`;
    }).join('');
}

function renderProfileWatchlist() {
    const watchlist = getWatchlist();
    const container = $('user-watchlist');
    if (!watchlist.length) { container.innerHTML = '<p class="empty-state">Sua lista está vazia.</p>'; return; }
    container.innerHTML = watchlist.map(id => {
        const m = app.movies.find(x => x.id === id);
        if (!m) return '';
        const posterUrl = m.poster || `https://img.youtube.com/vi/${m.trailerId}/hqdefault.jpg`;
        return `<div class="watchlist-item" onclick="watchMovie(${m.id})"><div class="watchlist-poster" style="background-image: url('${posterUrl}')"></div><div class="watchlist-info"><h4>${m.title}</h4><p>${m.year} • ⭐ ${m.platformRating}</p></div></div>`;
    }).join('');
}

function countGenre(reviews, movies, genre) { return reviews.filter(r => { const m = movies.find(x => x.id === r.movieId); return m && m.genres.includes(genre); }).length; }

function renderProfileBadges() {
    const reviews = getUserReviews();
    const container = $('profile-badges');
    container.innerHTML = ALL_BADGES.map(b => {
        const unlocked = b.check(reviews, app.movies);
        return `<div class="badge-item-large ${unlocked ? 'unlocked' : 'locked'}"><span class="badge-icon-large">${b.icon}</span><span class="badge-name">${b.name}</span><span class="badge-desc">${b.desc}</span></div>`;
    }).join('');
}

function renderProfileGenres() {
    const reviews = getUserReviews();
    const genreCount = {};
    reviews.forEach(r => { const m = app.movies.find(x => x.id === r.movieId); if (m) m.genres.forEach(g => genreCount[g] = (genreCount[g] || 0) + 1); });
    const sorted = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
    const max = sorted.length ? sorted[0][1] : 1;
    const container = $('genres-chart');
    if (!sorted.length) { container.innerHTML = '<p class="empty-state">Avalie filmes para ver seus gêneros favoritos.</p>'; return; }
    container.innerHTML = sorted.map(([g, c]) => `<div class="genre-bar-item"><span class="genre-bar-label">${g}</span><div class="genre-bar-track"><div class="genre-bar-fill" style="width: ${c / max * 100}%"></div></div><span class="genre-bar-count">${c}</span></div>`).join('');
}

// Avatar
function getUserAvatarEmoji() {
    if (!app.currentUser) return '👤';
    const avatars = getLS('avatars', '{}');
    return avatars[app.currentUser.id]?.emoji || '🎬';
}

function openAvatarModal() {
    app.selectedAvatar = getUserAvatarEmoji();
    const container = $('avatar-options');
    container.innerHTML = AVATAR_OPTIONS.map(e => `<button class="avatar-option ${e === app.selectedAvatar ? 'selected' : ''}" onclick="selectAvatar('${e}')">${e}</button>`).join('');
    $('avatar-modal').classList.add('active');
}

function closeAvatarModal() { $('avatar-modal').classList.remove('active'); }
function selectAvatar(emoji) { app.selectedAvatar = emoji; $$('.avatar-option').forEach(o => o.classList.toggle('selected', o.textContent === emoji)); }

function saveAvatar() {
    if (!app.currentUser || !app.selectedAvatar) return;
    const avatars = getLS('avatars', '{}');
    avatars[app.currentUser.id] = { emoji: app.selectedAvatar };
    setLS('avatars', avatars);
    const avatarImg = $('profile-avatar-img');
    if (avatarImg && app.currentProfile) {
        avatarImg.src = app.currentProfile.avatar;
    }
    closeAvatarModal();
    showToast('Avatar atualizado!', 'success');
}

function openEditProfileModal() {
    const profiles = getLS('profiles', '{}');
    const profile = profiles[app.currentUser?.id] || {};
    $('edit-profile-name').value = profile.name || app.currentUser?.name || '';
    $('edit-profile-bio').value = profile.bio || '';
    $('edit-profile-modal').classList.add('active');
}

function closeEditProfileModal() { $('edit-profile-modal').classList.remove('active'); }

function saveProfile() {
    if (!app.currentUser) return;
    const profiles = getLS('profiles', '{}');
    profiles[app.currentUser.id] = { name: $('edit-profile-name').value, bio: $('edit-profile-bio').value };
    setLS('profiles', profiles);
    loadUserProfile();
    closeEditProfileModal();
    showToast('Perfil atualizado!', 'success');
}

function getTimeAgo(date) {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

// Reviews Hub
const DEMO_VIDEO_REVIEWS = [
    { 
        id: 'vr1', 
        title: 'Por que Forrest Gump é um clássico atemporal', 
        movieId: 1, 
        authorId: 'demo', 
        authorName: 'CineCrítico', 
        authorAvatar: 'https://ui-avatars.com/api/?name=Cine&background=e50914&color=fff', 
        youtubeId: 'bLvqoHBptjg', 
        duration: '12:45', 
        views: 4520, 
        likes: 312, 
        rating: 5, 
        tags: ['Drama', 'Tom Hanks', 'Análise'], 
        description: 'Uma análise sobre como Forrest Gump captura décadas de história americana através dos olhos de um homem extraordinário.',
        comments: [
            { user: 'Maria', text: 'Esse filme sempre me emociona!', time: '2h' },
            { user: 'João', text: 'Tom Hanks merecia todos os Oscars', time: '5h' }
        ], 
        createdAt: '2024-01-20T10:00:00Z', 
        badge: 'Em Alta' 
    },
    { 
        id: 'vr2', 
        title: 'O Poderoso Chefão - A obra-prima do cinema', 
        movieId: 2, 
        authorId: 'user2', 
        authorName: 'FilmeFan', 
        authorAvatar: 'https://ui-avatars.com/api/?name=Filme&background=6366f1&color=fff', 
        youtubeId: 'sY1S34973zA', 
        duration: '18:32', 
        views: 8750, 
        likes: 623, 
        rating: 5, 
        tags: ['Crime', 'Máfia', 'Clássico'], 
        description: 'Por que O Poderoso Chefão continua sendo referência no cinema mundial após 50 anos.',
        comments: [
            { user: 'Pedro', text: 'Melhor filme de todos os tempos!', time: '1d' },
            { user: 'Ana', text: 'Brando e Pacino impecáveis', time: '2d' },
            { user: 'Carlos', text: 'A cena do batismo é genial', time: '3d' }
        ], 
        createdAt: '2024-01-18T14:30:00Z',
        badge: 'Em Alta'
    },
    { 
        id: 'vr3', 
        title: 'Interestelar - Ciência e emoção', 
        movieId: 11, 
        authorId: 'amanda', 
        authorName: 'Amanda', 
        authorAvatar: 'assets/amanda.png', 
        youtubeId: 'zSWdZVtXT7E', 
        duration: '15:20', 
        views: 6230, 
        likes: 489, 
        rating: 5, 
        tags: ['Ficção Científica', 'Nolan', 'Emocionante'], 
        description: 'Como Christopher Nolan uniu física quântica com uma história de amor entre pai e filha.',
        comments: [
            { user: 'Lucas', text: 'A cena das mensagens me destruiu', time: '12h' },
            { user: 'Fernanda', text: 'Hans Zimmer é um gênio', time: '1d' }
        ], 
        createdAt: '2024-01-22T09:00:00Z', 
        badge: 'Novo' 
    },
    { 
        id: 'vr4', 
        title: 'Matrix - A filosofia por trás do código', 
        movieId: 8, 
        authorId: 'angelo', 
        authorName: 'Ângelo', 
        authorAvatar: 'assets/angelo.png', 
        youtubeId: 'vKQi3bBA1y8', 
        duration: '14:15', 
        views: 5120, 
        likes: 402, 
        rating: 5, 
        tags: ['Ação', 'Filosofia', 'Revolucionário'], 
        description: 'As referências filosóficas escondidas em Matrix: de Platão a Baudrillard.',
        comments: [
            { user: 'Roberto', text: 'Nunca tinha pensado nisso!', time: '3h' }
        ], 
        createdAt: '2024-01-19T16:00:00Z'
    },
    { 
        id: 'vr5', 
        title: 'Clube da Luta - O que você não percebeu', 
        movieId: 5, 
        authorId: 'user3', 
        authorName: 'CultMaster', 
        authorAvatar: 'https://ui-avatars.com/api/?name=Cult&background=10b981&color=fff', 
        youtubeId: 'qtRKdVHc-cE', 
        duration: '16:48', 
        views: 7890, 
        likes: 567, 
        rating: 5, 
        tags: ['Cult', 'Twist', 'Análise'], 
        description: 'Detalhes escondidos e simbolismos que passam despercebidos na primeira vez.',
        comments: [
            { user: 'Thiago', text: 'Precisei reassistir 3 vezes!', time: '6h' },
            { user: 'Julia', text: 'O final ainda me impressiona', time: '1d' },
            { user: 'Diego', text: 'Edward Norton perfeito', time: '2d' }
        ], 
        createdAt: '2024-01-17T11:00:00Z',
        badge: 'Em Alta'
    },
    { 
        id: 'vr6', 
        title: 'Batman: O Cavaleiro das Trevas - Análise do Coringa', 
        movieId: 7, 
        authorId: 'user4', 
        authorName: 'HeroAnalyst', 
        authorAvatar: 'https://ui-avatars.com/api/?name=Hero&background=8b5cf6&color=fff', 
        youtubeId: 'EXeTwQWrcwY', 
        duration: '20:15', 
        views: 12400, 
        likes: 892, 
        rating: 5, 
        tags: ['Ação', 'Vilão', 'Heath Ledger'], 
        description: 'Por que a performance de Heath Ledger como Coringa é considerada a melhor interpretação de vilão da história.',
        comments: [
            { user: 'Marina', text: 'Sinto falta do Heath', time: '4h' },
            { user: 'Bruno', text: 'Performance lendária', time: '8h' },
            { user: 'Carla', text: 'Melhor vilão ever', time: '1d' },
            { user: 'Felipe', text: 'Arrepiante do início ao fim', time: '2d' }
        ], 
        createdAt: '2024-01-15T20:00:00Z',
        badge: 'Em Alta'
    },
    { 
        id: 'vr7', 
        title: 'Duna: Parte 2 - Visual cinematográfico', 
        movieId: 13, 
        authorId: 'user5', 
        authorName: 'VisualCinema', 
        authorAvatar: 'https://ui-avatars.com/api/?name=Visual&background=f59e0b&color=fff', 
        youtubeId: 'Way9Dexny3w', 
        duration: '13:42', 
        views: 5670, 
        likes: 423, 
        rating: 5, 
        tags: ['Épico', 'Villeneuve', 'Cinematografia'], 
        description: 'A evolução visual de Denis Villeneuve e como Duna redefine blockbusters.',
        comments: [
            { user: 'Renata', text: 'Assisti 3x no IMAX', time: '2d' }
        ], 
        createdAt: '2024-01-23T15:00:00Z',
        badge: 'Novo'
    },
    { 
        id: 'vr8', 
        title: 'A Viagem de Chihiro - A magia de Miyazaki', 
        movieId: 23, 
        authorId: 'user6', 
        authorName: 'AnimeArt', 
        authorAvatar: 'https://ui-avatars.com/api/?name=Anime&background=ec4899&color=fff', 
        youtubeId: 'ByXuk9QqQkk', 
        duration: '11:28', 
        views: 4230, 
        likes: 356, 
        rating: 5, 
        tags: ['Animação', 'Ghibli', 'Arte'], 
        description: 'Os simbolismos e a crítica social escondidos na obra-prima de Hayao Miyazaki.',
        comments: [
            { user: 'Beatriz', text: 'Meu filme favorito desde criança', time: '5h' },
            { user: 'Marcos', text: 'Ghibli nunca decepciona', time: '1d' }
        ], 
        createdAt: '2024-01-21T12:00:00Z'
    },
    { 
        id: 'vr9', 
        title: 'Parasita - O filme que conquistou o Oscar', 
        movieId: 27, 
        authorId: 'user7', 
        authorName: 'WorldCinema', 
        authorAvatar: 'https://ui-avatars.com/api/?name=World&background=06b6d4&color=fff', 
        youtubeId: '5xH0HfJHsaY', 
        duration: '17:55', 
        views: 9120, 
        likes: 701, 
        rating: 5, 
        tags: ['Drama', 'Coreia', 'Oscar'], 
        description: 'Como Bong Joon-ho criou uma metáfora perfeita sobre desigualdade social.',
        comments: [
            { user: 'Camila', text: 'Mereceu todos os prêmios', time: '3d' },
            { user: 'Rafael', text: 'A reviravolta é genial', time: '4d' },
            { user: 'Isabela', text: 'Cinema coreano é incrível', time: '5d' }
        ], 
        createdAt: '2024-01-14T18:00:00Z',
        badge: 'Em Alta'
    },
    { 
        id: 'vr10', 
        title: 'O Senhor dos Anéis - Uma jornada épica', 
        movieId: 15, 
        authorId: 'user8', 
        authorName: 'FantasyLord', 
        authorAvatar: 'https://ui-avatars.com/api/?name=Fantasy&background=84cc16&color=fff', 
        youtubeId: 'r5X-hFf6Bwo', 
        duration: '22:10', 
        views: 11500, 
        likes: 845, 
        rating: 5, 
        tags: ['Fantasia', 'Tolkien', 'Épico'], 
        description: 'A maior adaptação literária do cinema e o legado de Peter Jackson.',
        comments: [
            { user: 'Diego', text: 'Trilogia perfeita', time: '1d' },
            { user: 'Larissa', text: 'Assisto todo ano', time: '2d' }
        ], 
        createdAt: '2024-01-16T14:00:00Z'
    }
];

function getVideoReviews() { const stored = getLS('videoReviews'); return stored.length ? stored : DEMO_VIDEO_REVIEWS; }
function saveVideoReview(review) { const reviews = getVideoReviews(); reviews.unshift(review); setLS('videoReviews', reviews); }

function switchFeedTab(tab) {
    const feedTab = $('feed-tab-feed');
    const videosTab = $('feed-tab-videos');
    const tabs = $$('.feed-mobile-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'feed') {
        feedTab?.classList.add('active');
        videosTab?.classList.remove('active');
        tabs[0]?.classList.add('active');
    } else {
        feedTab?.classList.remove('active');
        videosTab?.classList.add('active');
        tabs[1]?.classList.add('active');
    }
}

function renderFeed() {
    renderFeedPosts();
    const reviews = getVideoReviews();
    renderAllReviews(reviews);
    updateReviewsCount(reviews.length);
    
    // Atualiza avatar na caixa de criar post
    const postAvatar = $('post-avatar');
    if (postAvatar && app.currentProfile) {
        postAvatar.innerHTML = `<img src="${app.currentProfile.avatar}" alt="${app.currentProfile.name}">`;
    }
}

let postTaggedMovie = null;
let postTaggedUser = null;

function openTagMovie() {
    const movieList = app.movies.slice(0, 10).map(m => 
        `<div class="tag-option" onclick="selectTagMovie(${m.id})">${m.title}</div>`
    ).join('');
    
    const modal = document.createElement('div');
    modal.className = 'tag-modal';
    modal.id = 'tag-movie-modal';
    modal.innerHTML = `
        <div class="tag-modal-content">
            <h3>Marcar Filme</h3>
            <input type="text" class="tag-search" placeholder="Buscar filme..." oninput="filterTagMovies(this.value)">
            <div class="tag-options" id="tag-movie-options">${movieList}</div>
            <button class="btn btn-secondary" onclick="closeTagModal()">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function filterTagMovies(query) {
    const container = $('tag-movie-options');
    if (!container) return;
    const filtered = app.movies.filter(m => m.title.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
    container.innerHTML = filtered.map(m => 
        `<div class="tag-option" onclick="selectTagMovie(${m.id})">${m.title}</div>`
    ).join('');
}

function selectTagMovie(movieId) {
    const movie = app.movies.find(m => m.id === movieId);
    if (!movie) return;
    postTaggedMovie = movie;
    updatePostTags();
    closeTagModal();
}

function openTagUser() {
    const users = ['Lucas Cinéfilo', 'Marina Films', 'Pedro Cult', 'Ana Reviewer', 'João Cinema'];
    const userList = users.map(u => 
        `<div class="tag-option" onclick="selectTagUser('${u}')">@${u}</div>`
    ).join('');
    
    const modal = document.createElement('div');
    modal.className = 'tag-modal';
    modal.id = 'tag-user-modal';
    modal.innerHTML = `
        <div class="tag-modal-content">
            <h3>Marcar Usuário</h3>
            <div class="tag-options">${userList}</div>
            <button class="btn btn-secondary" onclick="closeTagModal()">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectTagUser(userName) {
    postTaggedUser = userName;
    updatePostTags();
    closeTagModal();
}

function openPhotoUpload() {
    showToast('Funcionalidade de foto em breve!', 'info');
}

function closeTagModal() {
    const modal = document.querySelector('.tag-modal');
    if (modal) modal.remove();
}

function updatePostTags() {
    const container = $('post-tags');
    if (!container) return;
    
    let html = '';
    if (postTaggedMovie) {
        html += `<span class="post-tag">🎬 ${postTaggedMovie.title} <span class="post-tag-remove" onclick="removeTagMovie()">×</span></span>`;
    }
    if (postTaggedUser) {
        html += `<span class="post-tag">👤 @${postTaggedUser} <span class="post-tag-remove" onclick="removeTagUser()">×</span></span>`;
    }
    container.innerHTML = html;
}

function removeTagMovie() {
    postTaggedMovie = null;
    updatePostTags();
}

function removeTagUser() {
    postTaggedUser = null;
    updatePostTags();
}

// Curadoria Review Form
let curadoriaSelectedMovie = null;
let curadoriaRating = 0;

function openSelectMovieCuradoria() {
    const movieList = app.movies.slice(0, 15).map(m => 
        `<div class="tag-option" onclick="selectMovieCuradoria(${m.id})">
            <span>🎬</span> ${m.title} <span style="color: var(--muted); font-size: 0.8rem">(${m.year})</span>
        </div>`
    ).join('');
    
    const modal = document.createElement('div');
    modal.className = 'tag-modal';
    modal.innerHTML = `
        <div class="tag-modal-content">
            <h3>Selecionar Filme</h3>
            <input type="text" class="tag-search" placeholder="Buscar filme..." oninput="filterMoviesCuradoria(this.value)">
            <div class="tag-options" id="select-movie-options">${movieList}</div>
            <button class="btn btn-secondary" onclick="closeTagModal()">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function filterMoviesCuradoria(query) {
    const container = $('select-movie-options');
    if (!container) return;
    const filtered = app.movies.filter(m => m.title.toLowerCase().includes(query.toLowerCase())).slice(0, 15);
    container.innerHTML = filtered.map(m => 
        `<div class="tag-option" onclick="selectMovieCuradoria(${m.id})">
            <span>🎬</span> ${m.title} <span style="color: var(--muted); font-size: 0.8rem">(${m.year})</span>
        </div>`
    ).join('');
}

function selectMovieCuradoria(movieId) {
    const movie = app.movies.find(m => m.id === movieId);
    if (!movie) return;
    curadoriaSelectedMovie = movie;
    
    const btn = $('curadoria-select-movie');
    const text = $('curadoria-movie-text');
    if (btn) btn.classList.add('selected');
    if (text) text.textContent = movie.title;
    
    closeTagModal();
}

function setCuradoriaRating(rating) {
    curadoriaRating = rating;
    const stars = $$('#curadoria-stars .star-input');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
        star.textContent = index < rating ? '★' : '☆';
    });
}

function submitCuradoriaReview() {
    if (!curadoriaSelectedMovie) {
        showToast('Selecione um filme!', 'warning');
        return;
    }
    
    if (curadoriaRating === 0) {
        showToast('Dê uma avaliação ao filme!', 'warning');
        return;
    }
    
    const textArea = $('curadoria-review-text');
    const text = textArea?.value?.trim() || '';
    
    if (!app.currentUser || !app.currentProfile) {
        showToast('Faça login para avaliar!', 'warning');
        return;
    }
    
    const newPost = {
        id: Date.now(),
        type: 'review',
        movieId: curadoriaSelectedMovie.id,
        rating: curadoriaRating,
        user: {
            name: app.currentProfile.name,
            avatar: app.currentProfile.avatar
        },
        text: text || `Assisti ${curadoriaSelectedMovie.title} e dei ${curadoriaRating} estrelas!`,
        time: 'Agora',
        likes: 0,
        comments: 0
    };
    
    MOCK_FEED.unshift(newPost);
    
    // Reset form
    textArea.value = '';
    curadoriaSelectedMovie = null;
    curadoriaRating = 0;
    
    const btn = $('curadoria-select-movie');
    const movieText = $('curadoria-movie-text');
    if (btn) btn.classList.remove('selected');
    if (movieText) movieText.textContent = 'Clique para selecionar...';
    
    const stars = $$('#curadoria-stars .star-input');
    stars.forEach(star => {
        star.classList.remove('active');
        star.textContent = '☆';
    });
    
    showToast('Avaliação publicada!', 'success');
    addXP(15);
}

// Feed Review Form
let feedSelectedMovie = null;
let feedRating = 0;

function openSelectMovieFeed() {
    const movieList = app.movies.slice(0, 15).map(m => 
        `<div class="tag-option" onclick="selectMovieFeed(${m.id})">
            <span>🎬</span> ${m.title} <span style="color: var(--muted); font-size: 0.8rem">(${m.year})</span>
        </div>`
    ).join('');
    
    const modal = document.createElement('div');
    modal.className = 'tag-modal';
    modal.innerHTML = `
        <div class="tag-modal-content">
            <h3>Selecionar Filme</h3>
            <input type="text" class="tag-search" placeholder="Buscar filme..." oninput="filterMoviesFeed(this.value)">
            <div class="tag-options" id="select-movie-options-feed">${movieList}</div>
            <button class="btn btn-secondary" onclick="closeTagModal()">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function filterMoviesFeed(query) {
    const container = $('select-movie-options-feed');
    if (!container) return;
    const filtered = app.movies.filter(m => m.title.toLowerCase().includes(query.toLowerCase())).slice(0, 15);
    container.innerHTML = filtered.map(m => 
        `<div class="tag-option" onclick="selectMovieFeed(${m.id})">
            <span>🎬</span> ${m.title} <span style="color: var(--muted); font-size: 0.8rem">(${m.year})</span>
        </div>`
    ).join('');
}

function selectMovieFeed(movieId) {
    const movie = app.movies.find(m => m.id === movieId);
    if (!movie) return;
    feedSelectedMovie = movie;
    
    const btn = $('feed-select-movie');
    const text = $('feed-movie-text');
    if (btn) btn.classList.add('selected');
    if (text) text.textContent = movie.title;
    
    closeTagModal();
}

function setFeedRating(rating) {
    feedRating = rating;
    const stars = $$('#feed-stars .star-input');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
        star.textContent = index < rating ? '★' : '☆';
    });
}

function submitFeedReview() {
    if (!feedSelectedMovie) {
        showToast('Selecione um filme!', 'warning');
        return;
    }
    
    if (feedRating === 0) {
        showToast('Dê uma avaliação ao filme!', 'warning');
        return;
    }
    
    const textArea = $('feed-review-text');
    const text = textArea?.value?.trim() || '';
    
    if (!app.currentUser || !app.currentProfile) {
        showToast('Faça login para avaliar!', 'warning');
        return;
    }
    
    const newPost = {
        id: Date.now(),
        type: 'review',
        movieId: feedSelectedMovie.id,
        rating: feedRating,
        user: {
            name: app.currentProfile.name,
            avatar: app.currentProfile.avatar
        },
        text: text || `Assisti ${feedSelectedMovie.title} e dei ${feedRating} estrelas!`,
        time: 'Agora',
        likes: 0,
        comments: 0
    };
    
    MOCK_FEED.unshift(newPost);
    
    // Reset form
    textArea.value = '';
    feedSelectedMovie = null;
    feedRating = 0;
    
    const btn = $('feed-select-movie');
    const movieText = $('feed-movie-text');
    if (btn) btn.classList.remove('selected');
    if (movieText) movieText.textContent = 'Clique para selecionar...';
    
    const stars = $$('#feed-stars .star-input');
    stars.forEach(star => {
        star.classList.remove('active');
        star.textContent = '☆';
    });
    
    renderFeedPosts();
    showToast('Avaliação publicada!', 'success');
    addXP(15);
}

// ========== MINHA CURADORIA ==========

const CURADORIA_MOCK = {
    watched: [1, 2, 3, 4, 5, 7, 11, 15, 17, 19, 22, 27],
    recommended: [2, 11, 15, 7, 22],
    reviews: [
        { movieId: 2, rating: 5, text: 'Uma obra-prima absoluta. A atuação de Marlon Brando é inesquecível.', date: '2024-01-15' },
        { movieId: 11, rating: 5, text: 'Nolan nos leva a uma jornada épica pelo espaço e pelo coração humano.', date: '2024-01-12' },
        { movieId: 15, rating: 5, text: 'A conclusão perfeita para a maior trilogia da história do cinema.', date: '2024-01-10' },
        { movieId: 7, rating: 4, text: 'Heath Ledger reinventou o Coringa. Performance histórica.', date: '2024-01-08' },
        { movieId: 22, rating: 4, text: 'Clássico da Disney que marcou gerações. Hakuna Matata!', date: '2024-01-05' },
        { movieId: 3, rating: 5, text: 'A amizade entre Andy e Red é o coração deste filme atemporal.', date: '2024-01-03' },
        { movieId: 27, rating: 5, text: 'Bong Joon-ho criou uma sátira social brilhante e inesquecível.', date: '2024-01-01' }
    ],
    stats: {
        totalHours: 47,
        avgRating: 4.6,
        favoriteGenre: 'Drama',
        topDirector: 'Christopher Nolan',
        moviesThisMonth: 8
    }
};

function shareProfile() {
    if (!app.currentProfile) return;
    const text = `Confira o perfil de ${app.currentProfile.name} no ReelFeel - Curador Cinematográfico 🎬`;
    if (navigator.share) {
        navigator.share({ title: 'ReelFeel', text, url: location.href });
    } else {
        navigator.clipboard.writeText(text + ' ' + location.href);
        showToast('Link do perfil copiado!', 'success');
    }
}

function renderCuradoria() {
    if (!app.currentUser || !app.currentProfile) return;
    
    const profile = app.currentProfile;
    const mockData = CURADORIA_MOCK;
    
    // Avatar na caixa de publicação
    const postAvatar = $('curadoria-post-avatar');
    if (postAvatar) {
        postAvatar.innerHTML = `<img src="${profile.avatar}" alt="${profile.name}">`;
    }
    
    // Stats
    const statsContainer = $('curadoria-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="curadoria-stat-card">
                <span class="curadoria-stat-icon">🎬</span>
                <div class="curadoria-stat-info">
                    <span class="curadoria-stat-value">${mockData.watched.length}</span>
                    <span class="curadoria-stat-label">Filmes Assistidos</span>
                </div>
            </div>
            <div class="curadoria-stat-card">
                <span class="curadoria-stat-icon">⏱️</span>
                <div class="curadoria-stat-info">
                    <span class="curadoria-stat-value">${mockData.stats.totalHours}h</span>
                    <span class="curadoria-stat-label">Horas Assistidas</span>
                </div>
            </div>
            <div class="curadoria-stat-card">
                <span class="curadoria-stat-icon">⭐</span>
                <div class="curadoria-stat-info">
                    <span class="curadoria-stat-value">${mockData.stats.avgRating}</span>
                    <span class="curadoria-stat-label">Média de Notas</span>
                </div>
            </div>
            <div class="curadoria-stat-card">
                <span class="curadoria-stat-icon">📝</span>
                <div class="curadoria-stat-info">
                    <span class="curadoria-stat-value">${mockData.reviews.length}</span>
                    <span class="curadoria-stat-label">Resenhas Feitas</span>
                </div>
            </div>
            <div class="curadoria-stat-card">
                <span class="curadoria-stat-icon">💡</span>
                <div class="curadoria-stat-info">
                    <span class="curadoria-stat-value">${mockData.recommended.length}</span>
                    <span class="curadoria-stat-label">Indicações</span>
                </div>
            </div>
        `;
    }
    
    // Filmes Assistidos
    const watchedContainer = $('curadoria-watched');
    const watchedCount = $('watched-count');
    if (watchedContainer) {
        const watchedMovies = mockData.watched.map(id => app.movies.find(m => m.id === id)).filter(Boolean);
        if (watchedCount) watchedCount.textContent = `${watchedMovies.length} filmes`;
        watchedContainer.innerHTML = watchedMovies.map(movie => `
            <div class="curadoria-movie-card">
                <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                <div class="curadoria-movie-overlay">
                    <span class="curadoria-movie-title">${movie.title}</span>
                    <span class="curadoria-movie-year">${movie.year}</span>
                </div>
            </div>
        `).join('');
    }
    
    // Minhas Resenhas
    const reviewsContainer = $('curadoria-reviews');
    const reviewsCount = $('reviews-made-count');
    if (reviewsContainer) {
        if (reviewsCount) reviewsCount.textContent = `${mockData.reviews.length} resenhas`;
        reviewsContainer.innerHTML = mockData.reviews.map(review => {
            const movie = app.movies.find(m => m.id === review.movieId);
            if (!movie) return '';
            return `
                <article class="curadoria-review-card">
                    <div class="curadoria-review-poster">
                        <img src="${movie.poster}" alt="${movie.title}">
                    </div>
                    <div class="curadoria-review-content">
                        <div class="curadoria-review-header">
                            <h3>${movie.title}</h3>
                            <span class="curadoria-review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                        </div>
                        <p class="curadoria-review-text">"${review.text}"</p>
                        <span class="curadoria-review-date">${new Date(review.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                </article>
            `;
        }).join('');
    }
    
    // Filmes Indicados
    const recommendedContainer = $('curadoria-recommended');
    const recommendedCount = $('recommended-count');
    if (recommendedContainer) {
        const recommendedMovies = mockData.recommended.map(id => app.movies.find(m => m.id === id)).filter(Boolean);
        if (recommendedCount) recommendedCount.textContent = `${recommendedMovies.length} indicações`;
        recommendedContainer.innerHTML = recommendedMovies.map(movie => `
            <div class="curadoria-movie-card recommended">
                <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                <div class="curadoria-movie-overlay">
                    <span class="curadoria-movie-title">${movie.title}</span>
                    <span class="curadoria-movie-badge">Indicado por você</span>
                </div>
            </div>
        `).join('');
    }
    
    // Identidade Cinematográfica
    const identityContainer = $('curadoria-identity');
    if (identityContainer) {
        identityContainer.innerHTML = `
            <div class="identity-card-curadoria">
                <div class="identity-avatar">
                    <img src="${profile.avatar}" alt="${profile.name}">
                </div>
                <div class="identity-info">
                    <h3>${profile.name}</h3>
                    <p class="identity-title">Curador Cinematográfico</p>
                    <div class="identity-xp">
                        <span class="xp-icon">⭐</span>
                        <span class="xp-value">${parseInt(localStorage.getItem('xp_' + app.currentUser?.id) || '0')} XP</span>
                        <span class="xp-level">${getUserLevel().name}</span>
                    </div>
                </div>
                <button class="share-profile-btn" onclick="shareProfile()" title="Compartilhar perfil">
                    <span>📤</span>
                </button>
                <div class="identity-traits">
                    <div class="identity-trait">
                        <span class="trait-label">Gênero Favorito</span>
                        <span class="trait-value">${mockData.stats.favoriteGenre}</span>
                    </div>
                    <div class="identity-trait">
                        <span class="trait-label">Diretor Favorito</span>
                        <span class="trait-value">${mockData.stats.topDirector}</span>
                    </div>
                    <div class="identity-trait">
                        <span class="trait-label">Filmes este mês</span>
                        <span class="trait-value">${mockData.stats.moviesThisMonth}</span>
                    </div>
                </div>
                <div class="identity-tags-curadoria">
                    <span class="identity-tag">Crítico Exigente</span>
                    <span class="identity-tag">Amante de Clássicos</span>
                    <span class="identity-tag">Explorador de Gêneros</span>
                </div>
            </div>
        `;
    }
}

function renderAllReviews(reviews) {
    const container = $('all-reviews-grid');
    if (!container) return;
    if (!reviews.length) { 
        container.innerHTML = '<p class="empty-state">Nenhuma resenha encontrada.</p>'; 
        return; 
    }
    container.innerHTML = reviews.map(r => {
        const movie = app.movies.find(m => m.id === r.movieId);
        const isImageAvatar = r.authorAvatar && (r.authorAvatar.startsWith('http') || r.authorAvatar.startsWith('assets'));
        const avatarHtml = isImageAvatar 
            ? `<img src="${r.authorAvatar}" alt="${r.authorName}" class="video-review-author-img">`
            : `<span class="video-review-author-emoji">${r.authorAvatar}</span>`;
        
        // Buscar XP e Badge do autor
        const authorXp = r.authorXp || Math.floor(Math.random() * 2000) + 500;
        const authorLevel = getAuthorLevel(authorXp);
        
        return `
            <article class="video-review-card" onclick="openReviewPlayer('${r.id}')">
                <div class="video-review-thumbnail" style="background-image: url('https://img.youtube.com/vi/${r.youtubeId}/hqdefault.jpg')">
                    ${r.badge ? `<span class="video-review-badge">${r.badge}</span>` : ''}
                    <span class="video-review-duration">${r.duration}</span>
                    <div class="video-review-play">▶</div>
                </div>
                <div class="video-review-content">
                    <h3 class="video-review-title">${r.title}</h3>
                    <p class="video-review-movie">${movie?.title || 'Filme'}</p>
                    <div class="video-review-author">
                        <div class="video-review-author-avatar">${avatarHtml}</div>
                        <div class="video-review-author-info">
                            <span class="video-review-author-name">${r.authorName}</span>
                            <span class="video-review-author-badge">${authorLevel.icon} ${authorLevel.name} • ${authorXp} XP</span>
                        </div>
                    </div>
                    <div class="video-review-stats"><span>${formatNumber(r.views)} views</span><span>${r.likes} likes</span></div>
                </div>
            </article>`;
    }).join('');
}

function getAuthorLevel(xp) {
    return [...LEVELS].reverse().find(l => xp >= l.minXP) || LEVELS[0];
}

function updateReviewsCount(count, query = '') {
    const el = $('reviews-count');
    if (!el) return;
    if (query) {
        el.textContent = `${count} resultado${count !== 1 ? 's' : ''} para "${query}"`;
    } else {
        el.textContent = `Mostrando ${count} resenha${count !== 1 ? 's' : ''} da comunidade`;
    }
}

function searchReviews(query) {
    const reviews = getVideoReviews();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        renderAllReviews(reviews);
        updateReviewsCount(reviews.length);
        return;
    }
    
    const filtered = reviews.filter(r => {
        const movie = app.movies.find(m => m.id === r.movieId);
        const movieTitle = movie?.title?.toLowerCase() || '';
        const movieGenres = movie?.genres?.join(' ').toLowerCase() || '';
        const authorName = r.authorName.toLowerCase();
        const title = r.title.toLowerCase();
        const tags = r.tags?.join(' ').toLowerCase() || '';
        
        return authorName.includes(searchTerm) || 
               movieTitle.includes(searchTerm) || 
               movieGenres.includes(searchTerm) ||
               title.includes(searchTerm) ||
               tags.includes(searchTerm);
    });
    
    renderAllReviews(filtered);
    updateReviewsCount(filtered.length, query);
}

function formatNumber(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n; }

function openVideoUploadModal() {
    videoUploadData = { file: null, youtubeId: null, tags: [], rating: 0 };
    $('video-upload-movie').innerHTML = '<option value="">Selecione um filme</option>' + app.movies.map(m => `<option value="${m.id}">${m.title}</option>`).join('');
    $('video-upload-title').value = '';
    $('video-upload-desc').value = '';
    $('video-youtube-link').value = '';
    $('upload-preview').innerHTML = '';
    $('upload-preview').classList.add('hidden');
    $('upload-placeholder').classList.remove('hidden');
    $$('.tag-btn').forEach(b => b.classList.remove('active'));
    $$('.rating-star').forEach(s => s.classList.remove('active'));
    $('video-upload-modal').classList.add('active');
}

function closeVideoUploadModal() { $('video-upload-modal').classList.remove('active'); }

function handleVideoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    videoUploadData.file = file;
    videoUploadData.youtubeId = null;
    $('upload-placeholder').classList.add('hidden');
    $('upload-preview').classList.remove('hidden');
    $('upload-preview').innerHTML = `<video src="${URL.createObjectURL(file)}" controls></video><button class="btn btn-outline btn-sm" onclick="clearVideoUpload()">✕ Remover</button>`;
}

function clearVideoUpload() {
    videoUploadData.file = null;
    $('upload-preview').innerHTML = '';
    $('upload-preview').classList.add('hidden');
    $('upload-placeholder').classList.remove('hidden');
}

function handleYouTubeLink() {
    const url = $('video-youtube-link').value;
    const id = extractYouTubeId(url);
    if (!id) return showToast('Link inválido!', 'warning');
    videoUploadData.youtubeId = id;
    videoUploadData.file = null;
    $('upload-placeholder').classList.add('hidden');
    $('upload-preview').classList.remove('hidden');
    $('upload-preview').innerHTML = `<img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="Thumbnail"><button class="btn btn-outline btn-sm" onclick="clearVideoUpload()">✕ Remover</button>`;
}

function extractYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
}

function toggleVideoTag(btn, tag) { btn.classList.toggle('active'); const i = videoUploadData.tags.indexOf(tag); if (i > -1) videoUploadData.tags.splice(i, 1); else videoUploadData.tags.push(tag); }
function setVideoRating(rating) { videoUploadData.rating = rating; $$('.rating-star').forEach((s, i) => s.classList.toggle('active', i < rating)); }

function submitVideoReview() {
    const movieId = parseInt($('video-upload-movie').value);
    const title = $('video-upload-title').value.trim();
    if (!movieId || !title || (!videoUploadData.file && !videoUploadData.youtubeId)) return showToast('Preencha todos os campos!', 'warning');
    const review = {
        id: `vr_${Date.now()}`, title, movieId,
        authorId: app.currentUser.id, authorName: app.currentUser.name, authorAvatar: getUserAvatarEmoji(),
        youtubeId: videoUploadData.youtubeId || 'dQw4w9WgXcQ',
        duration: '5:00', views: 0, likes: 0, rating: videoUploadData.rating,
        tags: videoUploadData.tags, description: $('video-upload-desc').value,
        comments: [], createdAt: new Date().toISOString(), badge: 'Novo'
    };
    saveVideoReview(review);
    closeVideoUploadModal();
    renderFeed();
    showToast('Resenha publicada!', 'success');
    addXP(25);
}

function openReviewPlayer(reviewId) {
    const review = getVideoReviews().find(r => r.id === reviewId);
    if (!review) return;
    currentReviewPlaying = review;
    const movie = app.movies.find(m => m.id === review.movieId);
    $('review-player-video').innerHTML = `<iframe src="https://www.youtube.com/embed/${review.youtubeId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    $('review-player-title').textContent = review.title;
    $('review-player-author').innerHTML = `<div class="review-author-avatar">${review.authorAvatar}</div><span>${review.authorName}</span>`;
    $('review-player-stats').innerHTML = `<span>${formatNumber(review.views)} views</span><span id="review-likes">${review.likes} likes</span><span>${review.comments.length} comentários</span>`;
    $('review-player-rating').innerHTML = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    $('review-player-movie').textContent = movie?.title || 'Filme';
    $('review-player-desc').textContent = review.description;
    $('review-player-tags').innerHTML = review.tags.map(t => `<span class="review-tag">${t}</span>`).join('');
    const likeBtn = $('like-icon'); if(likeBtn) likeBtn.classList.toggle('liked', isReviewLiked(review.id));
    $('comments-count').textContent = `(${review.comments.length})`;
    renderReviewComments(review.comments);
    $('review-player-modal').classList.add('active');
    incrementReviewViews(review.id);
}

function closeReviewPlayer() {
    $('review-player-video').innerHTML = '';
    $('review-player-modal').classList.remove('active');
    currentReviewPlaying = null;
}

function incrementReviewViews(reviewId) {
    const reviews = getVideoReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (review) { review.views++; setLS('videoReviews', reviews); }
}

function isReviewLiked(reviewId) { return getLS('reviewLikes').includes(reviewId); }

function likeReview() {
    if (!currentReviewPlaying) return;
    const likes = getLS('reviewLikes');
    const reviewId = currentReviewPlaying.id;
    const isLiked = likes.includes(reviewId);
    if (isLiked) { likes.splice(likes.indexOf(reviewId), 1); currentReviewPlaying.likes--; }
    else { likes.push(reviewId); currentReviewPlaying.likes++; }
    setLS('reviewLikes', likes);
    const reviews = getVideoReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (review) { review.likes = currentReviewPlaying.likes; setLS('videoReviews', reviews); }
    const likeBtnIcon = $('like-icon'); if(likeBtnIcon) likeBtnIcon.classList.toggle('liked', !isLiked);
    $('review-likes').textContent = `${currentReviewPlaying.likes} likes`;
    showToast(isLiked ? 'Like removido' : 'Resenha curtida!', 'success');
}

function shareReview() {
    if (!currentReviewPlaying) return;
    const movie = app.movies.find(m => m.id === currentReviewPlaying.movieId);
    const text = `Confira essa resenha de "${movie?.title || 'filme'}" no ReelFeel: ${currentReviewPlaying.title}`;
    if (navigator.share) navigator.share({ title: currentReviewPlaying.title, text, url: location.href });
    else { navigator.clipboard.writeText(text); showToast('Link copiado!', 'success'); }
}

function watchMovieFromReview() { if (currentReviewPlaying) { closeReviewPlayer(); watchMovie(currentReviewPlaying.movieId); } }

function renderReviewComments(comments) {
    const container = $('comments-list');
    if (!comments.length) { container.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center;">Nenhum comentário ainda. Seja o primeiro!</p>'; return; }
    container.innerHTML = comments.map(c => `<div class="comment-item"><div class="comment-avatar">${c.userName.charAt(0)}</div><div class="comment-content"><span class="comment-author">${c.userName}</span><p class="comment-text">${c.text}</p><span class="comment-time">${getTimeAgo(c.createdAt)}</span></div></div>`).join('');
}

function addComment() {
    if (!currentReviewPlaying || !app.currentUser) return;
    const input = $('comment-input');
    const text = input.value.trim();
    if (!text) return showToast('Digite um comentário!', 'warning');
    currentReviewPlaying.comments.unshift({ userId: app.currentUser.id, userName: app.currentUser.name, text, createdAt: new Date().toISOString() });
    const reviews = getVideoReviews();
    const review = reviews.find(r => r.id === currentReviewPlaying.id);
    if (review) { review.comments = currentReviewPlaying.comments; setLS('videoReviews', reviews); }
    input.value = '';
    $('comments-count').textContent = `(${currentReviewPlaying.comments.length})`;
    renderReviewComments(currentReviewPlaying.comments);
    showToast('Comentário adicionado!', 'success');
    addXP(5);
}

// Search
function handleSearch(query) {
    const resultsContainer = $('search-results');
    clearTimeout(searchTimeout);
    if (!query || query.length < 2) { resultsContainer.classList.remove('active'); return; }
    searchTimeout = setTimeout(() => {
        const term = query.toLowerCase();
        const results = app.movies.filter(m => m.title.toLowerCase().includes(term) || m.description.toLowerCase().includes(term) || m.genres.some(g => g.toLowerCase().includes(term))).slice(0, 5);
        resultsContainer.innerHTML = results.length ? results.map(m => {
            const posterUrl = m.poster || `https://img.youtube.com/vi/${m.trailerId}/hqdefault.jpg`;
            return `<div class="search-result-item" onclick="selectSearchResult(${m.id})"><img class="search-result-poster" src="${posterUrl}" alt="${m.title}" onerror="this.style.display='none'"><div class="search-result-info"><div class="search-result-title">${m.title}</div><div class="search-result-year">${m.year} • ${m.genres.join(', ')}</div></div></div>`;
        }).join('') : '<div class="search-no-results">Nenhum filme encontrado</div>';
        resultsContainer.classList.add('active');
    }, 300);
}

function selectSearchResult(movieId) { $('search-input').value = ''; $('search-results').classList.remove('active'); watchMovie(movieId); }

document.addEventListener('click', e => {
    const search = $('search-container');
    if (search && !search.contains(e.target)) $('search-results').classList.remove('active');
});
