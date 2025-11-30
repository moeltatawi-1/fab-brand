import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.log(error);
      else setProducts(data);
    }
    loadProducts();
  }, []);

  return (
    <div className="products">
      {products.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}
