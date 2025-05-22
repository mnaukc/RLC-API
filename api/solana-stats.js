export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const walletAddress = "mURebvH2M73cPW1FXLSL31sqQjux5rfLXKwLnZ5mNbn";
  const reliMint = "ReE7L7o65Aarh8qKrD8zcpd2TM5qxwuvn4CARx2H2qg";
  const heliusKey = "bde63a4e-4f34-43e9-9290-0194cd8b3e1e";

  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${heliusKey}`
    );

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.statusText}`);
    }

    const data = await response.json();
    const tokens = data.tokens || [];

    const reliToken = tokens.find(
      (token) =>
        token?.mint === reliMint &&
        parseFloat(token?.amount || 0) > 0
    );

    if (!reliToken) {
      return res.status(200).json({ balance: 0 });
    }

    const balance = parseFloat(reliToken.amount);

    res.status(200).json({ balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
