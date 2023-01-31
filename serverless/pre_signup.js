'use strict';
require("dotenv").config({});

const { COGNITO_USER_POOL_ID } = process.env;

const {
  CognitoIdentityProviderClient,
  ListUsersCommand
} = require("@aws-sdk/client-cognito-identity-provider");

export const handler = async (event, context, callback) => {
  const client = new CognitoIdentityProviderClient();
  console.log(event.request)

  const listUsersCommand = new ListUsersCommand({
    UserPoolId: COGNITO_USER_POOL_ID,
    Filter: `email = "${event.request.userAttributes.email}"`
  });

  const result = await client.send(listUsersCommand);

  if (result.Users.length > 0) return callback(new Error("Email is already in use."), event);

  // Verify user's email address if it's already verified with Google.
  if (event.request.userAttributes['custom:RegistrationMethod'] === "google") {
    let userEmailVerified = event.request.clientMetadata['EmailVerified'] === 'true'
    event.response.autoVerifyEmail = userEmailVerified
    event.response.autoConfirmUser = userEmailVerified
  }

  callback(null, event);
};
