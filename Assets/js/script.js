//STILL TODO - GET RANDOM.ORG TO WORK INSTEAD OF rando.js // Animation swag? // Actually style the sheet?
const inputForm = document.querySelector(".inputform")
const inputString = document.querySelector(".inputstring")
const inputBtn = document.querySelector(".inputbtn")
const diceResults = document.querySelector(".results")
const tutorialBtn = document.querySelector(".tutorial")

tutorialBtn.addEventListener("click", tutorial)
inputBtn.addEventListener("click", rollDice)

//run our program
function rollDice(e){
e.preventDefault()
if (!inputString.value) return
if (inputString.value.match(/[a-ce-z$&,:;=?@#|'<>.^()%\\]/)) return
if (inputString.value[inputString.value.length-1].match(/[+,*,/,-]/)) return
const unsplitDiceArrays = diceRaw(inputString.value) // 3d6, 3d6
const operationArray = operationSplit(inputString.value) // +
const splitDiceArrays = diceSplit(unsplitDiceArrays) // [3,6], [3,6]
const sizeArrays = findSize(splitDiceArrays) // [6, 6]
const rolledDice = diceRoll(splitDiceArrays) // [6,3,1] [6,4,2]
const addedDice = addDice(rolledDice) // [10,12]
const diceTotal = computeDice(addedDice, operationArray) // 22
writeResults(rolledDice, operationArray, diceTotal, sizeArrays, addedDice)
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

    if(size == null) return [parseInt(quantity)]
    if(size.includes("!")) {
        size = size.replace("!","")
        explosionFlag = true
    }

    const rolled = []
    for (let i=0; i<quantity; i++){
        const roll = rando(1,parseInt(size))
        rolled.push(roll)
        if(roll == size && explosionFlag == true) i--
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

    diceResults.appendChild(newDiv)
}

//color-codes our results
function findColor(die, i, sizeArrays){
    if (die == sizeArrays[i].replace("!","")) return "green"
    if (die == 1) return "red"
}

//cool modal thing -- really should just use bootstrap or whatever
function tutorial(e) {
    e.preventDefault()
    e.stopPropagation()
    window.document.removeEventListener("click", tutorial)
    const tutorialScreen = document.querySelector(".tutorialscreen")

    if(tutorialScreen.classList.contains("show")){
        tutorialScreen.classList.remove("show")
        inputForm.classList.remove("dim")
        diceResults.classList.remove("dim")
        return
    }

    if (!tutorialScreen.classList.contains("show")){
        tutorialScreen.classList.add("show")
        inputForm.classList.add("dim")
        diceResults.classList.add("dim")
        window.document.addEventListener("click", tutorial)
        tutorialScreen.addEventListener("click", (e)=>{
            e.stopPropagation()
        })
    }
}

