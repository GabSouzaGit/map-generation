import { tableID } from "./utils.js";

export default class Matrix {
  // Parametros de geração
  miminumRandomNum = 0;
  maximumRandomNum = 1;
  cyclesPerGen = 10;
  mstimePerCycle = 20;

  // Estrutura da matriz
  rows = 0;
  cols = 0;
  plainChar = "";
  matrix = [];

  //Elementos da matriz
  chances = {};
  entitiesQTD = {};

  //Dados de geração
  generationTrack = [];

  constructor(rows, cols, plainChar) {
    this.rows = rows;
    this.cols = cols;
    this.plainChar = plainChar;
    this.build();
  }
  
  random() {
    return Math.random() * this.maximumRandomNum + this.miminumRandomNum;
  }

  // DEBUG FUNCTIONS
  plot() {
    const plotVersion = this.matrix.map((line) => line.join());
    console.log(plotVersion);
  }

  originalStruct() {
    console.log(this.matrix);
  }
  /* ** */

  colorIsDarker(color){
    const SIXTEEN_BITS = 16;
    const MAX_BRIGHTNESS_QTD = 255;
    const EYE_WEIGHTS = [
      0.2126, 
      0.7152, 
      0.0722
    ];
    const MIN_PERCENTUAL_TO_DARK_COLOR = 50;

    const colorNotation = color.startsWith('#') ? color.slice(1) : color;
    
    const r = parseInt(colorNotation.substring(0, 2), SIXTEEN_BITS);
    const g = parseInt(colorNotation.substring(2, 4), SIXTEEN_BITS);
    const b = parseInt(colorNotation.substring(4, 6), SIXTEEN_BITS);
    
    const brightness = (EYE_WEIGHTS[0] * r + EYE_WEIGHTS[1] * g + EYE_WEIGHTS[2] * b);
    const brgPercentual = (brightness / MAX_BRIGHTNESS_QTD) * 100;
    
    return brgPercentual <= MIN_PERCENTUAL_TO_DARK_COLOR;
  }

  verificateParams(){
    if(this.miminumRandomNum >= this.maximumRandomNum) throw new Error("A aleatoriedade mínima não pode exceder a máxima.");
    if(this.cyclesPerGen < 1) throw new Error("A geração deve ter pelo menos 1 cíclo.");
    if(this.mstimePerCycle <= 0) throw new Error("Determine um tempo por ciclo válido (milissegundos)");
  }

  build() {
    const keysFromEntities = Object.keys(this.entitiesQTD);
    if (keysFromEntities.length > 0) {
      // Temos probabilidades.
      for (let i = 0; i < keysFromEntities.length; i++) {
        this.entitiesQTD[keysFromEntities[i]] = 0;
      }
    }

    this.matrix = [];

    for (let i = 0; i < this.rows; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = this.plainChar;
      }
    }
  }

  addProb(char, chance, color) {
    if(chance == "" || chance == null || chance == undefined){
      this.flushProbs();
      throw Error("Insira uma chance de geração da entidade.");

    }
    
    if (char == this.plainChar) {
      this.flushProbs();
      throw Error("O ID entdade não pode ser igual ao ID de entidade padrão.");
    }

    if (
      chance < this.miminumRandomNum ||
      chance > this.maximumRandomNum
    ) {
      this.flushProbs();
      throw new Error(
        `A chance deve estar dentro do intervalo padrão de geração (${this.miminumRandomNum} - ${this.maximumRandomNum})`
      );
    }

    this.chances[char] = { char, chance, color };
    this.entitiesQTD[char] = 0;
    this.chances = this.chances.sort((a, b) => {
      if (a.chance < b.chance) return -1;
      if (b.chance < a.chance) return 1;
      return 0;
    });
  }

  rebuild() {
    this.verificateParams();
    this.build();

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const entityKeys = Object.keys(this.chances);
        for (let k = 0; k < entityKeys.length; k++) {
          const key = entityKeys[k];

          if(this.random() <= this.chances[key].chance) {
            this.matrix[i][j] = this.chances[key].char;
            this.entitiesQTD[this.chances[key].char]++;
            break;
          }
        }
      }
    }
  }

  flushProbs() {
    this.chances = [];
  }

  fillTablePreview(){
    this.build();
    this.fillTable()
  }

  fillTable() {
    this.rebuild();
    const table = document.querySelector(tableID);

    table.innerHTML = "";

    for (let i = 0; i < this.matrix.length; i++) {
      const line = this.matrix[i];
      const tableLine = document.createElement("tr");

      for (let j = 0; j < line.length; j++) {
        const cell = document.createElement("td");

        if(line[j] != this.plainChar){
          const color = this.chances[line[j]].color;
          cell.style.backgroundColor = color;
          if(this.colorIsDarker(color)) cell.style.color = "#fff";
        }

        cell.classList.add(line[j]);
        cell.textContent = line[j];
        tableLine.appendChild(cell);
      }

      table.appendChild(tableLine);
    }
  }

  async generation() {
    this.verificateParams();

    let counter = 0;

    const generationJob = () => {
      return new Promise((resolve) => {
        const analytics = [];

        let cycles = setInterval(() => {
          if (counter == this.cyclesPerGen) {
            clearInterval(cycles);
            resolve(analytics);
          }

          this.rebuild();
          this.fillTable();
          counter++;

          analytics.push({ 
            ...this.entitiesQTD,
            index: counter,
          });
        }, this.mstimePerCycle);
      });
    };

    const analytics = await generationJob();

    this.generationTrack = [];
    this.generationTrack = analytics;

    const chanceKeys = Object.keys(analytics[0]);
    const sum = {
      cycles: this.cyclesPerGen,
    };

    chanceKeys.map((key) => {
      sum[key] = 0;
    });

    analytics.map((cenary) => {
      chanceKeys.map((key) => {
        sum[key] += cenary[key];
      });
    });

    chanceKeys.map((key) => {
      sum[key] = Math.round(sum[key] / this.cyclesPerGen);
    });

    this.plotGraphs();
    return sum;
  }

  plotGraphs(){
    if(this.generationTrack.length <= 0) return;

    const results = document.querySelector("#estat-results #gen");
    results.innerHTML =  ""; 
    
    const series = Object.keys(this.chances).map(key => {
      return {
        color: this.chances[key].color,
        name: key,
        data: this.generationTrack.map(entities => {
          return entities[key]
        })
      }
    })
    
    var options = {
      chart: {
        type: 'line'
      },
      series,
      xaxis: {
        categories: this.generationTrack.map(generation => generation.index)
      }
    }

    const chart = new ApexCharts(results, options);

    chart.render();
  }
}
