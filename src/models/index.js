// @ts-check
import { initSchema } from '@aws-amplify/datastore/lib-esm';
import { schema } from './schema';



const { Post, User } = initSchema(schema);

export {
  Post,
  User
};