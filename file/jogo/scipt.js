document.addEventListener("DOMContentLoaded", function () {
    const background = document.querySelector(".background");
    const totalNumbers = 20;

    function createNumber() {
        let num = Math.floor(Math.random() * 8) + 1;
        let numberElement = document.createElement("div");
        numberElement.classList.add("number");
        numberElement.textContent = num;

        let posX = Math.random() * 100;
        let posY = Math.random() * 100;
        let duration = 3 + Math.random() * 5;

        numberElement.style.left = `${posX}vw`;
        numberElement.style.top = `${posY}vh`;
        numberElement.style.animationDuration = `${duration}s`;

        background.appendChild(numberElement);

        numberElement.addEventListener("animationiteration", () => {
            numberElement.style.left = Math.random() * 100 + "vw";
            numberElement.style.top = Math.random() * 100 + "vh";
            numberElement.textContent = Math.floor(Math.random() * 9) + 1;
        });
    }

    for (let i = 0; i < totalNumbers; i++) {
        createNumber();
    }

    const numbersInBackground = [];
    const numberElements = document.querySelectorAll('.number');

    numberElements.forEach((element) => {
        numbersInBackground.push({
            num: parseInt(element.textContent),
            element: element
        });
    });

    function alterarCorNumero(fundoNumero) {
        numbersInBackground.forEach((item) => {
            if (item.num === fundoNumero) {
                item.element.classList.add("destacado");
                setTimeout(() => {
                    item.element.classList.remove("destacado");
                }, 1000);
            }
        });
    }

        const tabuleiro = document.getElementById('tabuleiro');
        const comecarBtn = document.getElementById('comecarBtn');
        const mensagemParabens = document.getElementById('mensagemParabens');
        const quadrado = document.querySelector('.quadrado');
    
        let puzzle = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 0]
        ];
    
        let vazio = { linha: 2, coluna: 2 };
    
        // Função para embaralhar o puzzle
        function embaralhar() {
            let numbers = [];
            for (let i = 0; i < 9; i++) {
                numbers.push(i);
            }
    
            let resolvivel = false;
    
            while (!resolvivel) {
                numbers = numbers.sort(() => Math.random() - 0.5);
    
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        puzzle[i][j] = numbers[i * 3 + j];
                        if (puzzle[i][j] === 0) {
                            vazio = { linha: i, coluna: j };
                        }
                    }
                }
    
                if (contarInversoes() % 2 === 0) {
                    resolvivel = true;
                }
            }
        }
    
        // Função para contar inversões no puzzle
        function contarInversoes() {
            let arr = [].concat(...puzzle);
            let inversoes = 0;
    
            for (let i = 0; i < arr.length - 1; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    if (arr[i] > arr[j] && arr[i] !== 0 && arr[j] !== 0) {
                        inversoes++;
                    }
                }
            }
            return inversoes;
        }
    
        // Função para verificar se o jogador ganhou
        function verificarGanhou() {
            let correto = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 0]
            ];
    
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (puzzle[i][j] !== correto[i][j]) {
                        return false;
                    }
                }
            }
            return true;
        }
    
        // Função para criar o tabuleiro
        function criarTabuleiro() {
            tabuleiro.innerHTML = '';
    
            for (let linha = 0; linha < 3; linha++) {
                for (let coluna = 0; coluna < 3; coluna++) {
                    const celula = document.createElement('div');
                    celula.classList.add('peça');
    
                    if (puzzle[linha][coluna] !== 0) {
                        celula.textContent = puzzle[linha][coluna];
                        celula.setAttribute("data-linha", linha);
                        celula.setAttribute("data-coluna", coluna);
    
                        // Permitir o drag and drop
                        celula.setAttribute("draggable", "true");
                        celula.addEventListener('dragstart', (e) => {
                            e.dataTransfer.setData("text", `${linha},${coluna}`);
                        });
    
                        celula.addEventListener('dragover', (e) => {
                            e.preventDefault();
                        });
    
                        celula.addEventListener('drop', (e) => {
                            e.preventDefault();
                            const [linhaOrig, colunaOrig] = e.dataTransfer.getData("text").split(",").map(Number);
                            moverPeça(linhaOrig, colunaOrig, linha, coluna);
                        });
                    } else {
                        celula.classList.add('vazia');
                    }
    
                    tabuleiro.appendChild(celula);
                }
            }
    
            if (verificarGanhou()) {
                mensagemParabens.style.display = 'block';
            } else {
                mensagemParabens.style.display = 'none';
            }
        }
    
        // Função para mover a peça
        function moverPeça(linhaOrig, colunaOrig, linhaDestino, colunaDestino) {
            const distanciaLinha = Math.abs(linhaDestino - linhaOrig);
            const distanciaColuna = Math.abs(colunaDestino - colunaOrig);
    
            // Verifica se o movimento é válido (só pode mover para o lado adjacente da célula vazia)
            if ((distanciaLinha === 1 && distanciaColuna === 0) || (distanciaLinha === 0 && distanciaColuna === 1)) {
                if (puzzle[linhaDestino][colunaDestino] === 0) {
                    puzzle[linhaDestino][colunaDestino] = puzzle[linhaOrig][colunaOrig];
                    puzzle[linhaOrig][colunaOrig] = 0;
    
                    vazio.linha = linhaDestino;
                    vazio.coluna = colunaDestino;
    
                    criarTabuleiro();
                }
            }
        }
    
        // Função para começar o jogo
        function comecarJogo() {
            embaralhar();
            criarTabuleiro();
            mensagemParabens.style.display = 'none';
        }
    
        // Iniciar o jogo ao clicar no botão
        comecarBtn.addEventListener('click', comecarJogo);
    
        // Começar o jogo assim que a página carregar
        comecarJogo();
    });
    
