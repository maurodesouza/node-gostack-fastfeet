module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliveries', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pendente',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('deliveries', 'status');
  },
};
