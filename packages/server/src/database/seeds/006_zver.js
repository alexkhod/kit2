import { returnId, truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['zver', 'block', 'module', 'note']);

  await Promise.all(
    [...Array(3).keys()].map(async ii => {
      const zver = await returnId(knex('zver')).insert({
        inv: `${ii + 1}`,
        isWork: true
      });
      await returnId(knex('note')).insert({
        zver_id: `${zver[0]}`,
        content: 'Работает',
        user_id: 'admin'
      });

      await Promise.all(
        [...Array(16).keys()].map(async jj => {
          const block = await returnId(knex('block')).insert({
            zver_id: zver[0],
            inv: `${ii + 1}-${jj + 1}`,
            isWork: true
          });
          await returnId(knex('note')).insert({
            block_id: `${block[0]}`,
            content: 'Работает',
            user_id: 'admin'
          });

          await Promise.all(
            [...Array(3).keys()].map(async kk => {
              const module = await returnId(knex('module')).insert({
                block_id: block[0],
                inv: `${ii + 1}-${jj + 1}-${kk + 1}`,
                isWork: true
              });
              return returnId(knex('note')).insert({
                module_id: `${module[0]}`,
                content: 'Работает',
                user_id: 'admin'
              });
            })
          );
        })
      );
    })
  );
}
