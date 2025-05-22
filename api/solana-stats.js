export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  const RELI_MINT = "ReE7L7o65Aarh8qKrD8zcpd2TM5qxwuvn4CARx2H2qg"
  const TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  const RPC_URL = "https://api.mainnet-beta.solana.com"

  try {
    // Get token supply
    const supplyRes = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenSupply",
        params: [RELI_MINT],
      }),
    })

    const supplyJson = await supplyRes.json()
    const supplyValue = supplyJson?.result?.value

    if (!supplyValue || !supplyValue.amount) {
      return res.status(502).json({ error: "Failed to fetch token supply" })
    }

    const decimals = parseInt(supplyValue.decimals)
    const rawAmount = parseFloat(supplyValue.amount)
    const supply = rawAmount / Math.pow(10, decimals)

    // Get token accounts for this mint
    const accountsRes = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "getProgramAccounts",
        params: [
          TOKEN_PROGRAM,
          {
            encoding: "jsonParsed",
            filters: [
              {
                dataSize: 165
              },
              {
                memcmp: {
                  offset: 0,
                  bytes: RELI_MINT
                }
              }
            ]
          }
        ]
      }),
    })

    const accountsJson = await accountsRes.json()
    const result = accountsJson?.result || []

    // Count only accounts with balance > 0
    const holders = result.filter(account => {
      const amount = account.account?.data?.parsed?.info?.tokenAmount?.uiAmount
      return amount && amount > 0
    }).length

    return res.status(200).json({ supply, decimals, holders })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
