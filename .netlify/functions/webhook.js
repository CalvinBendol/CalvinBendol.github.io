export async function handler(event) {
  try {
    const data = JSON.parse(event.body);

    console.log("Webhook masuk:", data);

    if (data.status !== "completed") {
      return {
        statusCode: 200,
        body: "Not completed yet",
      };
    }

    // 🔥 Ambil data dari order_id
    const [productRaw, emailRaw] = data.order_id.split("__");

    const productName = productRaw.replace(/_/g, " ");
    const email = emailRaw.replace("[at]", "@");

    console.log("Produk:", productName);
    console.log("Email:", email);

    // 🔥 Mapping produk ke link download
    let downloadLink = "";

    if (productName.includes("iPhone")) {
      downloadLink = "https://linkkamu.com/mockup.zip";
    } else if (productName.includes("Preset")) {
      downloadLink = "https://linkkamu.com/preset.zip";
    } else if (productName.includes("3D")) {
      downloadLink = "https://linkkamu.com/3d.zip";
    } else {
      downloadLink = "https://linkkamu.com/default.zip";
    }

    // 🔥 Kirim email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "store@yourdomain.com",
        to: email,
        subject: "Produk kamu sudah siap 🎉",
        html: `
          <h2>Terima kasih sudah membeli!</h2>
          <p>Produk: <b>${productName}</b></p>
          <a href="${downloadLink}">Download Produk</a>
        `,
      }),
    });

    const result = await res.json();
    console.log(result);

    return {
      statusCode: 200,
      body: "Email sent",
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "Error",
    };
  }
}
