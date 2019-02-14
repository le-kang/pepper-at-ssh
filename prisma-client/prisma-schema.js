module.exports = {
        typeDefs: /* GraphQL */ `type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar Long

type Mutation {
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  email: String!
  password: String
  name: String!
  companyName: String
  mobile: String
  interactionSessionId: String
  interactions: String
  loginWith: String
  disclaimer: Boolean!
  freeCoffee: Boolean!
  verified: Boolean!
  deactivated: Boolean!
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  email: String!
  password: String
  name: String!
  companyName: String
  mobile: String
  interactionSessionId: String
  interactions: String
  loginWith: String
  disclaimer: Boolean
  freeCoffee: Boolean
  verified: Boolean
  deactivated: Boolean
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
  name_ASC
  name_DESC
  companyName_ASC
  companyName_DESC
  mobile_ASC
  mobile_DESC
  interactionSessionId_ASC
  interactionSessionId_DESC
  interactions_ASC
  interactions_DESC
  loginWith_ASC
  loginWith_DESC
  disclaimer_ASC
  disclaimer_DESC
  freeCoffee_ASC
  freeCoffee_DESC
  verified_ASC
  verified_DESC
  deactivated_ASC
  deactivated_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  email: String!
  password: String
  name: String!
  companyName: String
  mobile: String
  interactionSessionId: String
  interactions: String
  loginWith: String
  disclaimer: Boolean!
  freeCoffee: Boolean!
  verified: Boolean!
  deactivated: Boolean!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  email: String
  password: String
  name: String
  companyName: String
  mobile: String
  interactionSessionId: String
  interactions: String
  loginWith: String
  disclaimer: Boolean
  freeCoffee: Boolean
  verified: Boolean
  deactivated: Boolean
}

input UserUpdateManyMutationInput {
  email: String
  password: String
  name: String
  companyName: String
  mobile: String
  interactionSessionId: String
  interactions: String
  loginWith: String
  disclaimer: Boolean
  freeCoffee: Boolean
  verified: Boolean
  deactivated: Boolean
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  companyName: String
  companyName_not: String
  companyName_in: [String!]
  companyName_not_in: [String!]
  companyName_lt: String
  companyName_lte: String
  companyName_gt: String
  companyName_gte: String
  companyName_contains: String
  companyName_not_contains: String
  companyName_starts_with: String
  companyName_not_starts_with: String
  companyName_ends_with: String
  companyName_not_ends_with: String
  mobile: String
  mobile_not: String
  mobile_in: [String!]
  mobile_not_in: [String!]
  mobile_lt: String
  mobile_lte: String
  mobile_gt: String
  mobile_gte: String
  mobile_contains: String
  mobile_not_contains: String
  mobile_starts_with: String
  mobile_not_starts_with: String
  mobile_ends_with: String
  mobile_not_ends_with: String
  interactionSessionId: String
  interactionSessionId_not: String
  interactionSessionId_in: [String!]
  interactionSessionId_not_in: [String!]
  interactionSessionId_lt: String
  interactionSessionId_lte: String
  interactionSessionId_gt: String
  interactionSessionId_gte: String
  interactionSessionId_contains: String
  interactionSessionId_not_contains: String
  interactionSessionId_starts_with: String
  interactionSessionId_not_starts_with: String
  interactionSessionId_ends_with: String
  interactionSessionId_not_ends_with: String
  interactions: String
  interactions_not: String
  interactions_in: [String!]
  interactions_not_in: [String!]
  interactions_lt: String
  interactions_lte: String
  interactions_gt: String
  interactions_gte: String
  interactions_contains: String
  interactions_not_contains: String
  interactions_starts_with: String
  interactions_not_starts_with: String
  interactions_ends_with: String
  interactions_not_ends_with: String
  loginWith: String
  loginWith_not: String
  loginWith_in: [String!]
  loginWith_not_in: [String!]
  loginWith_lt: String
  loginWith_lte: String
  loginWith_gt: String
  loginWith_gte: String
  loginWith_contains: String
  loginWith_not_contains: String
  loginWith_starts_with: String
  loginWith_not_starts_with: String
  loginWith_ends_with: String
  loginWith_not_ends_with: String
  disclaimer: Boolean
  disclaimer_not: Boolean
  freeCoffee: Boolean
  freeCoffee_not: Boolean
  verified: Boolean
  verified_not: Boolean
  deactivated: Boolean
  deactivated_not: Boolean
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`
      }
    