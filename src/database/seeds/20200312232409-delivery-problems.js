module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'delivery_problems',
      [
        {
          description: 'Carga parcialmente danificada',
          delivery_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Carga foi molhada',
          delivery_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Destinatario ausente',
          delivery_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Carga danificada',
          delivery_id: 7,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Carga Roubada',
          delivery_id: 8,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
