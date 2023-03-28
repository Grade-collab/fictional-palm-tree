module.exports = (sequelize, Sequelize) => {
    const News = sequelize.define('news', {
      id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      title: {type: Sequelize.STRING },
      content: {type: Sequelize.TEXT },
      createdAt: {type: Sequelize.DATE },
      updateAt: {type: Sequelize.DATE },
    });
  
    return News;
    
  };
  