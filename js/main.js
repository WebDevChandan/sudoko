const crt_pg = document.querySelector("#crt_pg");
const pg_size = document.querySelector('#pg_size');
const playground = document.querySelector('#playGround');
const rsltBx = document.querySelector('.resultBox');

//SUDOKO PLAYGROUND playGroundArray:-
let playGroundArr = [],
    allInputValues = [];


//SUDOKO PLAYGROUND CREATION:
const createPlayground = (size) => {
    playGroundArr = [];

    while (playground.childNodes.length) {
        playground.removeChild(playground.firstChild);
    }


    for (let i = 0; i < size; i++) {
        playGroundArr.push(new Array(size));
    }

    //RENDER BOXES
    for (let i = 0; i < size ** 2; i++) {


        if ((i) % size === 0 && i >= size)
            playground.append(document.createElement('br'));

        const inputBox = document.createElement('input');

        inputBox.setAttribute('type', 'text');
        inputBox.setAttribute('class', 'input_box');
        inputBox.setAttribute('id', `${i}`);
        playground.append(inputBox);

        // To generate a random number between 1 and 2, you can multiply the result of Math.random() by the range (2 - 1 = 1) and then add the minimum value (1).
        let randomPosition = Math.round(Math.random() * (2 - 1) + 1);

        if (randomPosition % 2 === 0) {
            setDefaultVal(size);

        }
    }

    playground.append(document.createElement('br'));

    const checkBtn = document.createElement('button');
    checkBtn.setAttribute('class', "checkBtn");
    checkBtn.innerHTML = "Check Result";
    checkBtn.setAttribute('onclick', `showResult(${size})`);
    playground.append(checkBtn);

}

//Create playground
const createPG = () => {
    let size = strToNum(pg_size.value);

    if (size && size < 11 && size > 1)
        createPlayground(size);
    else
        return alert("Enter Valid Number Between 1 to 5");
}

const makDefaultValUniq = (size) => {
    let rowMap = {},
        colMap = {};

    //Make Row Unique
    for (let i = 0; i < playGroundArr.length; i++) {
        for (let j = 0; j < playGroundArr[i].length; j++) {
            if (rowMap[playGroundArr[i][j]])
                playGroundArr[i][j] = "X";
            else
                rowMap[playGroundArr[i][j]] = 1;
        }
        rowMap = {};
    }

    //Make Column Unique
    for (let j = 0; j < playGroundArr.length; j++) {
        for (let i = 0; i < playGroundArr[j].length; i++) {
            if (colMap[playGroundArr[i][j]])
                playGroundArr[i][j] = "X";
            else
                colMap[playGroundArr[i][j]] = 1;
        }
        colMap = {};
    }

    //If all value filled with default values
    let emptyHashMap = {};

    for (let i = 0; i < playGroundArr.length; i++) {
        let j = 0;
        for (j; j < playGroundArr[i].length; j++) {
            if (emptyHashMap[playGroundArr[i][j]]) {
                emptyHashMap[playGroundArr[i][j]] += 1;
            } else {
                emptyHashMap[playGroundArr[i][j]] = 1;
            }
        }

        if (!emptyHashMap.hasOwnProperty('X')) {
            playGroundArr[i][j - 1] = "X";
        }

        if (emptyHashMap['X'] == size)
            playGroundArr[i][j - 1] = Math.round(Math.random() * (size - 1) + 1);

        emptyHashMap = {};
    }

    // If all any columns fully empty or Filled with default Value
    for (let j = 0; j < playGroundArr.length; j++) {
        let i = 0;
        for (i; i < playGroundArr[j].length; i++) {
            if (emptyHashMap[playGroundArr[i][j]]) {
                emptyHashMap[playGroundArr[i][j]] += 1;
            } else {
                emptyHashMap[playGroundArr[i][j]] = 1;
            }
        }

        // If all full with Numbers or having only One 'X' (if size >2)
        if (!emptyHashMap.hasOwnProperty('X')) {
            playGroundArr[i - 1][j] = "X";
        }

        if (emptyHashMap['X'] == size)
            playGroundArr[i - 1][j] = Math.round(Math.random() * (size - 1) + 1);

        emptyHashMap = {};
    }

    renderDefaultVal();
    allInputValues = [];
}

const setDefaultVal = (size) => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            playGroundArr[i][j] = Math.round(Math.random() * (size - 1) + 1);
        }
    }

    makDefaultValUniq(size);
}

const renderDefaultVal = () => {
    allInputValues = [];
    for (let i = 0; i < playGroundArr.length; i++) {
        for (let j = 0; j < playGroundArr.length; j++) {
            allInputValues.push(playGroundArr[i][j]);
        }
    }

    let getValCount = 0;
    playground.childNodes.forEach(child => {
        if (child.tagName === 'INPUT') {
            child.value = allInputValues[getValCount] === "X" ? "" : allInputValues[getValCount];
            getValCount++;
        }

    })
}
//Create Playground on click 'Create' btn
crt_pg.addEventListener('click', () => {
    createPG();
});

//Create Playground on Press 'Enter' Key
pg_size.addEventListener('keyup', (e) => {
    e.key === "Enter" ? createPG() : null;
})

//Change value String to Number 
const strToNum = (str) => {
    return parseInt(str);
}

//Checking values in the Playground Valid or Not
const checkValidAllValues = () => {
    let inValidValues = true;
    playground.childNodes.forEach((child) => {
        if (child.tagName === 'INPUT') {
            inputValue = strToNum(child.value);
            if (!inputValue) {
                inValidValues = false;
            }
            allInputValues.push(inputValue);
        }
    })
    return inValidValues;
}

//Setting playground playGroundArray Values
const setplayGroundArrVals = (pgSize) => {

    let tempSize = pgSize;
    for (let i = 0; i < playGroundArr.length; i++) {
        for (let j = 0; j < playGroundArr[i].length; j++) {
            playGroundArr[i][j] = allInputValues[allInputValues.length - tempSize];
            tempSize--;
        }
    }
}

//SHOW RESULT:
const showResult = (size) => {
    allInputValues = [];

    if (!checkValidAllValues())
        return alert("All values should be Number");

    setplayGroundArrVals(size ** 2);

    //ROW Check:
    let rowCheck = true;
    for (let i = 0; i < playGroundArr.length; i++) {
        for (let k = 1; k <= size; k++) {
            if (!playGroundArr[i].includes(k))
                rowCheck = false;
        }
    }

    if (!rowCheck)
        return togglePopUp("WRONG");

    //COLUMN CHECK:
    for (let j = 0; j < playGroundArr.length; j++) {
        let colplayGroundArr = [];

        for (let i = 0; i < playGroundArr[j].length; i++) {
            colplayGroundArr.push(playGroundArr[i][j]);
        }

        for (let k = 1; k <= size; k++) {
            if (!colplayGroundArr.includes(k))
                return togglePopUp("WRONG");
        }
    }

    togglePopUp("CORRECT");
}

const togglePopUp = (result) => {
    rsltBx.removeChild(rsltBx.lastChild);
    const msgHTML = `<p class="message">${result}</p>`;
    rsltBx.insertAdjacentHTML("beforeend", msgHTML);

    const showResultBx = document.querySelector('.show_result');
    showResultBx.classList.toggle('hide');

    if (result === "CORRECT")
        showResultBx.style.background = "linear-gradient(175deg, #4CAF50, #4CAF50)";
    else
        showResultBx.style.background = "linear-gradient(175deg, #ad0909, #ad0909)";
}

document.querySelector('.cross').addEventListener('click', () => {
    document.querySelector('.show_result').classList.toggle('hide');
})
