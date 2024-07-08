const express = require('express');
const menus = require('./../inc/menus');
const reservations = require('./../inc/reservations');
const contacts = require('./../inc/contacts');
const emails = require('./../inc/emails');
const router = express.Router();

module.exports = function(io, pool) {
  /* GET home page. */
  router.get('/', async function(req, res, next) {
    try {
      const results = await menus.getMenus(pool);
      res.render('index', {
        title: 'La empanadas!',
        menus: results,
        isHome: true
      });
    } catch (err) {
      console.error('Erro ao renderizar a página inicial:', err);
      res.status(500).send('Erro interno do servidor');
    }
  });

  router.get('/contacts', function(req, res, next) {
    contacts.render(req, res);
  });

  router.post('/contacts', async function(req, res, next) {
    if (!req.body.name) {
      contacts.render(req, res, 'Digite o nome');
    } else if (!req.body.email) {
      contacts.render(req, res, 'Digite o email');
    } else if (!req.body.message) {
      contacts.render(req, res, 'Digite a mensagem');
    } else {
      try {
        await contacts.save(req.body, pool);
        req.body = {};
        io.emit('dashboard update');
        contacts.render(req, res, null, 'Contato enviado com sucesso!');
      } catch (err) {
        contacts.render(req, res, err.message);
      }
    }
  });

  router.get('/menus', async function(req, res, next) {
    try {
      const results = await menus.getMenus(pool);
      res.render('menus', {
        title: 'Menus - La empanadas!',
        background: 'images/img_bg_1.jpg',
        h1: 'Saboreie nosso menu!',
        menus: results
      });
    } catch (err) {
      console.error('Erro ao obter menus:', err);
      res.status(500).send('Erro interno do servidor');
    }
  });

  router.get('/reservations', function(req, res, next) {
    reservations.render(req, res);
  });

  router.post('/reservations', async function(req, res, next) {
    if (!req.body.name) {
      reservations.render(req, res, 'Digite seu nome');
    } else if (!req.body.email) {
      reservations.render(req, res, 'Digite o e-mail');
    } else if (!req.body.people) {
      reservations.render(req, res, 'Selecione o número de pessoas');
    } else if (!req.body.date) {
      reservations.render(req, res, 'Selecione a data');
    } else if (!req.body.time) {
      reservations.render(req, res, 'Selecione a hora');
    } else {
      try {
        await reservations.save(req.body, pool);
        req.body = {};
        io.emit('dashboard update');
        reservations.render(req, res, null, 'Reserva realizada com sucesso!');
      } catch (err) {
        reservations.render(req, res, err.message);
      }
    }
  });

  router.get('/services', function(req, res, next) {
    res.render('services', {
      title: 'Serviços - La empanadas!',
      background: 'images/img_bg.jpg',
      h1: 'É um prazer poder servir!'
    });
  });

  router.post('/subscribe', async function(req, res, next) {
    try {
      const results = await emails.save(req, pool);
      res.send(results);
    } catch (err) {
      res.send(err);
    }
  });

  return router;
};
