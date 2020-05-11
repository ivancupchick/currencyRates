function getById(id) {
  return document.getElementById(id);
}
// config
const BEGINCOORDS = {
  x: 25,
  y: 30
}
let COEFFICIENT;

const CURRENCIES = {
  RUB: 298,
  USD: 145,
  EUR: 292,
  GBP: 143
}

const COLORS = ['blue', 'red', 'black', 'purple', 'yellow', 'white'];

class UI {
  constructor() {
    this.inputsDateValue = document.getElementsByClassName('input-date');
    this.inputDateFrom = this.inputsDateValue[0];
    this.inputDateTo = this.inputsDateValue[1];
    this.canvas = getById('diagramCanvas');
    this.context = this.canvas.getContext('2d');
    this.nowRate = getById('nowRate');
    this.selecterCurrency = getById('kindOfMoney');
    this.dateFrom = getById('dateFrom').value;
    this.dateTo = getById('dateTo').value;

    this.buttonCreateDiagram = getById('createDiagram');
    this.buttonSetWeek = getById('setWeek');
    this.buttonSetYear = getById('setYear');
    this.buttonSetMonth = getById('setMonth');

    this.arrayDates = [];
    this.countForDrawing;
    this.beginCods = { x: BEGINCOORDS.x, y: this.canvas.height - BEGINCOORDS.y };
    this.sizeDiagram = { width: this.canvas.width - 15 - this.beginCods.x, height: this.beginCods.y - 15 }
  }

  setBackgrondCanvas() {
    this.context.translate(0, 0);
    this.context.fillStyle = "rgb(221, 221, 221)";
    this.context.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.context.fill();
    this.context.save();

    this.countForDrawing = 0;
    this.drawHistory();
  }

  drawHistory() {
    this.context.beginPath();
    // Vertical line
    this.context.moveTo(this.beginCods.x, this.beginCods.y);
    this.context.lineTo(this.beginCods.x, this.beginCods.y - this.sizeDiagram.height );
    // Horizontal line
    this.context.moveTo(this.beginCods.x, this.beginCods.y);
    this.context.lineTo(this.sizeDiagram.width + this.beginCods.x, this.beginCods.y);
    
    this.context.strokeStyle = 'gray';
    this.context.stroke();
    this.context.closePath();

    this.drawHorizontalLinesAndMarks();
    
    this.drawBotHistory(); 
  }

  drawHorizontalLinesAndMarks() {  // Attention! static data are using in this function
    const stepY = 0.05;

    
    this.context.beginPath();

    for (let i = 0; i < ((this.sizeDiagram.height / COEFFICIENT)); i += stepY) {
      let y = this.beginCods.y - (COEFFICIENT * i);
      this.context.moveTo(this.beginCods.x, y);
      this.context.lineTo(this.sizeDiagram.width + this.beginCods.x, y);

      if (this.canvas.width < 530) {
        this.context.font = "10px Times New Roman"; 
        this.context.fillStyle = "black";
        this.context.fillText((i + 1.9).toFixed(2), this.beginCods.x - 21, y + 3.5);  
      }
      if(this.canvas.width >= 530) {
        this.context.font = "11px Times New Roman"; 
        this.context.fillStyle = "black";
        this.context.fillText((i + 1.9).toFixed(2), this.beginCods.x - 22, y + 3.5);
      }
    }

    this.context.lineWidth = 0.3;
    this.context.strokeStyle = 'gray';
    this.context.stroke();
    this.context.closePath();
  }

  drawBotHistory() {
    let dateFromArray = this.inputDateFrom.value.split('-');
    let dateToArray = this.inputDateTo.value.split('-');

    let dateFrom = new Date( dateFromArray[0], dateFromArray[1] - 1, dateFromArray[2] );
    let dateTo = new Date( dateToArray[0], dateToArray[1] - 1, dateToArray[2] );
    let differenceDatesInDays = ((dateTo - dateFrom)/1000/3600/24) + 1;

    let arrayZasechky = this.createArrayMarks(dateFrom, differenceDatesInDays);

    this.drawVerticalLines(arrayZasechky);

    let height = this.sizeDiagram.height;
    let width = this.sizeDiagram.width;
    let x0 = this.beginCods.x;
    let y0 = this.beginCods.y;

  
    this.drawVerticalMarks(arrayZasechky);
  }

  createArrayMarks(date, difference) {
    let result = [];

    for (let i = 7; i > 0; i--) {
      if (difference % i == 0) {
        for (let j = 0; j < i; j++) {
          result.push( `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}` );
          date.setDate( date.getDate() + (difference / i) );  
        }
        break; 
      }
    }

    return result;
  }

