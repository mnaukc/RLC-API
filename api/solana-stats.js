export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  const walletAddress = "mURebvH2M73cPW1FXLSL31sqQjux5rfLXKwLnZ5mNbn"
  const reliMint = "ReE7L7o65Aarh8qKrD8zcpd2TM5qxwuvn4CARx2H2qg"
  const heliusKey = "bde63a4e-4f34-43e9-9290-0194cd8b3e1e"

  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${walletAddress}/tokens?api-key=${heliusKey}`
    )

    const json = await response.json()
    const tokens = json.tokens || []

    const reliToken = tokens.find(
      (token) =>
        token?.tokenAccount?.mint === reliMint &&
        parseFloat(token?.tokenAmount?.amount || 0) > 0
    )

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
