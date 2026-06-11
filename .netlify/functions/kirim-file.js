const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Hanya terima data POST dari Pakasir
  if (event.httpMethod !== 'POST') return { statusCode: 405 };

  const data = JSON.parse(event.body);

  // Jika status lunas (completed)
  if (data.status === 'completed') {
    
    // Bongkar Order ID (NamaProduk__Email__[at]__Time)
    const details = data.order_id.split('__');
    const productName = details[0].replace(/_/g, " ");
    const userEmail = details[1].replace("[at]", "@");

    // Konfigurasi Email Kamu
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'calvinbendol@gmail.com', // Ganti emailmu
        pass: 'dbkvbrqkdsqlnrkf'  // Ganti pakai APP PASSWORD (16 Digit)
      }
    });

    // Tentukan Link Berdasarkan Produk
    let fileLink = "https://your-storage.com/default-file";
    if (productName.includes("iPhone")) fileLink = "https://link-google-drive-mockup";
    if (productName.includes("Presets")) fileLink = "https://link-google-drive-presets";
    if (productName.includes("Abstract")) fileLink = "https://link-google-drive-3d";
    if (productName.includes("Freelance")) fileLink = "https://link-google-drive-ebook";

    const mailOptions = {
      from: '"Calvin Bendol Store" <calvinbendol@gmail.com>',
      to: userEmail,
      subject: `Lunas! Download ${productName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #1e3a8a;">Terima Kasih, Pembayaran Berhasil!</h2>
          <p>Halo,</p>
          <p>Terima kasih sudah membeli <b>${productName}</b>. Silakan klik tombol di bawah untuk mendownload file Anda:</p>
          <a href="${fileLink}" style="display: inline-block; padding: 12px 25px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">DOWNLOAD FILE SEKARANG</a>
          <p>Jika ada kendala, silakan balas email ini ya.</p>
          <br>
          <p>Big Thanks,<br><b>Calvin Bendol</b></p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return { statusCode: 200, body: 'Email Berhasil Dikirim' };
    } catch (error) {
      return { statusCode: 500, body: 'Gagal Kirim Email' };
    }
  }
  return { statusCode: 200, body: 'Not a completed payment' };
};
