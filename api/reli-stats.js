export default async function handler(req, res) {
  const RELI_MINT = "ReE7L7o65Aarh8qKrD8zcpd2TM5qxwuvn4CARx2H2qg"
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
    const { amount, decimals } = supplyJson.result.value
    const supply = parseFloat(amount) / Math.pow(10, decimals)

    // Get top holders
    const holdersRes = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenLargestAccounts",
        params: [RELI_MINT],
      }),
    })

    const holdersJson = await holdersRes.json()
    const holders = holdersJson.result.value.length

    return res.status(200).json({ supply, decimals, holders })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
