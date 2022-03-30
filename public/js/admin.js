const deleteProduct = (btn) => {

    const productId = btn.parentNode.querySelector('[name=productId]').value; // find item in parent node of btn that has the query selector info provided
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value; // find item in parent node of btn that has the query selector info provided

    const productElement = btn.closest('article');

    fetch('/admin/product/'+productId, {
        method: 'DELETE',
        headers:{
            'csrf-token': csrfToken
        }
    })
    .then(result=>{
        console.log(result);

        productElement.parentNode.removeChild(productElement); // deleting the product element from the client side without re                       /ll                'loading browser
    })
    .catch(err => {console.log(err);})
}