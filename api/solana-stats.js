export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const RPC_URL = "https://api.mainnet-beta.solana.com";
  const reliMint = "ReE7L7o65Aarh8qKrD8zcpd2TM5qxwuvn4CARx2H2qg";
  const walletAddress = "mURebvH2M73cPW1FXLSL31sqQjux5rfLXKwLnZ5mNbn";

  try {
    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          walletAddress,
          {
            mint: reliMint
          },
          {
            encoding: "jsonParsed"
          }
        ]
      })
    });

    const json = await response.json();

    if (!json.result?.value?.length) {
      return res.status(200).json({ balance: 0 });
    }

    const tokenAccount = json.result.value[0];
    const amount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;

    res.status(200).json({ balance: amount });
  } catch (err) {
    console.error("Solana RPC error:", err);
    res.status(500).json({ error: err.message });
  }
}
