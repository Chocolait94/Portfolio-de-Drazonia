// --- Script pour les fleurs de cerisier ---
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const numberOfBlossoms = 70; // Augmenté pour un effet plus dense
    const minSize = 8; // Taille minimale d'une fleur en pixels
    const maxSize = 20; // Taille maximale d'une fleur en pixels
    const minFallSpeed = 0.5; // Vitesse de chute minimale (légèrement ralentie)
    const maxFallSpeed = 2.5; // Vitesse de chute maximale (légèrement ralentie)
    const maxWindEffect = 1.5; // Effet du vent (déplacement horizontal)

    function createBlossom() {
        const blossom = document.createElement('div');
        blossom.classList.add('cherry-blossom');

        const size = Math.random() * (maxSize - minSize) + minSize;
        blossom.style.width = `${size}px`;
        blossom.style.height = `${size}px`;

        // Positionnement initial aléatoire en haut de l'écran
        blossom.style.left = `${Math.random() * window.innerWidth}px`;
        blossom.style.top = `${-size}px`; // Commence juste au-dessus de l'écran

        // Vitesse de chute aléatoire
        blossom.fallSpeed = Math.random() * (maxFallSpeed - minFallSpeed) + minFallSpeed;
        // Direction du vent aléatoire pour un mouvement plus naturel
        blossom.windDirection = (Math.random() - 0.5) * 2 * maxWindEffect;

        body.appendChild(blossom);
        return blossom;
    }

    const blossoms = [];
    for (let i = 0; i < numberOfBlossoms; i++) {
        blossoms.push(createBlossom());
    }

    function animateBlossoms() {
        blossoms.forEach(blossom => {
            let currentTop = parseFloat(blossom.style.top);
            let currentLeft = parseFloat(blossom.style.left);

            // Fait tomber la fleur
            blossom.style.top = `${currentTop + blossom.fallSpeed}px`;
            // Applique l'effet du vent
            blossom.style.left = `${currentLeft + blossom.windDirection}px`;

            // Si la fleur sort de l'écran (en bas ou sur les côtés), la replace en haut
            if (currentTop > window.innerHeight + parseFloat(blossom.style.height) ||
                currentLeft < -parseFloat(blossom.style.width) ||
                currentLeft > window.innerWidth) {
                blossom.style.top = `${-parseFloat(blossom.style.height)}px`;
                blossom.style.left = `${Math.random() * window.innerWidth}px`;
                blossom.fallSpeed = Math.random() * (maxFallSpeed - minFallSpeed) + minFallSpeed;
                blossom.windDirection = (Math.random() - 0.5) * 2 * maxWindEffect;
            }
        });

        requestAnimationFrame(animateBlossoms); // Demande au navigateur de rafraîchir l'animation
    }

    animateBlossoms(); // Lance l'animation
});