module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliveries', 'have_problem', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('deliveries', 'have_problem');
  },
};
