const btnCart = document.querySelector('.container-cart-icon'); 
const containerCartProducts = document.querySelector('.container-cart-products'); 
const cartInfo = document.querySelector('.cart-product'); 
const rowProduct = document.querySelector('.row-product'); 
const productsList = document.querySelector('.container-items'); 
let allProducts = JSON.parse(localStorage.getItem('cartProducts')) || []; 
const valorTotal = document.querySelector('.total-pagar'); 
const countProducts = document.querySelector('#contador-productos'); 
const cartEmpty = document.querySelector('.cart-empty'); 
const cartTotal = document.querySelector('.cart-total'); 
 
btnCart.addEventListener('click', () => { 
  containerCartProducts.classList.toggle('hidden-cart'); 
}); 
 
productsList.addEventListener('click', e => { 
  if (e.target.classList.contains('btn-add-cart')) { 
    const product = e.target.parentElement; 
    const infoProduct = { 
      quantity: 1, 
      title: product.querySelector('h2').textContent, 
      price: product.querySelector('p').textContent, 
    }; 
    const exists = allProducts.some(product => product.title === infoProduct.title); 
    if (exists) { 
      const products = allProducts.map(product => { 
        if (product.title === infoProduct.title) { 
          product.quantity++; 
          return product; 
        } else { 
          return product; 
        } 
      }); 
      allProducts = [...products]; 
    } else { 
      allProducts = [...allProducts, infoProduct]; 
    } 
    localStorage.setItem('cartProducts', JSON.stringify(allProducts)); 
    showHTML(); 
  } 
}); 
 
rowProduct.addEventListener('click', e => { 
  if (e.target.classList.contains('icon-close')) { 
    const product = e.target.parentElement; 
    const title = product.querySelector('p').textContent; 
    allProducts = allProducts.filter(product => product.title !== title); 
    localStorage.setItem('cartProducts', JSON.stringify(allProducts)); 
    showHTML(); 
  } 
}); 

// Retrieve cart data from localStorage on page load 
window.addEventListener('load', () => { 
  allProducts = JSON.parse(localStorage.getItem('cartProducts')) || []; 
  showHTML(); 
});

const showHTML = () => { 
  if (!allProducts.length) { 
    cartEmpty.classList.remove('hidden'); 
    rowProduct.classList.add('hidden'); 
    cartTotal.classList.add('hidden'); 
  } else { 
    cartEmpty.classList.add('hidden'); 
    rowProduct.classList.remove('hidden'); 
    cartTotal.classList.remove('hidden'); 
  } 
  rowProduct.innerHTML = ''; 
  let total = 0; 
  let totalOfProducts = 0; 
  allProducts.forEach(product => { 
    const containerProduct = document.createElement('div'); 
    containerProduct.classList.add('cart-product'); 
    containerProduct.innerHTML = ` 
      <div class="info-cart-product"> 
        <span class="cantidad-producto-carrito">${product.quantity}</span> 
        <p class="titulo-producto-carrito">${product.title}</p> 
        <span class="precio-producto-carrito">${product.price}</span> 
      </div> 
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close"> 
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/> 
      </svg> 
    `; 
    rowProduct.append(containerProduct); 
    total += parseInt(product.quantity * product.price.slice(1)); 
    totalOfProducts += product.quantity; 
  }); 
  valorTotal.innerText = `$${total}`; 
  countProducts.innerText = totalOfProducts; 
};



/* COMENTARIOS */
let comments = [];

const inputContainer = document.createElement("div");
const input = document.createElement("input");
input.classList.add("input");
const commentsContainer = document.querySelector("#comments-container");

commentsContainer.appendChild(inputContainer);
inputContainer.appendChild(input);

input.addEventListener("keydown", (e) => {
  handleEnter(e, null);
});

function handleEnter(e, current) {
  if (e.key === "Enter" && e.target.value !== "") {
    const newComment = {
      text: e.target.value,
      likes: 0,
      responses: [],
    };
    if (current === null) {
      comments.unshift(newComment);
    } else {
      current.responses.unshift(newComment);
    }

    // Simulación de una tarea asíncrona utilizando una promesa y Fetch para consumir la API
    const promise = new Promise((resolve, reject) => {
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject(new Error('Error en la solicitud'));
        }
      })
      .catch(error => {
        reject(error);
      });
    });

    promise
      .then(() => {
        e.target.value = "";
        commentsContainer.innerHTML = "";
        commentsContainer.appendChild(inputContainer);
        renderComments(comments, commentsContainer);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

function renderComments(arr, parent) {
  arr.forEach((element) => {
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("comment-container");
    const responsesContainer = document.createElement("div");
    responsesContainer.classList.add("responses-container");
    const replyButton = document.createElement("button");
    const likeButton = document.createElement("button");

    replyButton.textContent = "Reply";
    likeButton.textContent = `${element.likes > 0 ? element.likes : ""} Likes`;

    likeButton.addEventListener("click", (e) => {
      element.likes++;
      likeButton.textContent = `${element.likes > 0 ? element.likes : ""} Likes`;

      // Actualizamos los comentarios en el almacenamiento local.
      localStorage.setItem("comments", JSON.stringify(comments));
    });

    replyButton.addEventListener("click", (e) => {
      const newInput = inputContainer.cloneNode(true);
      newInput.value = "";
      newInput.focus();
      newInput.addEventListener("keydown", (e) => {
        handleEnter(e, element);
      });
      commentContainer.insertBefore(newInput, responsesContainer);
    });

    const divContent = document.createElement("div");
    divContent.textContent = element.text;
    const divActions = document.createElement("div");
    commentContainer.appendChild(divContent);
    commentContainer.appendChild(divActions);
    divActions.appendChild(replyButton);
    divActions.appendChild(likeButton);
    commentContainer.appendChild(responsesContainer);

    // Si hay respuestas a este comentario, las renderizamos recursivamente.
    if (element.responses.length > 0) {
      renderComments(element.responses, responsesContainer);
    }

    parent.appendChild(commentContainer);
  });
}

// Obtenemos los comentarios del almacenamiento local al cargar la página
comments = JSON.parse(localStorage.getItem("comments")) || [];

renderComments(comments, commentsContainer);

