const pool = require('./db');
const path = require('path');

module.exports = {
  async getMenus() {
    try {
      const [results] = await pool.query('SELECT * FROM tb_menus ORDER BY title');
      return results;
    } catch (err) {
      throw err;
    }
  },
  
  async save(fields, files) {
    return new Promise(async (resolve, reject) => {
      fields.photo = `images/${path.parse(files.photo.path).base}`;
      let query, queryPhoto = '', params = [fields.title, fields.description, fields.price];

      if (files.photo.name) {
        queryPhoto = ', photo = ?';
        params.push(fields.photo);
      }

      if (parseInt(fields.id) > 0) {
        params.push(fields.id);
        query = `UPDATE tb_menus SET title = ?, description = ?, price = ? ${queryPhoto} WHERE id = ?`;
      } else {
        if (!files.photo.name) {
          return reject('Envie a foto do prato.');
        }
        query = `INSERT INTO tb_menus (title, description, price, photo) VALUES (?, ?, ?, ?)`;
      }

      try {
        const [results] = await pool.query(query, params);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },

  async delete(id) {
    try {
      const [results] = await pool.query('DELETE FROM tb_menus WHERE id = ?', [id]);
      return results;
    } catch (err) {
      throw err;
    }
  }
};
