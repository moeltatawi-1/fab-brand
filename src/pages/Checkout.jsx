import React, { useState } from 'react'
import { getCart, clearCart } from '../cart'

export default function Checkout(){
  const cart = getCart()
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [message,setMessage]=useState('')

  async function placeOrder(e){
    e.preventDefault()
    const res = await fetch('/.netlify/functions/create-order', { // Netlify function route
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({customer:{name,email}, items: cart})
    })
    const json = await res.json()
    if(res.ok){ setMessage('Order placed! ID: '+json.id); clearCart() }
    else setMessage('Error: '+(json.error || 'unknown'))
  }

  return (
    <div style={{padding:20}}>
      <h2>Checkout</h2>
      {cart.length===0 ? <p>Your cart is empty</p> : (
        <>
          <ul>{cart.map(it=> <li key={it.product_id}>{it.name} x {it.qty}</li>)}</ul>
          <form onSubmit={placeOrder}>
            <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <button type="submit">Place Order (Cash on delivery)</button>
          </form>
          {message && <p>{message}</p>}
        </>
      )}
    </div>
  )
}
