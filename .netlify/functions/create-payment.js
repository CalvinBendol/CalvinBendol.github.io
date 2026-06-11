export async function handler(event) {
  const body = JSON.parse(event.body);

  const res = await fetch("https://app.pakasir.com/api/transactioncreate/qris", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project: "calvinbendol",
      order_id: body.order_id,
      amount: body.amount,
      api_key: process.env.PAKASIR_API_KEY,
    }),
  });

  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
