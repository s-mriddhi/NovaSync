const rateLimitMap = new Map();

export const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip);

  const windowMs = 60 * 1000; // 1 minute
  const limit = 20; // max 20 requests

  const filtered = timestamps.filter(t => now - t < windowMs);
  filtered.push(now);

  rateLimitMap.set(ip, filtered);

  if (filtered.length > limit) {
    return res.status(429).json({ error: "Too many requests. Slow down!" });
  }

  next();
};