  drawVerticalMarks(arrayZasechky) {
    let stepX = this.sizeDiagram.width / arrayZasechky.length;

    this.context.beginPath();
    
    for (let i = this.beginCods.x, m = 0, count = 0; m < arrayZasechky.length; i += stepX) {
      

      this.context.font = "12px Times New Roman";
      this.context.fillStyle = "black";

      this.context.save();
      this.context.fillText(arrayZasechky[m], i + 5, this.beginCods.y + 20 );
      this.context.restore();

      count++;
      m++;
    }

    this.context.stroke();
    this.context.closePath();
  }

  drawVerticalLines(arrayZasechky) {
    let stepX = this.sizeDiagram.width / arrayZasechky.length;
    
    this.context.beginPath();

    for (let i = this.beginCods.x, j = 0; j < arrayZasechky.length; i += stepX) {

      j++;
      this.context.moveTo(i, this.beginCods.y + 17);
      this.context.lineTo(i, this.beginCods.y - this.sizeDiagram.height );
    }

    this.context.lineWidth = 1;
    this.context.strokeStyle = 'gray';
    this.context.stroke();
    this.context.closePath();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  eventsListener();
})

function eventsListener() {
  let currentlyDate = new Date();
  attachCanvasToUI();
  let ui = new UI();

  showTodayCurrencyRate(currentlyDate);
  ui.selecterCurrency.addEventListener('change', (event) => {
    showTodayCurrencyRate(currentlyDate);
  })

  // start fill template date
  let date = new Date();
  ui.inputDateTo.value = formatDate(date);
  date.setDate(date.getDate() - 119);
  ui.inputDateFrom.value =  formatDate(date);
  // end fill template date

  ui.setBackgrondCanvas();
  clearLocalStorage();

  window.addEventListener('resize', () => {
    getById('diagramCanvas').remove();
    attachCanvasToUI();
    ui = new UI();
    ui.setBackgrondCanvas();
    drawResizeDiagram();
  })

  ui.inputDateFrom.addEventListener('change', () => {
    ui.setBackgrondCanvas();
    clearLocalStorage();
  })

  ui.inputDateTo.addEventListener('change', () => {
    ui.setBackgrondCanvas();
    clearLocalStorage();
  })

  ui.buttonCreateDiagram.addEventListener('click', (event) => {
    let dateFromArray = ui.inputDateFrom.value.split('-');
    let dateToArray = ui.inputDateTo.value.split('-');

    let dateFrom = new Date( dateFromArray[0], dateFromArray[1] - 1, dateFromArray[2] );
    let dateTo = new Date( dateToArray[0], dateToArray[1] - 1, dateToArray[2] );

    if (dateTo - dateFrom <= 0) {
      alert('Вы ввели неверную дату'); // show error message
      return;
    }

    let differenceDatesInDays = ((dateTo - dateFrom)/1000/3600/24) + 1;

    if (differenceDatesInDays > 365) {
      pushingDatesToArrayMore365Days( dateFrom, differenceDatesInDays )
        .then( () => { 
          drawDiagram(differenceDatesInDays, ui.selecterCurrency.value); 
          localStorage.setItem(`${ui.selecterCurrency.value}`, JSON.stringify(ui.arrayDates));
        });
    } else {
      pushingDatesToArrayLess365Days( dateFrom, dateTo, differenceDatesInDays );
    }
  })

  ui.buttonSetWeek.addEventListener('click', (event) => {
    let date = new Date();
    ui.inputDateTo.value = formatDate(date);
    date.setDate(date.getDate() - 6);
    ui.inputDateFrom.value =  formatDate(date);

    ui.setBackgrondCanvas();
    clearLocalStorage();
  })

  ui.buttonSetMonth.addEventListener('click', (event) => {
    let date = new Date();
    ui.inputDateTo.value = formatDate(date);
    date.setDate(date.getDate() - 29);
    ui.inputDateFrom.value =  formatDate(date);

    ui.setBackgrondCanvas();
    clearLocalStorage();
  })

  ui.buttonSetYear.addEventListener('click', (event) => {
    let date = new Date();
    ui.inputDateTo.value = formatDate(date);
    date.setDate(date.getDate() - 364);
    ui.inputDateFrom.value =  formatDate(date);

    ui.setBackgrondCanvas();
    clearLocalStorage();
  })



  // functions

  function attachCanvasToUI() {
    getById('blockWithCanvas').innerHTML = `
    <canvas id="diagramCanvas" 
            width="${getById('blockWithCanvas').clientWidth}" 
            height="${getById('blockWithCanvas').clientWidth / 1.5}">
    </canvas>
    `;
    COEFFICIENT = getById('blockWithCanvas').clientWidth / 2.64;
  }
  function pushingDatesToArrayLess365Days( dateFrom, dateTo, difference) {
    let currency = CURRENCIES[ui.selecterCurrency.value];

    let url = `https://www.nbrb.by/API/ExRates/Rates/Dynamics/${currency}?startDate=${formatDate(dateFrom)}&endDate=${formatDate(dateTo)}`
    
    fetch(url)
      .then( (response) => {
        return response.json();
      })
      .then( (array) => {
        pushDatesToArray(array);

        localStorage.setItem(`${ui.selecterCurrency.value}`, JSON.stringify(ui.arrayDates));

        drawDiagram(difference, ui.selecterCurrency.value);
      });

    function pushDatesToArray(array) {
      ui.arrayDates = [];
      for (let i = 0; i < array.length; i++) {
        ui.arrayDates.push( highlightRate( array[i] ) );
      }
    }
  }

  function pushingDatesToArrayMore365Days(dateFrom, difference) {
    if (ui.arrayDates.length == difference) return;

    let currency = CURRENCIES[ui.selecterCurrency.value];

    return getData(dateFrom, currency)
      .then( (currencyValue) => {
        ui.arrayDates.push( highlightRate(currencyValue) );
        dateFrom.setDate( dateFrom.getDate() + 1);
        return pushingDatesToArrayMore365Days(dateFrom, difference);
      })
      .catch((error) => {
        console.error(`Загрузка не произошла по дате ${formatDate(dateFrom)}`)
        dateFrom.setDate( dateFrom.getDate() + 1);
        return pushingDatesToArrayMore365Days(dateFrom, difference);
      });
  }

  function showTodayCurrencyRate(date) {
    let currency = CURRENCIES[ui.selecterCurrency.value];
    let url = `https://www.nbrb.by/API/ExRates/Rates/${currency}?onDate=${formatDate(date)}&Periodicity=0`;
    fetch(url)
      .then( (response) => {
        return response.json();
      })
      .then( (currencyValue) => {
        ui.nowRate.innerHTML = highlightRate(currencyValue);
      });
  }

  function clearLocalStorage() {
    localStorage.setItem('USD', '0');
    localStorage.setItem('GBP', '0');
    localStorage.setItem('EUR', '0');
    localStorage.setItem('RUB', '0');
  }

  function drawResizeDiagram() {
    let dateFromArray = ui.inputDateFrom.value.split('-');
    let dateToArray = ui.inputDateTo.value.split('-');

    let dateFrom = new Date( dateFromArray[0], dateFromArray[1] - 1, dateFromArray[2] );
    let dateTo = new Date( dateToArray[0], dateToArray[1] - 1, dateToArray[2] );
    let differenceDatesInDays = ((dateTo - dateFrom)/1000/3600/24) + 1;

    for (const key in CURRENCIES) {
      if (localStorage.getItem(key)) {
        const element = CURRENCIES[key];
        if (localStorage.getItem(key)) {
          let array = JSON.parse(localStorage.getItem(key))
          ui.arrayDates = array;
          drawDiagram(differenceDatesInDays, key);
        }
      }
    }
    

  }
  function drawDiagram(difference, currency) {
    let array = ui.arrayDates;
    
    ui.context.beginPath();

    ui.context.moveTo(ui.beginCods.x, ui.beginCods.y - (COEFFICIENT * (array[0] - 1.9)) );
    let x = ui.beginCods.x;
    for (let i = 1; i < difference; i++) {
      x += ( ui.sizeDiagram.width/difference );
      y = ui.beginCods.y - (COEFFICIENT * (array[i] - 1.9));
      ui.context.lineTo(x, y);
      date.setDate(date.getDate() + 1);
    }

    if (ui.canvas.width < 530) ui.context.font = "9px Times New Roman"; 
    if (ui.canvas.width >= 530) ui.context.font = "0.65em Times New Roman"; 

    ui.context.fillStyle = `${COLORS[ui.countForDrawing]}`;
    ui.context.fillText(currency, x, y + 3.5);

    ui.context.lineWidth = 1;
    ui.context.strokeStyle = COLORS[ui.countForDrawing];
    ui.context.stroke();

    ui.arrayDates = [];
    ui.countForDrawing++;
  }
}

function getData(date, currentlyCurrency) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    let url = `https://www.nbrb.by/API/ExRates/Rates/${currentlyCurrency}?onDate=${formatDate(date)}&Periodicity=0`;
    request.open('GET', url); 
    request.onload = () => {
      if (request.status == 200) {
        resolve(JSON.parse(request.responseText));
      } else {
        let error = new Error( request.statusText );
        error.code = request.status;
        reject(error);
      }
    }
    request.onerror = () => {
      reject( new Error('Network Error') );
    };
    request.send();
  })
}

function highlightRate(response) {
  let result = response.Cur_OfficialRate;
  return result;
} 

function formatDate(date) {
  let month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${date.getFullYear()}-${month}-${day}`;
}
