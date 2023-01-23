//cool modal thing -- really should just use bootstrap or whatever
export function tutorialModal(e) {
    e.preventDefault()
    e.stopPropagation()
    window.document.removeEventListener("click", tutorialModal)
    const tutorialScreen = document.querySelector(".tutorialscreen")
    const inputForm = document.querySelector(".inputform")
    const diceResults = document.querySelector(".results")

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
        window.document.addEventListener("click", tutorialModal)
        tutorialScreen.addEventListener("click", (e)=>{
            e.stopPropagation()
        })
    }
}