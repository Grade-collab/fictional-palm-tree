module.exports = (app) => {
    app.get('/readnews', async (req, res) => {
        const news = await News.findAll();
        res.render('news', { news });
      });
      
      app.post('/makenews', async (req, res) => {
        const { title, content } = req.body;
        await News.create({ title, content });
        res.redirect('/');
      });
    }