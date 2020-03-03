module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'recipients',
      [
        {
          name: 'Recipient 1',
          email: 'rec@rec.com',
          street: 'Rua Qualquer',
          number: 1,
          city: 'Rua Qualquer',
          state: 'Qualquer',
          zip_code: '12345-123',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
