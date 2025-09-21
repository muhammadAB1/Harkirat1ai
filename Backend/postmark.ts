import axios from 'axios'

export async function sendEmail(to: string, subject: string, body: string) {
    let data = JSON.stringify({
        "From": process.env.FROM_EMAIL,
        "To": to,
        "Subject": subject,
        "TextBody": body,
        "HtmlBody": body,
        "MessageStream": "outbound"
    });

    let config = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: 'http://api.postmarkapp.com/email',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Postmark-Server-Token': process.env.POSTMARK_SERVER_TOKEN
        },
        data: data
    }
    return axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data))
        })

        .catch((error) => {
            console.error(error)
        })
}
