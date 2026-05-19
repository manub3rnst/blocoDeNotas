// Espera o conteúdo da página carregar completamente antes de executar o script.
// É uma boa prática para evitar erros de JavaScript tentando acessar elementos
// que ainda não existem na página.
document.addEventListener('DOMContentLoaded', () => {
    const blocoDeNotas = document.getElementById('blocoDeNotas');
    const saveStatus = document.getElementById('saveStatus');
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');
    const themeToggle = document.getElementById('themeToggle');

    const STORAGE_KEY = 'minhaNota';
    const DEBOUNCE_MS = 600;
    const THEME_KEY = 'theme';

    let saveTimer = null;

    function showStatus(message, ms = 1500) {
        if (!saveStatus) return;
        saveStatus.textContent = message;
        if (ms > 0) {
            setTimeout(() => {
                // esvazia apenas se a mensagem atual for a mesma
                if (saveStatus.textContent === message) saveStatus.textContent = '';
            }, ms);
        }
    }

    function loadNote() {
        try {
            const nota = localStorage.getItem(STORAGE_KEY);
            if (nota) blocoDeNotas.value = nota;
        } catch (err) {
            console.error('Erro ao ler localStorage:', err);
            showStatus('Não foi possível carregar a nota');
        }
    }

    function saveNote() {
        try {
            localStorage.setItem(STORAGE_KEY, blocoDeNotas.value);
            showStatus('Salvo');
        } catch (err) {
            console.error('Erro ao salvar no localStorage:', err);
            showStatus('Falha ao salvar');
        }
    }

    function debounceSave() {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            saveNote();
            saveTimer = null;
        }, DEBOUNCE_MS);
    }

    function exportNote() {
        const text = blocoDeNotas.value;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nota.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    /* Theme (dark mode) handling */
    function applyTheme(theme) {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        if (themeToggle) {
            const isDark = theme === 'dark';
            themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            themeToggle.textContent = isDark ? '🌙 Escuro' : '☀️ Claro';
        }
    }

    function loadTheme() {
        try {
            const stored = localStorage.getItem(THEME_KEY);
            if (stored) { applyTheme(stored); return; }
        } catch (err) {
            console.warn('Não foi possível ler preferência de tema:', err);
        }
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    function toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        const next = isDark ? 'light' : 'dark';
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
        applyTheme(next);
    }

    function clearNote() {
        if (!confirm('Tem certeza que deseja limpar a nota?')) return;
        blocoDeNotas.value = '';
        try {
            localStorage.removeItem(STORAGE_KEY);
            showStatus('Limpo');
        } catch (err) {
            console.error('Erro ao limpar localStorage:', err);
            showStatus('Falha ao limpar');
        }
    }

    // Inicialização
    if (blocoDeNotas) {
        loadNote();
        blocoDeNotas.addEventListener('input', debounceSave);
    }

    if (exportBtn) exportBtn.addEventListener('click', exportNote);
    if (clearBtn) clearBtn.addEventListener('click', clearNote);
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    // Load theme after handlers are attached
    loadTheme();

});