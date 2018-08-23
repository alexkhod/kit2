import { withFilter } from 'graphql-subscriptions';
import { createBatchResolver } from 'graphql-resolve-batch';
import withAuth from 'graphql-auth';
import FieldError from '../../../../common/FieldError';

const ZVER_SUBSCRIPTION = 'zver_subscription';
const ZVERS_SUBSCRIPTION = 'zvers_subscription';
const BLOCK_SUBSCRIPTION = 'block_subscription';
const MODULE_SUBSCRIPTION = 'module_subscription';
const NOTE_SUBSCRIPTION = 'note_subscription';

export default pubsub => ({
  Query: {
    async zvers(obj, { limit, after }, context) {
      let edgesArray = [];
      let zvers = await context.Zver.zversPagination(limit, after);

      zvers.map((zver, index) => {
        edgesArray.push({
          cursor: after + index,
          node: zver
        });
      });
      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;
      const total = (await context.Zver.getTotal()).count;
      const hasNextPage = total > after + limit;
      return {
        totalCount: total,
        edges: edgesArray,
        pageInfo: {
          endCursor: endCursor,
          hasNextPage: hasNextPage
        }
      };
    },
    zver(obj, { id }, context) {
      return context.Zver.zver(id);
    },
    block(obj, { id }, context) {
      return context.Zver.getBlock(id);
    },
    module(obj, { id }, context) {
      return context.Zver.getModule(id);
    },
    note(obj, { id }, context) {
      return context.Zver.getNote(id);
    }
  },
  Zver: {
    blocks: createBatchResolver((sources, args, context) => {
      return context.Zver.getBlocksForZverIds(sources.map(({ id }) => id));
    }),
    notes: createBatchResolver((sources, args, context) => {
      return context.Zver.getNotesForZverIds(sources.map(({ id }) => id));
    })
  },
  Block: {
    modules: createBatchResolver((sources, args, context) => {
      return context.Zver.getModulesForBlockIds(sources.map(({ id }) => id));
    }),
    notes: createBatchResolver((sources, args, context) => {
      return context.Zver.getNotesForBlockIds(sources.map(({ id }) => id));
    })
  },
  Module: {
    notes: createBatchResolver((sources, args, context) => {
      return context.Zver.getNotesForModuleIds(sources.map(({ id }) => id));
    })
  },
  Mutation: {
    addZver: withAuth(async (obj, { input }, { Zver, user }) => {
      const isAdmin = () => user.role === 'admin';
      try {
        const e = new FieldError();
        if (!isAdmin()) {
          e.setError();
        }
        e.throwIf();
        const [id] = await Zver.addZver(input);
        const zver = await Zver.zver(id);
        // publish for zver list
        pubsub.publish(ZVERS_SUBSCRIPTION, {
          zversUpdated: {
            mutation: 'CREATED',
            id,
            node: zver
          }
        });
        return zver;
      } catch (e) {
        return { errors: e };
      }
    }),
    async deleteZver(obj, { id }, context) {
      const zver = await context.Zver.zver(id);
      const isDeleted = await context.Zver.deleteZver(id);
      if (isDeleted) {
        // publish for zver list
        pubsub.publish(ZVERS_SUBSCRIPTION, {
          zversUpdated: {
            mutation: 'DELETED',
            id,
            node: zver
          }
        });
        // publish for edit zver page
        pubsub.publish(ZVER_SUBSCRIPTION, {
          zverUpdated: {
            mutation: 'DELETED',
            id,
            node: zver
          }
        });
        return { id: zver.id };
      } else {
        return { id: null };
      }
    },
    async editZver(obj, { input }, context) {
      await context.Zver.editZver(input);
      const zver = await context.Zver.zver(input.id);
      // publish for zver list
      pubsub.publish(ZVERS_SUBSCRIPTION, {
        zversUpdated: {
          mutation: 'UPDATED',
          id: zver.id,
          node: zver
        }
      });
      // publish for edit zver page
      pubsub.publish(ZVER_SUBSCRIPTION, {
        zverUpdated: {
          mutation: 'UPDATED',
          id: zver.id,
          node: zver
        }
      });
      return zver;
    },
    async addBlock(obj, { input }, context) {
      const [id] = await context.Zver.addBlock(input);
      const block = await context.Zver.getBlock(id);
      // publish for edit block page
      pubsub.publish(BLOCK_SUBSCRIPTION, {
        blockUpdated: {
          mutation: 'CREATED',
          id: block.id,
          zverId: input.zverId,
          node: block
        }
      });
      return block;
    },
    async deleteBlock(
      obj,
      {
        input: { id, zverId }
      },
      context
    ) {
      await context.Zver.deleteBlock(id);
      // publish for edit block page
      pubsub.publish(BLOCK_SUBSCRIPTION, {
        blockUpdated: {
          mutation: 'DELETED',
          id,
          zverId,
          node: null
        }
      });
      return { id };
    },
    async editBlock(obj, { input }, context) {
      await context.Zver.editBlock(input);
      const block = await context.Zver.getBlock(input.id);
      // publish for edit block page
      pubsub.publish(BLOCK_SUBSCRIPTION, {
        blockUpdated: {
          mutation: 'UPDATED',
          id: input.id,
          zverId: input.zverId,
          node: block
        }
      });
      return block;
    },
    async addModule(obj, { input }, context) {
      const [id] = await context.Zver.addModule(input);
      const module = await context.Zver.getModule(id);
      // publish for edit module page
      pubsub.publish(MODULE_SUBSCRIPTION, {
        moduleUpdated: {
          mutation: 'CREATED',
          id: module.id,
          blockId: input.blockId,
          node: module
        }
      });
      return module;
    },
    async deleteModule(
      obj,
      {
        input: { id, blockId }
      },
      context
    ) {
      await context.Zver.deleteModule(id);
      // publish for edit module page
      pubsub.publish(MODULE_SUBSCRIPTION, {
        moduleUpdated: {
          mutation: 'DELETED',
          id,
          blockId,
          node: null
        }
      });
      return { id };
    },
    async editModule(obj, { input }, context) {
      await context.Zver.editModule(input);
      const module = await context.Zver.getModule(input.id);
      // publish for edit module page
      pubsub.publish(MODULE_SUBSCRIPTION, {
        moduleUpdated: {
          mutation: 'UPDATED',
          id: input.id,
          blockId: input.blockId,
          node: module
        }
      });
      return module;
    },
    async addNoteOnZver(obj, { input }, { Zver, user }) {
      const [id] = await Zver.addNoteOnZver(input, user);
      const note = await Zver.getNote(id);
      // publish for edit note page
      pubsub.publish(NOTE_SUBSCRIPTION, {
        noteUpdated: {
          mutation: 'CREATED',
          id: note.id,
          zverId: input.zverId,
          node: note
        }
      });
      return note;
    },
    async addNoteOnBlock(obj, { input }, { Zver, user }) {
      const [id] = await Zver.addNoteOnBlock(input, user);
      const note = await Zver.getNote(id);
      // publish for edit note page
      pubsub.publish(NOTE_SUBSCRIPTION, {
        noteUpdated: {
          mutation: 'CREATED',
          id: note.id,
          blockId: input.blockId,
          node: note
        }
      });
      return note;
    },
    async addNoteOnModule(obj, { input }, { Zver, user }) {
      const [id] = await Zver.addNoteOnModule(input, user);
      const note = await Zver.getNote(id);
      // publish for edit note page
      pubsub.publish(NOTE_SUBSCRIPTION, {
        noteUpdated: {
          mutation: 'CREATED',
          id: note.id,
          moduleId: input.moduleId,
          node: note
        }
      });
      return note;
    },
    async deleteNote(
      obj,
      {
        input: { id }
      },
      context
    ) {
      await context.Zver.deleteNote(id);
      // publish for edit note page
      pubsub.publish(NOTE_SUBSCRIPTION, {
        noteUpdated: {
          mutation: 'DELETED',
          id,
          node: null
        }
      });
      return { id };
    },
    async editNote(obj, { input }, context) {
      await context.Zver.editNote(input);
      const note = await context.Zver.getNote(input.id);
      // publish for edit note page
      pubsub.publish(NOTE_SUBSCRIPTION, {
        noteUpdated: {
          mutation: 'UPDATED',
          id: input.id,
          node: note
        }
      });
      return note;
    }
  },
  Subscription: {
    zverUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(ZVER_SUBSCRIPTION),
        (payload, variables) => {
          return payload.zverUpdated.id === variables.id;
        }
      )
    },
    zversUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(ZVERS_SUBSCRIPTION),
        (payload, variables) => {
          return variables.endCursor <= payload.zversUpdated.id;
        }
      )
    },
    blockUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(BLOCK_SUBSCRIPTION),
        (payload, variables) => {
          return payload.blockUpdated.zverId === variables.zverId;
        }
      )
    },
    moduleUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MODULE_SUBSCRIPTION),
        (payload, variables) => {
          return payload.moduleUpdated.blockId === variables.blockId;
        }
      )
    },
    noteUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NOTE_SUBSCRIPTION),
        (payload, variables) => {
          return payload.noteUpdated.zverId === variables.zverId;
        }
      )
    },
    noteUpdatedOnBlock: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NOTE_SUBSCRIPTION),
        (payload, variables) => {
          return payload.noteUpdatedOnBlock.blockId === variables.blockId;
        }
      )
    },
    noteUpdatedOnModule: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NOTE_SUBSCRIPTION),
        (payload, variables) => {
          return payload.noteUpdatedOnModule.moduleId === variables.moduleId;
        }
      )
    }
  }
});
