export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  // Replace with your real wallet address
  const walletAddress = "A9cxEcnvfboaHvQHYy1GMaZCSWhVEZuGZ6UjgUF2gbf4"
  const reliMint = "ReE7L7o65Aarh8qKrD8zcpd2TM5qxwuvn4CARx2H2qg"
  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDc3NzEwMzM2NTAsImVtYWlsIjoic2VsaWdhbm1kQGdtYWlsLmNvbSIsImFjdGlvbiI6InRva2VuLWFwaSIsImFwaVZlcnNpb24iOiJ2MiIsImlhdCI6MTc0Nzc3MTAzM30.PXQMNCZU_NoY2UF-ubk52IdgNzTWBeVDB2_cQz_qD_4"

  try {
    const response = await fetch(
      `https://pro-api.solscan.io/v2.0/account/tokens?address=${walletAddress}`,
      {
        headers: {
          "accept": "application/json",
          "token": apiKey,
        },
      }
    )

    const json = await response.json()

    if (!response.ok || !json.data) {
      return res.status(502).json({ error: "Could not fetch token balances" })
    }

    const reliToken = json.data.find(token => token.tokenAddress === reliMint)

    if (!reliToken) {
      return res.status(200).json({ balance: 0 })
    }

    const raw = parseFloat(reliToken.tokenAmount.amount)
    const decimals = parseInt(reliToken.tokenAmount.decimals)
    const balance = raw / Math.pow(10, decimals)

    res.status(200).json({ balance })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
