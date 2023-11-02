import db from "../database/db";

export default (req, res) => {
  const query = 'SELECT * FROM months';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
};