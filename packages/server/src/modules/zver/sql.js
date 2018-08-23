import { returnId, orderedFor } from '../../sql/helpers';
import knex from '../../sql/connector';

export default class Zver {
  zversPagination(limit, after) {
    return knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at')
      .from('zver')
      .orderBy('id', 'asc')
      .limit(limit)
      .offset(after);
  }

  async getBlocksForZverIds(zverIds) {
    const res = await knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at', 'zver_id AS zverId')
      .from('block')
      .whereIn('zver_id', zverIds);

    return orderedFor(res, zverIds, 'zverId', false);
  }

  async getModulesForBlockIds(blockIds) {
    const res = await knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at', 'block_id AS blockId')
      .from('module')
      .whereIn('block_id', blockIds);

    return orderedFor(res, blockIds, 'blockId', false);
  }

  async getNotesForZverIds(zverIds) {
    const res = await knex
      .select('id', 'content', 'created_at', 'updated_at', 'user_id', 'zver_id AS zverId')
      .from('note')
      .whereIn('zver_id', zverIds);

    return orderedFor(res, zverIds, 'zverId', false);
  }

  async getNotesForBlockIds(blockIds) {
    const res = await knex
      .select('id', 'content', 'created_at', 'updated_at', 'user_id', 'block_id AS blockId')
      .from('note')
      .whereIn('block_id', blockIds);

    return orderedFor(res, blockIds, 'blockId', false);
  }

  async getNotesForModuleIds(moduleIds) {
    const res = await knex
      .select('id', 'content', 'created_at', 'updated_at', 'user_id', 'module_id AS moduleId')
      .from('note')
      .whereIn('module_id', moduleIds);

    return orderedFor(res, moduleIds, 'moduleId', false);
  }

  getTotal() {
    return knex('zver')
      .countDistinct('id as count')
      .first();
  }

  zver(id) {
    return knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at')
      .from('zver')
      .where('id', '=', id)
      .first();
  }

  addZver({ inv, isWork }) {
    return returnId(knex('zver')).insert({ inv, isWork });
  }

  deleteZver(id) {
    return knex('zver')
      .where('id', '=', id)
      .del();
  }

  editZver({ id, inv, isWork }) {
    return knex('zver')
      .where('id', '=', id)
      .update({
        inv: inv,
        isWork: isWork
      });
  }

  addBlock({ inv, isWork, zverId }) {
    return returnId(knex('block')).insert({ inv, isWork, zver_id: zverId });
  }

  getBlock(id) {
    return knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at')
      .from('block')
      .where('id', '=', id)
      .first();
  }

  deleteBlock(id) {
    return knex('block')
      .where('id', '=', id)
      .del();
  }

  editBlock({ id, inv, isWork }) {
    return knex('block')
      .where('id', '=', id)
      .update({
        inv: inv,
        isWork: isWork
      });
  }

  addModule({ inv, isWork, blockId }) {
    return returnId(knex('module')).insert({ inv, isWork, block_id: blockId });
  }

  getModule(id) {
    return knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at')
      .from('module')
      .where('id', '=', id)
      .first();
  }

  deleteModule(id) {
    return knex('module')
      .where('id', '=', id)
      .del();
  }

  editModule({ id, inv, isWork }) {
    return knex('module')
      .where('id', '=', id)
      .update({
        inv: inv,
        isWork: isWork
      });
  }

  addNoteOnZver({ content, zverId }, { username }) {
    return returnId(knex('note')).insert({ content, zver_id: zverId, user_id: username });
  }

  addNoteOnBlock({ content, blockId }, { username }) {
    return returnId(knex('note')).insert({ content, block_id: blockId, user_id: username });
  }

  addNoteOnModule({ content, moduleId }, { username }) {
    return returnId(knex('note')).insert({ content, module_id: moduleId, user_id: username });
  }

  getNote(id) {
    return knex
      .select('id', 'content', 'created_at', 'updated_at', 'user_id')
      .from('note')
      .where('id', '=', id)
      .first();
  }

  deleteNote(id) {
    return knex('note')
      .where('id', '=', id)
      .del();
  }

  editNote({ id, content }) {
    return knex('note')
      .where('id', '=', id)
      .update({
        content: content
      });
  }
}
