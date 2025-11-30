import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

export default function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) console.error(error)
      else setProducts(data)
    })()
  }, [])

  return (
    <div style={{padding:20}}>
      <h1>FAB Store</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:20}}>
        {products.map(p => (
          <div key={p.id} style={{border:'1px solid #ddd', padding:10}}>
            <h3>{p.name}</h3>
            {p.images && p.images.length > 0 && (
              <img src={`https://xivdjzyvhywvxsrwhdyt.supabase.co/storage/v1/object/public/products/${p.images[0]}`} alt={p.name} style={{width:'100%'}} />
            )}
            <p>{p.description}</p>
            <div>${parseFloat(p.price).toFixed(2)}</div>
            <a href={`/product/${p.slug}`}>View</a>
          </div>
        ))}
      </div>
    </div>
  )
}
