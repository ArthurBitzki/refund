const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

const expenseList = document.querySelector("ul")

const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

//no input onde vai o valor da dispesa, ele verifica e capta somente numeros e transforma o valor em real
amount.oninput = () =>{
    let value = amount.value.replace(/\D/g, "")

    value = Number(value) / 100

    amount.value = formatoBRL(value)
}

function formatoBRL(value){
    value = value.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
    })
    return value
}

form.onsubmit = (event) =>{
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)
} //no submit ele vai criar esse objeto ai

function expenseAdd(newExpense){
    try{
        const expenseItem = document.createElement("li") //cria um li
        expenseItem.classList.add("expense") //add uma classe nele

        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}` //cria um small(com css formatado) e remove o "R$" que vem automatico do formato

        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src","img/remove.svg")
        
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon) //adiciona tudo isso no expenseIem(um li)
        expenseList.append(expenseItem) //adiciona o li na Ul
        expenseInfo.append(expenseName, expenseCategory)

        formClear()

        updateTotal()
    }catch(error){
        alert("não foi possivel atualizar a lista")
    }
}
function updateTotal(){
    try{
        const items = expenseList.children // pega quantos "li" tem a "Ul"e salva em items 

        expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        let total = 0

        for(let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount") //selecionando onde tem o valor

            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".") //deixando formatado

            value = parseFloat(value) 

            if(isNaN(value)){
                return alert("Não foi possivel calcular o total")
            }
            total += Number(value)
        }
        
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        total = formatoBRL(total).toUpperCase().replace("R$", "")
        
        expenseTotal.innerHTML = ""
        expenseTotal.append(symbolBRL, total)
    }catch(error){
        alert("não foi possivel atualizar os totais")
    }
}

expenseList.addEventListener("click", function(event){ //adicionou o evento de click da lista toda
    if(event.target.classList.contains("remove-icon")){ //verifica se o click tem a classe "remove-icon"
        const item = event.target.closest(".expense")
        item.remove()
    }
    updateTotal()
})

function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = "" 
}