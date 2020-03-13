module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'deliverymans',
      [
        {
          name: 'Joares Siqueira',
          email: 'del1@del.com',
          avatar_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Fernando da Silva',
          email: 'del2@del.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Siqueira dos Santos Martins',
          email: 'del3@del.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Carlos Ramos dos Santos',
          email: 'del4@del.com',
          avatar_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Leonardo Martins Siqueira',
          email: 'del5@del.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Paulo Antonio Alves',
          email: 'del6@del.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Pedro Alves da Rocha',
          email: 'del7@del.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Alvaro da Rocha Neto',
          email: 'del8@del.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
