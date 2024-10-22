import { mergeTypeDefs } from "@graphql-tools/merge";
import UserTypeDef from "./user.typeDef.js";
import transactionTypeDef from "./transaction.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([UserTypeDef, transactionTypeDef]);

export default mergedTypeDefs;