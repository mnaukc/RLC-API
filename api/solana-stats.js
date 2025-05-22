export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const RPC_URL = "https://api.mainnet-beta.solana.com";
  const RELI_MINT = "ReE7L7o65Aarh8qKrD8zcpd2TM5qxwuvn4CARx2H2qg";
  const WALLET = "mURebvH2M73cPW1FXLSL31sqQjux5rfLXKwLnZ5mNbn";

  try {
    // 1. Get total supply
    const supplyRes = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenSupply",
        params: [RELI_MINT],
      }),
    });

    const supplyJson = await supplyRes.json();
    const supplyRaw = parseFloat(supplyJson.result.value.amount);
    const decimals = supplyJson.result.value.decimals;
    const supply = supplyRaw / Math.pow(10, decimals);

    // 2. Get wallet RELI balance
    const balanceRes = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          WALLET,
          { mint: RELI_MINT },
          { encoding: "jsonParsed" }
        ],
      }),
    });

    const balanceJson = await balanceRes.json();
    const account = balanceJson.result.value[0];
    const balance =
      account?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;

    // 3. Get recent transactions (by signature)
    const sigRes = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getSignaturesForAddress",
        params: [WALLET, { limit: 5 }],
      }),
    });

    const sigJson = await sigRes.json();
    const signatures = sigJson.result.map((s) => s.signature);

    // 4. Parse each transaction (light version)
    const txs = [];
    for (const sig of signatures) {
      const txRes = await fetch(RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getParsedTransaction",
          params: [sig, "confirmed"],
        }),
      });

      const txJson = await txRes.json();
      const tx = txJson.result;

      if (!tx) continue;

      const amount = tx?.meta?.postTokenBalances?.[0]?.uiTokenAmount?.uiAmount;
      const from = tx.transaction.message.accountKeys[0]?.pubkey;
      const date = new Date(tx.blockTime * 1000).toISOString();

      txs.push({ amount, from, date, signature: sig });
    }

    res.status(200).json({
      supply,
      balance,
      recentTxs: txs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
