window.onload = (() => {
    "use strict";
    const noiseGenerator = buildNoiseGenerator(),
        elButtonContainer = document.getElementById('buttonContainer');

    Object.keys(noiseGenerator.play).forEach(name => {
        const elButton = document.createElement('button');
        elButton.innerHTML = name;
        elButton.onclick = () => {
            noiseGenerator.stop();
            noiseGenerator.play[name]();
        };
        elButtonContainer.appendChild(elButton);
    });

});