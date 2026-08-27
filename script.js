// Definições das palavras com dicas
const WORDS = [
    {
        word: 'ALGORITMO',
        hint: 'Sequência de passos para resolver um problema',
        definition: 'Um conjunto de instruções ordenadas para resolver um problema ou executar uma tarefa.'
    },
    {
        word: 'NEURAL',
        hint: 'Relacionado a redes de aprendizado',
        definition: 'Baseado na estrutura do cérebro. As redes neurais artificiais simulam o funcionamento dos neurônios.'
    },
    {
        word: 'APRENDIZADO',
        hint: 'Processo de machine learning',
        definition: 'Capacidade de um sistema melhorar seu desempenho através da experiência e dados.'
    },
    {
        word: 'DADOS',
        hint: 'Informações usadas no treinamento',
        definition: 'Conjunto de informações utilizadas para treinar e validar modelos de IA.'
    },
    {
        word: 'MODELO',
        hint: 'Estrutura matemática de uma IA',
        definition: 'Representação matemática que a IA usa para fazer previsões e tomar decisões.'
    },
    {
        word: 'TREINO',
        hint: 'Processo de ensinar a IA',
        definition: 'Fase onde o modelo é alimentado com dados para aprender padrões e melhorar.'
    },
    {
        word: 'PREDICAO',
        hint: 'Prever resultados futuros',
        definition: 'Capacidade de uma IA estimar ou adivinhar resultados com base no aprendizado anterior.'
    },
    {
        word: 'MAQUINA',
        hint: 'Computador que executa IA',
        definition: 'Dispositivo ou computador capaz de processar informações e executar algoritmos de IA.'
    },
    {
        word: 'INTELIGENCIA',
        hint: 'Capacidade de aprender e raciocinar',
        definition: 'Habilidade de adquirir conhecimento, compreender e aplicar informações para resolver problemas.'
    },
    {
        word: 'ARTIFICIAL',
        hint: 'Criada pelo homem, não natural',
        definition: 'Algo que é feito, criado ou produzido por seres humanos, não ocorrendo naturalmente.'
    }
];

// Configurações
const GRID_SIZE = 10;
let gameBoard = [];
let selectedCells = [];
let foundWords = new Set();
let usedHints = new Set();

// Inicializar o jogo
function initGame() {
    generateBoard();
    renderBoard();
    renderWordsList();
    updateProgress();
}

// Gerar grade com palavras
function generateBoard() {
    // Criar grade vazia
    gameBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));

    // Colocar palavras na grade
    WORDS.forEach(wordObj => {
        placeWord(wordObj.word);
    });

    // Preencher espaços vazios com letras aleatórias
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (gameBoard[i][j] === '') {
                gameBoard[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }
}

// Colocar uma palavra na grade
function placeWord(word) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 50;

    while (!placed && attempts < maxAttempts) {
        const direction = Math.floor(Math.random() * 8);
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);

        if (canPlaceWord(word, row, col, direction)) {
            placeWordInGrid(word, row, col, direction);
            placed = true;
        }
        attempts++;
    }
}

// Verificar se pode colocar uma palavra
function canPlaceWord(word, row, col, direction) {
    const [dRow, dCol] = getDirection(direction);
    
    for (let i = 0; i < word.length; i++) {
        const newRow = row + dRow * i;
        const newCol = col + dCol * i;

        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
            return false;
        }

        const cell = gameBoard[newRow][newCol];
        if (cell !== '' && cell !== word[i]) {
            return false;
        }
    }
    return true;
}

// Colocar palavra na grade
function placeWordInGrid(word, row, col, direction) {
    const [dRow, dCol] = getDirection(direction);
    
    for (let i = 0; i < word.length; i++) {
        const newRow = row + dRow * i;
        const newCol = col + dCol * i;
        gameBoard[newRow][newCol] = word[i];
    }
}

// Obter direção (8 direções possíveis)
function getDirection(direction) {
    const directions = [
        [0, 1],   // Direita
        [0, -1],  // Esquerda
        [1, 0],   // Baixo
        [-1, 0],  // Cima
        [1, 1],   // Diagonal baixo-direita
        [1, -1],  // Diagonal baixo-esquerda
        [-1, 1],  // Diagonal cima-direita
        [-1, -1]  // Diagonal cima-esquerda
    ];
    return directions[direction];
}

// Renderizar grade na tela
function renderBoard() {
    const boardDiv = document.getElementById('gameBoard');
    boardDiv.innerHTML = '';

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'letter-cell';
            cell.textContent = gameBoard[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;

            cell.addEventListener('mousedown', () => startSelection(i, j));
            cell.addEventListener('mouseover', () => continueSelection(i, j));
            cell.addEventListener('mouseup', endSelection);
            cell.addEventListener('click', () => selectCell(i, j));

            boardDiv.appendChild(cell);
        }
    }
}

// Iniciar seleção
let isSelecting = false;

function startSelection(row, col) {
    isSelecting = true;
    selectedCells = [[row, col]];
    updateSelectedDisplay();
}

// Continuar seleção
function continueSelection(row, col) {
    if (!isSelecting) return;

    const lastCell = selectedCells[selectedCells.length - 1];
    if (lastCell && isAdjacent(lastCell, [row, col])) {
        if (!selectedCells.some(cell => cell[0] === row && cell[1] === col)) {
            selectedCells.push([row, col]);
            updateSelectedDisplay();
        }
    }
}

// Finalizar seleção
function endSelection() {
    isSelecting = false;
    checkWord();
}

