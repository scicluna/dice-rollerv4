//import my cool modal
import { tutorialModal } from "./modal.js"

//DOMS
const inputString = document.querySelector(".inputstring")
const inputBtn = document.querySelector(".inputbtn")
const diceResults = document.querySelector(".results")
const tutorialBtn = document.querySelector(".tutorial")
const clearBtn = document.querySelector(".clear")

//button event listeners
tutorialBtn.addEventListener("click", tutorialModal)
clearBtn.addEventListener("click", clearAll)
inputBtn.addEventListener("click", rollDice)

//run our program
function rollDice(e){
e.preventDefault()
if(guardChecks(inputString.value)) return
const unsplitDiceArrays = diceRaw(inputString.value) // 3d6, 3d6
const operationArray = operationSplit(inputString.value) // +
const splitDiceArrays = diceSplit(unsplitDiceArrays) // [3,6], [3,6]
const sizeArrays = findSize(splitDiceArrays) // [6, 6]
const rolledDice = diceRoll(splitDiceArrays) // [6,3,1] [6,4,2]
const addedDice = addDice(rolledDice) // [10,12]
const diceTotal = computeDice(addedDice, operationArray) // 22
writeResults(rolledDice, operationArray, diceTotal, sizeArrays, addedDice)
}
//guard clauses to restrict input
function guardChecks(input){
    if (!input) return true
    if (input.match(/[a-ce-zA-Z$&,:;=?@#|'<>^()%\\]/)) return true
    if (input[input.length-1].match(/[+,*,/,-,d,.]/)) return true
}
//find our raw dice inputs
function diceRaw(input){return input.split(/[-+*\/]/)}

//keep track of our operations for later computation
function operationSplit(input){return input.split("").filter(character=>character.match(/[-+*\/]/))}

//process our raw dice inputs by eliminating the d
function diceSplit(dicearray){return dicearray.map(dice=>dice.split("d"))}

//make an array of dice sizes
function findSize(dicearray){return dicearray.map(dice=>dice[1])}

//roll our dice
function diceRoll(dice){return dice.map(die=>rollDie(die))}

//add each dice array together
function addDice(rolledDice){return rolledDice.map(dice=>dice.reduce((total, item)=>total+item))}

//handles dice rolling
function rollDie(die){
    let [quantity, size, drop] = die
    let explosionFlag = false

    if(size == null) return [parseFloat(quantity)]
    if(size.includes("!")) {
        size = size.replace("!","")
        explosionFlag = true
    }
    const rolled = []
    for (let i=0; i<quantity; i++){
        const roll = rando(1,parseInt(size))
        rolled.push(roll)
        if(roll == size && explosionFlag == true &&  size != 1) i--
    }
    rolled.sort((a, b) => b-a)
    if(drop != null) rolled.splice((rolled.length-drop), drop)
    
    return rolled
}

//adds, subtracts, multiplies, or divides dice
function computeDice(addedDice, operationArray){
    let total = addedDice[0]
    for (let i=1; i<addedDice.length; i++){
        switch(operationArray[i-1]){
            case "+": total += addedDice[i]
            break

            case "-": total -= addedDice[i]
            break

            case "*": total *= addedDice[i]
            break

            case "/": total /= addedDice[i]
            break

            default: break
        }
    }
    return total
}

//writes our results to the DOM
function writeResults(rolledDice, operationArray, diceTotal, sizeArrays, addedDice){
    const newDiv = document.createElement("div")

    rolledDice.forEach((dice, i)=>{
        if (dice.length > 30) {
            const newP = document.createElement("i")
            newP.innerText = addedDice[i]
            newDiv.appendChild(newP)
        } else{
            dice.forEach(die=>{
                const newP = document.createElement("p")
                newP.innerText = die
                const color = findColor(die, i, sizeArrays)
                if (color) newP.classList.add(color)
                newDiv.appendChild(newP)
            })}
        if(operationArray[i]){
            const newOp = document.createElement("p")
            newOp.innerText = operationArray[i]
            newDiv.appendChild(newOp)
        }
    })
    const newBold = document.createElement("b")
    newBold.innerText = diceTotal
    newDiv.appendChild(newBold)

    diceResults.prepend(newDiv)
}

//color-codes our results
function findColor(die, i, sizeArrays){
    if (sizeArrays[i] == null) return
    if (die == sizeArrays[i].replace("!","")) return "max"
    if (die == 1) return "min"
}

function clearAll(){
    diceResults.innerHTML = ""
    inputString.value = ""
}


