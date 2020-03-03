module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'deliverymans',
      [
        {
          name: 'Deliveryman 1',
          email: 'del1@del.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Deliveryman 2',
          email: 'del2@del.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
