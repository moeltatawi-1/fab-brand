import { supabase } from "../lib/supabaseClient";
import { useCart } from "../context/CartContext";

async function placeOrder(customer_id, address, cart, totalAmount) {
  try {
    // convert cart → DB format
    const orderItems = cart.map((item) => ({
      product_id: item.id,
      qty: item.qty,
      price_snapshot: item.price,
    }));

    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_id,
        items: orderItems,
        total: totalAmount,
        shipping_address: address,
      })
      .select();

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
