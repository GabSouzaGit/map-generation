import Matrix from "./Matrix.js";
import listenAdvancedConfigs from "./advancedConfigs.js";

const mtx = new Matrix(10, 10, "A");

listenAdvancedConfigs(mtx);

const rowsInpt = document.querySelector("#matrix-rows");
const colsInpt = document.querySelector("#matrix-cols");

rowsInpt.addEventListener("input", (event) => {
  mtx.rows = parseInt(rowsInpt.value);
  mtx.fillTablePreview();
});

colsInpt.addEventListener("input", (event) => {
  mtx.cols = parseInt(colsInpt.value);
  mtx.fillTablePreview();
});

mtx.fillTable();

const rebuildButton = document.querySelector("#rebuild");
const genWithCycles = document.querySelector("#gen-with-cycles");

function compileFormInJSON(){
  const probList = document.querySelectorAll(".prob");
  const probs = [];

  probList.forEach((prob) => {
    const color = prob.querySelector("#color").value;
    const entityID = prob.querySelector("#entity-id").value;
    const chance = parseFloat((prob.querySelector("#chance").value).replaceAll(",", "."));

    probs.push({
      char: entityID,
      chance: chance,
      color: color
    });
  });

  return probs;
}

rebuildButton.addEventListener('click', () => {
  mtx.flushProbs();

  const probs = compileFormInJSON();

  for(let i = 0; i < probs.length; i++){
    try {
      mtx.addProb(
        probs[i].char,
        probs[i].chance,
        probs[i].color
      );

      mtx.fillTable();
    }catch(e){
      alert(e.message);
      return;
    }
  }
});

genWithCycles.addEventListener('click', async () => {
  let avg;
  mtx.flushProbs();

  const probs = compileFormInJSON();

  for(let i = 0; i < probs.length; i++){
    try {
      mtx.addProb(
        probs[i].char,
        probs[i].chance,
        probs[i].color
      );

      avg = await mtx.generation();
    }catch(e){
      alert(e.message);
      return;
    }
  }
});

/*
  Um grafico de médias
  Uma linha do tempo de quantos foram gerados a cada geração
  Os tres tipos mais comuns
  Os trés tipos mais raros
  Aqueles que nao foram gerados
  Aqueles que aparecerem em todas as gerações
*/
