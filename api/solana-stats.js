export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  const tokenAddress = "ReE7L7o65Aarh8qKrD8zcpd2TM5qxwuvn4CARx2H2qg"

  try {
    const response = await fetch(
      `https://pro-api.solscan.io/v2.0/token/holders?address=${tokenAddress}&page=1&page_size=1`,
      {
        headers: {
          "accept": "application/json",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDc3NzEwMzM2NTAsImVtYWlsIjoic2VsaWdhbm1kQGdtYWlsLmNvbSIsImFjdGlvbiI6InRva2VuLWFwaSIsImFwaVZlcnNpb24iOiJ2MiIsImlhdCI6MTc0Nzc3MTAzM30.PXQMNCZU_NoY2UF-ubk52IdgNzTWBeVDB2_cQz_qD_4",
        },
      }
    )

    const json = await response.json()

    if (!response.ok || !json?.data?.total) {
      return res.status(502).json({ error: json.error_message || "Unable to fetch holder data" })
    }

    const holders = json.data.total
    res.status(200).json({ holders })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
