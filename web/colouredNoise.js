function buildNoiseGenerator({
    sampleRate,
    channelCount = 1,
    bufferLength = 2,
} = {}) {

    const getAudioContext = (() => {
        "use strict";
        let audioContext;
        return () => {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                sampleRate = sampleRate || audioContext.sampleRate;
            }
            return audioContext;
        };
    })();

    const generatorFunctions = {
        white: () => Math.random() * 2 - 1,
        pink: i => {
            "use strict";
            const freqCount = 100,
                cyclesPerSecStart = 100,
                cyclesPerSecEnd = 1000,
                cyclesPerSecStep = (cyclesPerSecEnd - cyclesPerSecStart) / freqCount,
                startFactor = 2,
                endFactor = 0;
            let total = 0;
            for(let i = 0; i < freqCount; i++) {
                const cyclesPerSecond = cyclesPerSecStart + cyclesPerSecStep * i,
                    cycleLength = sampleRate / cyclesPerSecond,
                    index = (i % cycleLength) / cycleLength,
                    factor = startFactor + i * (endFactor - startFactor) / freqCount;
                total += Math.sin(index * Math.PI * 2) * Math.random() * factor;
            }
            return total / freqCount;
        },
        tone: i => {
            "use strict";
            const cyclesPerSecond = 300,
                cycleLength = sampleRate / cyclesPerSecond,
                index = (i % cycleLength) / cycleLength;
            return Math.sin(index * Math.PI * 2);
        }

    };

    let source;
    function playUsingGeneratorFunction(generatorFunction) {
        "use strict";
        const audioContext = getAudioContext(),
            bufferSize = bufferLength * sampleRate,
            noiseBuffer = audioContext.createBuffer(channelCount, bufferSize, sampleRate);

        for (let channelIndex = 0; channelIndex < channelCount; channelIndex++) {
            const output = noiseBuffer.getChannelData(channelIndex);
            for (let sample = 0; sample < bufferSize; sample++) {
                output[sample] = generatorFunction(sample);
            }
            console.log(output);
        }
        console.log(bufferSize)

        source = audioContext.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        source.start();

        source.connect(audioContext.destination);
    }

    const playFunctions = {};
    Object.entries(generatorFunctions).forEach(entry => {
        "use strict";
        const [name, fn] = entry;
        playFunctions[name] = () => playUsingGeneratorFunction(fn);
    });

    let playing;

    return {
        play: playFunctions,
        stop: () => {
            "use strict";
            if (source) {
                source.stop();
            }
        }

    };
}
