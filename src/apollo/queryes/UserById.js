import gql from 'graphql-tag'; export const USER_BY_ID = gql` query
GetUsers($userID: String = "") { users(where: { id: { _eq: $userID } }) { id
name last_seen } }`
