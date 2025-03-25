document.addEventListener("DOMContentLoaded", function () {
    const tabuleiro = document.getElementById('tabuleiro');
    const comecarBtn = document.getElementById('comecarBtn');
    const ajudaBtn = document.getElementById('ajudaBtn');
    const mensagemParabens = document.getElementById('mensagemParabens');

    let puzzle = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0]
    ];

    let vazio = { linha: 2, coluna: 2 };

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

    // Função para embaralhar as peças
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
                    celula.setAttribute("draggable", "true");
                    celula.setAttribute("data-linha", linha);
                    celula.setAttribute("data-coluna", coluna);

                    // Lógica de arrasto para o mouse
                    celula.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData("text", `${linha},${coluna}`);
                        e.target.style.opacity = '0.5';
                    });

                    celula.addEventListener('dragend', (e) => {
                        e.target.style.opacity = '1';
                    });

                    // Lógica de arrasto para toque no celular
                    celula.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const pos = touch.target.getBoundingClientRect();
                        e.target.style.opacity = '0.5';

                        celula.addEventListener('touchmove', (moveEvent) => {
                            moveEvent.preventDefault();
                            const touchMove = moveEvent.touches[0];
                            const deltaX = touchMove.pageX - touch.pageX;
                            const deltaY = touchMove.pageY - touch.pageY;

                            // Movimenta o elemento conforme o toque
                            celula.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        });

                        celula.addEventListener('touchend', (endEvent) => {
                            endEvent.preventDefault();
                            // Resetando a posição da peça
                            celula.style.transform = 'none';
                        });
                    });

                    // Permitir que as peças se movam
                    celula.addEventListener('click', (e) => {
                        const numeroTabuleiro = parseInt(e.target.textContent);
                        alterarCorNumero(numeroTabuleiro);
                    });
                } else {
                    celula.classList.add('vazia');
                }

                celula.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                celula.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const [linhaOrig, colunaOrig] = e.dataTransfer.getData("text").split(",").map(Number);
                    moverPeça(linhaOrig, colunaOrig, linha, coluna);
                });

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

    // Função de dica para o jogador
    function fornecerDica() {
        let melhorMovimento = encontrarMelhorMovimento();
        if (melhorMovimento) {
            const [linhaOrig, colunaOrig] = melhorMovimento;
            moverPeça(linhaOrig, colunaOrig, vazio.linha, vazio.coluna);
            const peça = document.querySelector(`.peça[data-linha='${linhaOrig}'][data-coluna='${colunaOrig}']`);
            peça.classList.add('destacado');
            setTimeout(() => {
                peça.classList.remove('destacado');
            }, 1000);
        }
    }

    // Função para encontrar o melhor movimento
    function encontrarMelhorMovimento() {
        for (let linha = 0; linha < 3; linha++) {
            for (let coluna = 0; coluna < 3; coluna++) {
                if (puzzle[linha][coluna] !== 0) {
                    if ((Math.abs(linha - vazio.linha) === 1 && coluna === vazio.coluna) ||
                        (Math.abs(coluna - vazio.coluna) === 1 && linha === vazio.linha)) {
                        return [[linha, coluna]];
                    }
                }
            }
        }
        return null;
    }

    // Configuração inicial
    criarTabuleiro();

    // Botão de começar o jogo
    comecarBtn.textContent = 'Começar';
    comecarBtn.addEventListener('click', comecarJogo);

    // Botão de ajuda
    ajudaBtn.addEventListener('click', fornecerDica);
});
