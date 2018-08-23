import NOTE_QUERY_CLIENT from '../graphql/NoteQuery.client.graphql';
import BLOCK_QUERY_CLIENT from '../graphql/BlockQuery.client.graphql';
import MODULE_QUERY_CLIENT from '../graphql/ModuleQuery.client.graphql';

const TYPE_NAME = 'NoteState';
const TYPE_NAME_B = 'BlockState';
const TYPE_NAME_M = 'ModuleState';
const TYPE_NAME_NOTE = 'Note';
const TYPE_NAME_BLOCK = 'Block';
const TYPE_NAME_MODULE = 'Module';

const defaults = {
  note: {
    id: null,
    content: '',
    updated_at: '',
    user_id: '',
    __typename: TYPE_NAME_NOTE
  },
  block: {
    id: null,
    inv: '',
    isWork: true,
    __typename: TYPE_NAME_BLOCK
  },
  module: {
    id: null,
    inv: '',
    isWork: true,
    __typename: TYPE_NAME_MODULE
  },
  __typename: TYPE_NAME
};

const resolvers = {
  Query: {
    noteState: (_, args, { cache }) => {
      const {
        note: { note }
      } = cache.readQuery({ query: NOTE_QUERY_CLIENT });
      return {
        note: {
          ...note,
          __typename: TYPE_NAME_NOTE
        },
        __typename: TYPE_NAME
      };
    },
    blockState: (_, args, { cache }) => {
      const {
        block: { block }
      } = cache.readQuery({ query: BLOCK_QUERY_CLIENT });
      return {
        block: {
          ...block,
          __typename: TYPE_NAME_BLOCK
        },
        __typename: TYPE_NAME_B
      };
    },
    moduleState: (_, args, { cache }) => {
      const {
        module: { module }
      } = cache.readQuery({ query: MODULE_QUERY_CLIENT });
      return {
        module: {
          ...module,
          __typename: TYPE_NAME_MODULE
        },
        __typename: TYPE_NAME_M
      };
    }
  },
  Mutation: {
    onNoteSelect: async (_, { note }, { cache }) => {
      await cache.writeData({
        data: {
          note: {
            ...note,
            __typename: TYPE_NAME_NOTE
          },
          __typename: TYPE_NAME
        }
      });

      return null;
    },
    onBlockSelect: async (_, { block }, { cache }) => {
      await cache.writeData({
        data: {
          block: {
            ...block,
            __typename: TYPE_NAME_BLOCK
          },
          __typename: TYPE_NAME_B
        }
      });

      return null;
    },
    onModuleSelect: async (_, { module }, { cache }) => {
      await cache.writeData({
        data: {
          module: {
            ...module,
            __typename: TYPE_NAME_MODULE
          },
          __typename: TYPE_NAME_M
        }
      });

      return null;
    }
  }
};

export default {
  defaults,
  resolvers
};
