// api/reli-stats.js

export default async function handler(req, res) {
  const BIRDEYE_API_KEY = "7f1aaf197d104594af236f15f0746c6b"
  const RELI_ADDRESS = "ReE7L7o65Aarh8qKrD8zcpd2TM5qxwuvn4CARx2H2qg"

  try {
    const response = await fetch(`https://public-api.birdeye.so/public/token/${RELI_ADDRESS}`, {
      headers: {
        "X-API-KEY": BIRDEYE_API_KEY,
      },
    })

    const json = await response.json()

    if (!response.ok || !json.data) {
      return res.status(502).json({ error: json.message || "Birdeye API failed" })
    }

    const { price, fdv, holders } = json.data

    // Optional caching header (1 hour)
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate")

    return res.status(200).json({ price, fdv, holders })
  } catch (error) {
    return res.status(500).json({ error: "Server error: " + error.message })
  }
}
