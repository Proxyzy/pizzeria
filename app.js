var pizzas = []

var sortDecend = false;

window.onload = function () {
    document.getElementById('btn-modal').addEventListener('click', function () {
        document.getElementById('overlay').classList.add('is-visible');
        document.getElementById('modal').classList.add('is-visible');
    });

    document.getElementById('close-btn').addEventListener('click', function () {
        document.getElementById('overlay').classList.remove('is-visible');
        document.getElementById('modal').classList.remove('is-visible');
    });

    document.getElementById('overlay').addEventListener('click', function () {
        document.getElementById('overlay').classList.remove('is-visible');
        document.getElementById('modal').classList.remove('is-visible');
    });

    getElementsFromSession()

    render()

    var newPizza = {
        name: "",
        price: 0,
        heat: 0,
        toppings: "",
        photo: ""
    }

    var formPname = document.getElementById("pname");
    var formPrice = document.getElementById("price");
    var formHeat = document.getElementById("heat");
    var formToppings = document.getElementById("toppings");


    formPname.addEventListener("input", function () {
        newPizza.name = formPname.value
    })

    formPrice.addEventListener("input", function () {
        var price = formPrice.value;
        newPizza.price = price
    })

    formHeat.addEventListener("input", function () {
        newPizza.heat = formHeat.value
    })

    formToppings.addEventListener("input", function () {
        newPizza.toppings = stringToArray(formToppings.value)
    })

    var rad = document.getElementsByName("imagerad");
    for (var i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function () {
            newPizza.photo = this.value
        });
    }

    document.getElementById("heatcheck").addEventListener("change", () => {
        if (document.getElementById("heatcheck").checked == true) {
            document.getElementById("heat").disabled = false;
        } else {
            document.getElementById("heat").value = '';
            document.getElementById("heat").disabled = true;
        }
    })



    var form = document.getElementById("pizzaForm")

    form.addEventListener("submit", (e) => {
        let message = []
        if (formPname.value === '' || formPname.value == null) {
            message.push('Pizza name is required')
        }
        if (formPname.value.length > 30) {
            message.push('Pizza name can have maximum of 30 characters')
        }
        if (!isUnique(formPname.value)) {
            message.push('Pizza name must be unique')
        }
        if (formPrice.value == null) {
            message.push('Pizza price is required')
        }
        if (formPrice.value < 0) {
            message.push('Pizza price can not be negative')
        }
        if (stringToArray(formToppings.value).length < 2) {
            message.push('You need at least 2 toppings')
        }
        if (message.length > 0) {
            e.preventDefault();
            alert(message.join(', '))
        } else {
            form.reset();
            if (pizzas == null) {
                pizzas = [newPizza]
            } else {
                pizzas.push(newPizza);
            }
            setElementsToSession();
            newPizza = {
                name: "",
                price: 0,
                heat: 0,
                toppings: "",
                photo: ""
            }
            render()
        }
    })
    
    document.getElementById("nameHead").addEventListener("click", sortName)
    document.getElementById("priceHead").addEventListener("click", sortPrice)
    document.getElementById("heatHead").addEventListener("click", sortHeat)
}


function render() {
    const myNode = document.getElementById("list");
    myNode.innerHTML = ""
    if (pizzas != null)
        for (i = 0; i < pizzas.length; i++) {
            displayPizza(pizzas[i].name, pizzas[i].price, pizzas[i].heat, pizzas[i].toppings, pizzas[i].photo)
        }
}

function getElementsFromSession() {
    pizzas = JSON.parse(sessionStorage.getItem("pizzas"));
}

function setElementsToSession() {
    sessionStorage.setItem("pizzas", JSON.stringify(pizzas));
}

function displayPizza(name, price, heat, toppings, photo) {
    const para = document.createElement('li')
    para.className = 'table-row';

    const nameDiv = document.createElement('div')
    const nameNode = document.createTextNode(name);
    nameDiv.className = 'col col-1';
    nameDiv.appendChild(nameNode);
    if (heat > 0) {
        for (var i = 0; i < heat; i++) {
            const imgElement = document.createElement('img')
            imgElement.src = "chili-pepper-svgrepo-com.svg";
            nameDiv.appendChild(imgElement);
        }
    }
    para.appendChild(nameDiv);

    const priceDiv = document.createElement('div')
    const priceNode = document.createTextNode("$" + price);
    priceDiv.className = 'col col-2';
    priceDiv.appendChild(priceNode);
    para.appendChild(priceDiv);

    const toppingDiv = document.createElement('div')
    var toppingString = ""
    for (var i = 0; i < toppings.length; i++) {
        if (i === 0)
            toppingString = toppings[i]
        else
            toppingString = toppingString + ", " + toppings[i]
    }
    const toppingNode = document.createTextNode(toppingString);
    toppingDiv.className = 'col col-3';
    toppingDiv.appendChild(toppingNode);
    para.appendChild(toppingDiv);

    const photoDiv = document.createElement('div');
    const photoImg = document.createElement('img');
    photoImg.src = photo
    photoImg.className = 'pizza-img'
    photoDiv.className = 'col col-4';
    photoDiv.appendChild(photoImg);
    para.appendChild(photoDiv);

    const deleteDiv = document.createElement('div')
    var deleteButton = document.createElement('button')
    deleteButton.value = name
    deleteButton.onclick = () => deleteElement(name)

    deleteDiv.className = 'col col-5'
    deleteButton.textContent = "Remove"
    deleteDiv.appendChild(deleteButton)
    para.appendChild(deleteDiv)

    const element = document.getElementById("list");
    element.appendChild(para);
}

function deleteElement(name) {
    getElementsFromSession()
    const conf = confirm("Are you sure about that?")
    if (pizzas != null && conf) {
        for (var i = 0; i < pizzas.length; i++) {
            if (name == pizzas[i].name) {
                pizzas.splice(i, 1)
                setElementsToSession();
            }
        }
    }
    render()
}

function sortName() {
    if (!sortDecend) {
        pizzas = pizzas.sort(function (a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
            if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
            return 0;
        })
    } else {
        pizzas = pizzas.sort(function (b, a) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
            if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
            return 0;
        })
    }
    sortDecend = !sortDecend
    render()
}

function sortPrice() {
    if (!sortDecend) {
        pizzas = pizzas.sort(function (a, b) {
            if (a.price < b.price) { return -1; }
            if (a.price > b.price) { return 1; }
            return 0;
        })
    } else {
        pizzas = pizzas.sort(function (b, a) {
            if (a.price < b.price) { return -1; }
            if (a.price > b.price) { return 1; }
            return 0;
        })
    }
    sortDecend = !sortDecend
    render()
}

function sortHeat() {
    if (!sortDecend) {
        pizzas = pizzas.sort(function (a, b) {
            if (a.heat < b.heat) { return -1; }
            if (a.heat > b.heat) { return 1; }
            return 0;
        })
    } else {
        pizzas = pizzas.sort(function (b, a) {
            if (a.heat < b.heat) { return -1; }
            if (a.heat > b.heat) { return 1; }
            return 0;
        })
    }
    sortDecend = !sortDecend
    render()
}

function isUnique(string) {
    if (pizzas == null) {
        return true
    } else {
        for (i = 0; i < pizzas.length; i++) {
            if (pizzas[i].name.toLowerCase() == string.toLowerCase()) {
                return false
            }
        }
        return true
    }
}

function stringToArray(string) {
    var elementArray = string.split(', ')
    return elementArray
}