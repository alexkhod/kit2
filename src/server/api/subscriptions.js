import { SubscriptionManager } from 'graphql-subscriptions'
import schema, { pubsub } from './schema'

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    countUpdated: (options, args) => ({
      // Run the query each time count updated
      countUpdated: () => true
    })
  },
});

export { subscriptionManager, pubsub };