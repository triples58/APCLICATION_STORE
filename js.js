if (typeof Storage !== "undefined") {
    console.log("LocalStorage is supported.");
} else {
    console.error("LocalStorage is not supported in this browser.");
} 


const api_url = "https://fakestoreapi.com/products"

const search_input = document.getElementById("search")
const category_select = document.getElementById("category")
const products_conteiner = document.getElementById("products")
const caunt_products = document.querySelector(".caunt_products")
const caunt = document.querySelector(".caunt")



// Функция для получения данных из api
async function fetch_products(){
    try {
        const responce = await fetch(api_url)
        return await responce.json()

    } catch (error) {
        console.error(error)
        return []
    }
}

// Функция для загрузки категорий 
async function fetch_categories(){
    try {
        const responce = await fetch(`${api_url}/categories`)
        return await responce.json()
    } catch (error) {
    console.error(error)
    return []        
    }
}

// Функция для отображения продуктов 
// function render_products(products){
//     products_conteiner.innerHTML = ""
//     caunt_products.innerHTML = ""
//     if (products.length === 0){
//         products_conteiner.innerHTML = `<p>Products not found</p>`
//         return
//     }
//     products.forEach(({id,title,price,image,category}) => {
//         const products_element = document.createElement("div")
//         products_element.className = "cards_products"
//         products_element.innerHTML = `
//         <img class="photo" src="${image}" alt="photo">
//         <h2 class="h2_wrapper">${title}</h2>
//         <p class="p_wrapper1">${category}</p>
//         <p class="p_wrapper">${price}$</p>
//         <button class="btn_add">Add Cart</button>
//         `
        
//         products_conteiner.appendChild(products_element)
//     });
//     caunt_products.innerHTML = products.length
// }

function render_products(products) {
    products_conteiner.innerHTML = "";
    caunt_products.innerHTML = "";
    if (products.length === 0) {
        products_conteiner.innerHTML = `<p>Products not found</p>`;
        return;
    }
    products.forEach(({ id, title, price, image, category }) => {
        const products_element = document.createElement("div");
        products_element.className = "cards_products";

        // Добавляем отдельный div для фото
        products_element.innerHTML = `
        <div class="photo_wrapper">
            <img class="photo" src="${image}" alt="photo">
        </div>
        <h2 class="h2_wrapper">${title}</h2>
        <p class="p_wrapper1">${category}</p>
        <p class="p_wrapper">${price}$</p>
        <button 
                class="btn_add" 
                data-id="${id}"
                data-title="${title}" 
                data-price="${price}" 
                data-image="${image}" 
                data-category="${category}"
            >
                Add to Cart
            </button>
        `;

        products_conteiner.appendChild(products_element);
    });
    caunt_products.innerHTML = products.length;
}
function addToCart(id, title, price, image, category) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
        console.warn("Ошибка чтения из localStorage:", e);
        localStorage.removeItem("cart");
    }

    cart.push({ id, title, price, image, category });
    localStorage.setItem("cart", JSON.stringify(cart));
    show_not(`${title} added to Cart`);
    update_cart_caunt()
}


products_conteiner.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn_add")) {
        const button = e.target;
        const id = button.dataset.id;
        const title = button.dataset.title;
        const price = button.dataset.price;
        const image = button.dataset.image;
        const category = button.dataset.category;

        addToCart(id, title, price, image, category);
    }
});


// Функция по фильтрации по категории и поиску 
function filter_products(products){
    const search_text = search_input.value.toLowerCase()
    const select_category = category_select.value
    return products.filter(({title,category}) => {
        const match_category = select_category === "all" || category === select_category
        const match_search = title.toLowerCase().includes(search_text)
        return match_category && match_search
    })
} 




function update_cart_caunt(){
    try {
        const cart = JSON.parse(localStorage.getItem("cart")) || []
        caunt.textContent = cart.length
    } catch (error) {
        console.warn("error local storage")
        caunt.textContent = 0
    }
}


// Функция запуска приложения

async function init(){
 const products = await fetch_products()
 const categories = await fetch_categories()
 categories.forEach(el => {
    const option = document.createElement("option")
    option.value = el
    option.textContent = el
    category_select.appendChild(option)
 })
 render_products(products)
 search_input.addEventListener("input", () => render_products(filter_products(products)))
 category_select.addEventListener("change", () => render_products(filter_products(products)))
}
init()

function show_not(mass){
    const notification = document.getElementById("notification")
    const massage = document.getElementById("massage")
    massage.textContent = mass
    notification.classList.remove("hiden")
    notification.classList.add("visible")
    setTimeout(() => {
        notification.classList.remove("visible")
        notification.classList.add("hiden")
    }, 3000)
}

