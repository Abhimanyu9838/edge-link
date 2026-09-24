require('dotenv').config()
const express = require('express');
const pool = require('./db');
const geoip = require('geoip-lite');
const redis = require('./cache');
const { newShortCode } = require('./utils');

const app = express();
app.use(express.static('../frontend'));
app.use(express.json());

app.post('/shorten', async (req, res) => {
  const { longUrl, geoRules } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'longUrl is required' });
  }

  try {
    const { id, code } = await newShortCode();

    await pool.query(
      'insert into urls (id, short_code, long_url) values ($1,$2,$3)',
      [id, code, longUrl]
    );

    if (geoRules) {
      for (const country in geoRules) {
        await pool.query(
          'insert into geo_rules (short_code, country_code, destination_url) values ($1,$2,$3)',
          [code, country.toUpperCase(), geoRules[country]]
        );
      }
    }

    res.json({ shortUrl: `${process.env.BASE_URL}/${code}`, code });
  } catch (e) {
    console.log('shorten failed', e.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/resolve/:code', async (req, res) => {
  const { code } = req.params;

  let country = req.headers['cf-ipcountry'];
  if (!country) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    country = geo?.country || req.query.country || 'US';
  }
  country = country.toUpperCase();

  const key = `url:${code}`;

  try {
    const hit = await redis.get(key);

    if (hit) {
      const parsed = JSON.parse(hit);
      const dest = parsed.geo?.[country] || parsed.longUrl;
      return res.json({ destination: dest, from: 'cache' });
    }

    const r = await pool.query('select long_url from urls where short_code=$1', [code]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'not found' });

    const g = await pool.query(
      'select country_code, destination_url from geo_rules where short_code=$1',
      [code]
    );

    const geo = {};
    for (const row of g.rows) geo[row.country_code] = row.destination_url;

    const payload = { longUrl: r.rows[0].long_url, geo };

    await redis.setex(key, 3600, JSON.stringify(payload));

    const dest = geo[country] || payload.longUrl;
    res.json({ destination: dest, from: 'db' });
  } catch (e) {
    console.log('resolve err', e.message);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/:code', async (req, res) => {
  const { code } = req.params;

  let country = req.headers['cf-ipcountry'];
  if (!country) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    country = geo?.country || 'US';
  }
  country = country.toUpperCase();

  try {
    const r = await fetch(`http://localhost:${process.env.PORT}/resolve/${code}?country=${country}`);
    const data = await r.json();

    if (!data.destination) return res.status(404).send('not found');

    pool.query('insert into clicks (short_code, country) values ($1,$2)', [code, country])
      .catch((e) => console.log('click log failed', e.message));

    res.redirect(302, data.destination);
  } catch (e) {
    console.log('redirect err', e.message);
    res.status(500).send('error');
  }
});

app.get('/analytics/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const totalQ = pool.query('select count(*) from clicks where short_code=$1', [code]);
    const countryQ = pool.query(
      'select country, count(*) from clicks where short_code=$1 group by country order by 2 desc',
      [code]
    );

    const [total, byCountry] = await Promise.all([totalQ, countryQ]);

    res.json({
      code,
      total: parseInt(total.rows[0].count),
      countries: byCountry.rows,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: 'error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('server up on', PORT));
