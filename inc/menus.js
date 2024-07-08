const pool = require('./db'); // Certifique-se de que o caminho para o módulo db está correto
const path = require('path');

module.exports = {
  // Função para obter todos os menus
  async getMenus() {
    try {
      const [results] = await pool.query('SELECT * FROM tb_menus ORDER BY title');
      return results;
    } catch (err) {
      throw err;
    }
  },
  
  // Função para salvar ou atualizar um menu
  async save(fields, files) {
    return new Promise(async (resolve, reject) => {
      // Adiciona o caminho da foto ao campo fields.photo
      fields.photo = `images/${path.parse(files.photo.path).base}`;
      
      // Inicializa variáveis de consulta
      let query, queryPhoto = '', params = [fields.title, fields.description, fields.price];

      // Verifica se há uma foto sendo enviada
      if (files.photo.name) {
        queryPhoto = ', photo = ?';
        params.push(fields.photo);
      }

      // Verifica se é uma atualização ou um novo registro
      if (parseInt(fields.id) > 0) {
        params.push(fields.id);
        query = `UPDATE tb_menus SET title = ?, description = ?, price = ? ${queryPhoto} WHERE id = ?`;
      } else {
        // Se for um novo registro e não houver foto, rejeita a promessa
        if (!files.photo.name) {
          return reject('Envie a foto do prato.');
        }
        query = `INSERT INTO tb_menus (title, description, price, photo) VALUES (?, ?, ?, ?)`;
      }

      try {
        // Executa a consulta no banco de dados
        const [results] = await pool.query(query, params);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },

  // Função para deletar um menu
  async delete(id) {
    try {
      const [results] = await pool.query('DELETE FROM tb_menus WHERE id = ?', [id]);
      return results;
    } catch (err) {
      throw err;
    }
  }
};
