const fetch = require('node-fetch') // Netlify will bundle

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405 }

  const body = JSON.parse(event.body)
  const { customer, items } = body

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  // 1) Ensure customer exists or create
  const createCustomer = await fetch(`${SUPABASE_URL}/rest/v1/customers`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(customer)
  })
  const custJson = await createCustomer.json()
  const customerId = custJson[0]?.id

  // 2) Create order
  const total = items.reduce((s,it)=> s + (Number(it.price||0) * Number(it.qty||1)), 0)

  const orderPayload = {
    customer_id: customerId,
    items: items,
    total
  }

  const createOrder = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(orderPayload)
  })

  const orderJson = await createOrder.json()

  if (createOrder.ok) {
    return { statusCode: 200, body: JSON.stringify(orderJson[0]) }
  } else {
    return { statusCode: 500, body: JSON.stringify({ error: orderJson }) }
  }
}
