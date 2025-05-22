export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*") // Add this line

  const RELI_MINT = "ReE7L7o65Aarh8qKrD8zcpd2TM5qxwuvn4CARx2H2qg"
  const RPC_URL = "https://api.mainnet-beta.solana.com"

  try {
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

    const holdersRes = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "getTokenLargestAccounts",
        params: [RELI_MINT],
      }),
    })

    const holdersJson = await holdersRes.json()
    const holderList = holdersJson?.result?.value
    const holders = Array.isArray(holderList) ? holderList.length : 0

    return res.status(200).json({ supply, decimals, holders })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
