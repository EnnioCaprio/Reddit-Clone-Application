
exports.seed = async (knex) => {
    return await knex('statusinfo').insert([
      {statuscode: 'R', name: 'Requested'},
      {statuscode: 'A', name: 'Accepted'},
      {statuscode: 'D', name: 'Declined'}
    ]);
};
