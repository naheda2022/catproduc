(function(){
    const formElm = document.querySelector('form')
const nameInputElm = document.querySelector('.product-name')
const priceInputElm = document.querySelector('.product-price')
const listGroupElm = document.querySelector('.list-group')
const filterElm = document.querySelector('#filter')
const submitBtnElm = document.querySelector('.add-product')




let products = []

function init(){
    let updatedProductID


    formElm.addEventListener('submit', (evt)=>{
        evt.preventDefault()    
        
       const  {nameInput,priceInput} = receiveInputs()
      
     
       
       const isError = validateInput(nameInput,priceInput)       
       
       if (isError){
           alert('Provide Valid Input')
           return
       }
    
       if (!isError){    
           
        const id = products.length
        const product = {
            id: id,
            name: nameInput,
            price: priceInput

        }
        products.push(product)
        
        addItemToUI(id,nameInput,priceInput)   
        
        resetInput()
       
        addItemToStorage(product)

       }
    
        
    })

    formElm.addEventListener('click', (evt)=>{
        if(evt.target.classList.contains('update-product')){            
            const {name,price} = receiveInputs()           
           const isError= validateInput(name,price)
           if(isError){
               alert('Provide Valid Input')
               return
           }else{   

           
           const updatedProductsArr = products.map((product)=>{
                if(product.id===updatedProductID){
                   
                    return{
                        id: product.id,
                        name:name,
                        price: price
                    }

                }else{
                    return product
                }

            })}
            console.log(updatedProductsArr)           
          
        }
    })
    

    listGroupElm.addEventListener('click', (evt)=>{

        if (evt.target.classList.contains('delete-item')){    
            
            const id = getItemID(evt.target)    
            
            removeItemFromUI(id)           
            removeItemFromDataStore(id)
            
            removeProductFromStorage(id)
          
        }else if (evt.target.classList.contains('edit-item')){
        
           updatedProductID = getItemID(evt.target)          
           
           const foundProduct = products.find((product)=>product.id === updatedProductID)     

      
           populateUIInEditState(foundProduct)
           
           showUpdateBtn()
       

        }
       
       })  
    
   
    
    filterElm.addEventListener('keyup', (evt)=>{
        const filterValue = evt.target.value
        const filteredArr = products.filter((product) =>{
            product.name.includes(filterValue)
            
        })
        
        showAllItemsToUI(filteredArr)  
    
    
    
    })
 
    document.addEventListener('DOMContentLoaded', (e)=>{     

        if(localStorage.getItem('storeProducts')){
            products = JSON.parse(localStorage.getItem('storeProducts'))
           
            showAllItemsToUI(products)
            
            

        }
    })
}

init()

function showUpdateBtn(){
   const elm = `<button type='button' class="btn mt-3 btn-block btn-secondary update-product">Update</button>`
  
   submitBtnElm.style.display = 'none'
  
   formElm.insertAdjacentHTML('beforeend',elm)

}

function populateUIInEditState(foundProduct){ 
    nameInputElm.value = foundProduct.name
    priceInputElm.value = foundProduct.price
}


// 
function addItemToStorage(product){ 

   let products
   if (localStorage.getItem('storeProducts')){// 
       products = JSON.parse(localStorage.getItem('storeProducts'))
       products.push(product)
       localStorage.setItem('storeProducts', JSON.stringify(products))
   }else{
       products = []
       products.push(product)
       localStorage.setItem('storeProducts', JSON.stringify(products))
   }
}
function removeProductFromStorage(id){   
    const products = JSON.parse(localStorage.getItem('storeProducts'))    
   const productsAfterRemove= updateProductAfterDelete(products,id)    
    localStorage.setItem('storeProducts', JSON.stringify(productsAfterRemove))
}

function showAllItemsToUI(items){ 
    listGroupElm.innerHTML = ''
    items.forEach(item =>{
        const listElm= `<li class="list-group-item item-${item.id} collection-item">
              <strong>${item.name}</strong>- <span class= "price">$ ${item.price}</span>
              <i class="fa fa-trash delete-item float-right"></i>
              <i class="fa fa-pencil-alt edit-item float-right"></i>
          </li>`
        
        listGroupElm.insertAdjacentHTML('afterbegin', listElm)

    })
}

    function updateProductAfterDelete(products,id){
        return productsAfterDelete =products.filter(product => product.id!==id)
    }

   function removeItemFromUI(id){
    document.querySelector(`.item-${id}`).remove()

   }
   function removeItemFromDataStore(id){ 
      products = updateProductAfterDelete(products,id)
   }
 


function getItemID(elm){ // 

   const liElm= elm.parentElement
   return Number(liElm.classList[1].split('-')[1])
}




function resetInput(){ 
    nameInputElm.value = ''
    priceInputElm.value = ''
}
function addItemToUI(id,name, price){ 
    
    
    const listElm= `<li class="list-group-item item-${id} collection-item">
              <strong>${name}</strong>- <span class= "price">$ ${price}</span>
             
              <i class="fa fa-trash delete-item float-right"></i>
              <i class="fa fa-pencil-alt edit-item float-right"></i>
              
          </li>`
       
        
        listGroupElm.insertAdjacentHTML('afterbegin', listElm)
}

function receiveInputs(){ 
    const nameInput = nameInputElm.value
    const priceInput = priceInputElm.value
    return { 
        nameInput,
        priceInput 
    }
}

function validateInput(name, price){ 

    let isError = false

    if (!name || name.length <=3){
        isError = true
    }
    if (!price || Number(price) <=0){
        isError = true

    }
    return isError
}


})()


