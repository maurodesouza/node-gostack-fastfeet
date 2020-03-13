module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'files',
      [
        {
          name: 'avatar',
          path: '0e1c0443d4bb9927ee94985ef643413b.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'avatar',
          path: '4617cefa0f6d50ffa87d14e8098180c2.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'signature',
          path: 'c9c476b55c9cd37b7dc2ebaa00035db9.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
