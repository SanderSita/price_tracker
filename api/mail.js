
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: "mail.sandersekreve.nl",
    port: 465, 
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
});

export async function sendMail(recipiant_email, product_name, has_lowered, old_price, new_price, img_url, product_url){
    try {
      await transporter.sendMail({
        from: 'pricetracker@sandersekreve.nl',
        to: recipiant_email,
        subject: `[PRICE UPDATE] ${product_name} ${has_lowered ? 'has decreased ' : 'has increased '} in price`,
        html: getHTML(product_name, img_url, old_price, new_price, has_lowered, product_url)
      });
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }
}

function getHTML(product_name, img_url, old_price, new_price, has_lowered, product_url) {
    const html = `
        <h1>${product_name}</h1>
        <img style="width: calc(100% / 2); max-height: 500px; object-fit: cover;" src="${img_url}">
        <h2>${has_lowered ? 'has decreased' : 'has increased'} in price! It went from ${old_price} to ${new_price}</h2>
        <a href="${product_url} target="_blank">Go to product</a>
    `;

    return html
}

export async function sendTestEmail(email) {
  try {
    // Send mail to admin
    await transporter.sendMail({
      from: 'pricetracker@sandersekreve.nl',
      to: email,
      subject: `this is a test`,
      html: `<p>test email from pricetracker</p>`
    });
    console.log('Email sent successfully');
  } catch (emailError) {
    console.error('Error sending email:', emailError);
  }
}
