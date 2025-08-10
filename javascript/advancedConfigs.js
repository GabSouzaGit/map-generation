export default function listenAdvancedConfigs(mtx){
    function applyErrorState(field){
        field.classList.add("input-error");
    }

    function removeErrorState(field){
        field.classList.remove("input-error");
    }

    const minRandomNumber = document.querySelector("#min-random-value");
    const maxRandomNumber = document.querySelector("#max-random-value");
    const generationCycles = document.querySelector("#generation-cycles");
    const mstimePerCycle = document.querySelector("#mstime-per-cycle");
    const defaultGenerationChar = document.querySelector("#default-char");

    // Listeners
    minRandomNumber.addEventListener('input', (e) => {
        removeErrorState(minRandomNumber);

        if(minRandomNumber.value < 0){
            applyErrorState(minRandomNumber);
            return;
        }

        mtx.miminumRandomNum = parseFloat(minRandomNumber.value);
    });

    maxRandomNumber.addEventListener('input', (e) => {
        removeErrorState(maxRandomNumber);

        if(maxRandomNumber.value < 1){
            applyErrorState(maxRandomNumber);
            return;
        }

        mtx.maximumRandomNum = parseFloat(maxRandomNumber.value);
    });

    generationCycles.addEventListener('input', (e) => {
        removeErrorState(generationCycles);

        if(generationCycles.value < 1){
            applyErrorState(generationCycles);
            return;
        }

        mtx.cyclesPerGen = parseInt(generationCycles.value);
    });

    mstimePerCycle.addEventListener('input', (e) => {
        removeErrorState(mstimePerCycle);

        if(mstimePerCycle.value < 1){
            applyErrorState(mstimePerCycle);
            return;
        }

        mtx.mstimePerCycle = parseInt(mstimePerCycle.value);
    });

    defaultGenerationChar.addEventListener('input', (e) => {
        removeErrorState(defaultGenerationChar);

        if(defaultGenerationChar.value == ""){
            applyErrorState(defaultGenerationChar);
            return;
        }

        mtx.plainChar = defaultGenerationChar.value;
        mtx.build();
        mtx.fillTable();
    });
}