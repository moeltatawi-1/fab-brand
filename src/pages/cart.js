export function getCart(){ return JSON.parse(localStorage.getItem('fab_cart') || '[]') }
export function saveCart(cart){ localStorage.setItem('fab_cart', JSON.stringify(cart)) }
export function addToCart(item){
  const cart = getCart()
  const idx = cart.findIndex(c=>c.product_id===item.product_id)
  if(idx>=0) cart[idx].qty += item.qty
  else cart.push(item)
  saveCart(cart)
}
export function clearCart(){ localStorage.removeItem('fab_cart') }
