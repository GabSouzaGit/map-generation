import { entityIDs } from "./utils.js";

const createProbButton = document.querySelector("#add-prob-button");

function createProb(){
  const prob = document.createElement('div');
  prob.classList.add('prob');

  const removeButton = document.createElement('button');
  const colorInput = document.createElement('input');
  const entityID = document.createElement('select');
  const chanceInput = document.createElement('input');

  removeButton.textContent = "Remover";
  removeButton.id = "remove";
  
  removeButton.addEventListener("click", (event) => {
    prob.remove(); 
  });

  colorInput.type = "color";
  colorInput.id = "color";

  entityID.id = "entity-id";

  for(let i = 0; i < entityIDs.length; i++){
    entityID.appendChild(entityIDs[i].cloneNode(true));
  }

  chanceInput.type = "number";
  chanceInput.id = "chance";
  chanceInput.placeholder = "Chance de geração";
  chanceInput.step = "0.1";
  chanceInput.value = 0;

  prob.appendChild(removeButton);
  prob.appendChild(colorInput);
  prob.appendChild(entityID);
  prob.appendChild(chanceInput);

  return prob;
}

createProbButton.addEventListener("click", (event) => {
  const prob = createProb();
  createProbButton.insertAdjacentElement("beforebegin", prob);
});