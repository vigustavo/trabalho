document.addEventListener("DOMContentLoaded", function () {
    const background = document.querySelector(".background");
    const totalNumbers = 20;

    function createNumber() {
        let num = Math.floor(Math.random() * 900) + 1;
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

    const chk = document.getElementById('chk');
    chk.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });
});
