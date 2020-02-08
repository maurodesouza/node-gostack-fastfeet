module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliverymans', 'dismissed_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('deliverymans', 'dismissed_at');
  },
};
