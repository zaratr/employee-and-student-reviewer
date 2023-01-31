'use strict'
require("dotenv").config({});
const AWS = require('aws-sdk');
const { CognitoIdentityProviderClient, ListUsersCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { COGNITO_USER_POOL_ID } = process.env;
const client = new CognitoIdentityProviderClient();

exports.handler = async (event, context, callback) =>{
    if(event.triggerSource !== "PreAuthentication_Authentication") callback(null, event);
    
    const listUsersCommand = new ListUsersCommand({
        UserPoolId: COGNITO_USER_POOL_ID,
        Filter: `email = "${event.request.userAttributes.email}"`
     });
  
    const result = await client.send(listUsersCommand);
    

    if (result.Users.length <= 0 ) callback(new Error("Please Register Account Before Trying to Login!"), event);



    callback(null, event)
}