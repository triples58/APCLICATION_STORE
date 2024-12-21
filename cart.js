const cart_products = document.querySelector(".cart_products")
const reset_cart = document.querySelector(".reset_cart")
const total_summ = document.querySelector(".total_summ")






function render_cart (){
	const cart = JSON.parse(localStorage.getItem("cart")) || []
	let total_price = 0
	if(cart.length === 0){
		cart_products.innerHTML = `<p>Корзина пуста</p>`
		total_summ.textContent = `Total: ${total_price}`
		return
	}
	const cart_html = cart.map(({ id, title, price, image, category }, index) => {
		total_price += +price 
		console.log(typeof +price);
		
		return `
		<div class="cart_item">
		<div class="photo_wrapper">
		<img class="cart_photo" src="${image}" alt="photo">
		</div>
		<h3 class="cart_title">${title}</h3>
		<p class="cart_price">${price}$</p>
		<button class="remove_cart" onclick="remove_products(${index})">Удалить</button>
		</div>
		`
	}).join("") 
	cart_products.innerHTML = cart_html
	total_summ.textContent = `Total: ${total_price.toFixed(2)}`
}

function remove_products(index){
	const cart = JSON.parse(localStorage.getItem("cart")) || []
	cart.splice(index, 1)
	localStorage.setItem("cart", JSON.stringify(cart))
	render_cart()
}


render_cart()

function reset_cart_f(){
	localStorage.removeItem("cart")
	render_cart()
}
reset_cart.addEventListener("click", reset_cart_f)