// Verificar adjacência
function isAdjacent(cell1, cell2) {
    const rowDiff = Math.abs(cell1[0] - cell2[0]);
    const colDiff = Math.abs(cell1[1] - cell2[1]);
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff) > 0;
}

// Atualizar display de seleção
function updateSelectedDisplay() {
    document.querySelectorAll('.letter-cell').forEach(cell => {
        cell.classList.remove('selected');
    });

    selectedCells.forEach(([row, col]) => {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add('selected');
        }
    });
}

// Verificar se a seleção forma uma palavra
function checkWord() {
    if (selectedCells.length === 0) return;

    const selectedWord = selectedCells.map(([row, col]) => gameBoard[row][col]).join('');

    for (const wordObj of WORDS) {
        if (foundWords.has(wordObj.word)) continue;

        if (selectedWord === wordObj.word) {
            markWordAsFound(wordObj.word);
            markCellsAsFound(selectedCells);
            updateProgress();
            showMessage(`${wordObj.word} encontrada! 🎉`);
            checkCompletion();
            return;
        }

        // Verificar ao contrário
        if (selectedWord === wordObj.word.split('').reverse().join('')) {
            markWordAsFound(wordObj.word);
            markCellsAsFound(selectedCells);
            updateProgress();
            showMessage(`${wordObj.word} encontrada! 🎉`);
            checkCompletion();
            return;
        }
    }

    clearSelection();
}

// Marcar palavra como encontrada
function markWordAsFound(word) {
    foundWords.add(word);
    const item = document.querySelector(`[data-word="${word}"]`);
    if (item) {
        item.classList.add('found');
    }
}

// Marcar células como encontradas
function markCellsAsFound(cells) {
    cells.forEach(([row, col]) => {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add('found');
        }
    });
}

// Limpar seleção
function clearSelection() {
    selectedCells = [];
    updateSelectedDisplay();
}

// Atualizar progresso
function updateProgress() {
    const found = foundWords.size;
    const total = WORDS.length;
    const percentage = (found / total) * 100;

    document.getElementById('progressText').textContent = `Encontradas: ${found}/${total}`;
    document.getElementById('progressFill').style.width = percentage + '%';
}

// Renderizar lista de palavras
function renderWordsList() {
    const wordsList = document.getElementById('wordsList');
    wordsList.innerHTML = '';

    WORDS.forEach(wordObj => {
        const item = document.createElement('div');
        item.className = 'word-item';
        item.dataset.word = wordObj.word;

        item.innerHTML = `
            <div class="word-item-text">${wordObj.word}</div>
            <div class="word-item-hint">${wordObj.hint}</div>
        `;

        item.addEventListener('click', () => {
            showDefinition(wordObj);
        });

        wordsList.appendChild(item);
    });
}

// Mostrar definição
function showDefinition(wordObj) {
    const definitionBox = document.getElementById('definitionBox');
    definitionBox.innerHTML = `
        <div class="definition-title">${wordObj.word}</div>
        <div class="definition-text">${wordObj.definition}</div>
        <div class="definition-extra">💡 ${wordObj.hint}</div>
    `;
}

// Verificar conclusão do jogo
function checkCompletion() {
    if (foundWords.size === WORDS.length) {
        showCompletionMessage();
    }
}

// Mostrar mensagem de conclusão
function showCompletionMessage() {
    setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <h2>🎉 Parabéns! 🎉</h2>
            <p>Você encontrou todas as palavras e aprendeu sobre IA!</p>
            <button class="reset-btn" onclick="location.reload()">Jogar Novamente</button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(message);
    }, 500);
}

// Mostrar mensagem temporária
function showMessage(text) {
    // Implementar notificação se necessário
    console.log(text);
}

// Botão "Limpar Seleção"
document.getElementById('clearBtn').addEventListener('click', clearSelection);

// Botão "Dica"
document.getElementById('hintBtn').addEventListener('click', () => {
    const unfound = WORDS.filter(w => !foundWords.has(w.word));
    
    if (unfound.length === 0) {
        alert('Você já encontrou todas as palavras!');
        return;
    }

    const randomWord = unfound[Math.floor(Math.random() * unfound.length)];
    
    if (!usedHints.has(randomWord.word)) {
        usedHints.add(randomWord.word);
        alert(`💡 Dica: Procure por "${randomWord.word}"\n${randomWord.hint}`);
    } else {
        alert('Você já usou a dica para esta palavra. Tente procurar mais cuidadosamente!');
    }
});

// Botão "Reiniciar Jogo"
document.getElementById('resetBtn').addEventListener('click', () => {
    foundWords.clear();
    usedHints.clear();
    selectedCells = [];
    initGame();
    document.getElementById('definitionBox').innerHTML = 
        '<p>Clique em uma palavra da lista para ver sua definição e aprender mais sobre IA!</p>';
});

// Selecionar célula individual (para dispositivos móveis)
function selectCell(row, col) {
    if (selectedCells.length === 0) {
        selectedCells = [[row, col]];
    } else {
        const lastCell = selectedCells[selectedCells.length - 1];
        if (isAdjacent(lastCell, [row, col])) {
            selectedCells.push([row, col]);
        }
    }
    updateSelectedDisplay();
}

// Iniciar jogo ao carregar a página
document.addEventListener('DOMContentLoaded', initGame);

// Prevenir comportamento padrão de seleção de texto
document.addEventListener('selectstart', (e) => {
    if (e.target.classList.contains('letter-cell')) {
        e.preventDefault();
    }
});
