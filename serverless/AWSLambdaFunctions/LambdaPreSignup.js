'use strict'
require("dotenv").config({});
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { CognitoIdentityProviderClient, ListUsersCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { COGNITO_USER_POOL_ID } = process.env;
const client = new CognitoIdentityProviderClient();


exports.handler = async (event, context, callback) => {
    if(event.triggerSource !== "PreSignUp_SignUp") callback(null, event);
    const { email } = event.request.userAttributes;

    // Query the DynamoDB table to check if the email is present
    const getParams = {
        TableName: 'MyAllowedUsersTable',
        Key: {
            email: email
        }
    };
    
    const putParams = {
        TableName: 'fairQueue',
        Item: {
            uniqueEmailKey: 'employer3@example.com',
            userType: 'employer',
            queue: []
        }
    };
    
    try {
        //get from dynamoDB - admin checking employers
        const result = await dynamoDb.get(getParams).promise();
        
        //check authentication to register
        if (!(result.Item || email.endsWith("@gatech"))) {
            callback(new Error("Must be a student or Approved Account to signup. Please Contact Admin to set up account."), event);
        }
        // receive value if already exists in the user pool
        const listUsersCommand = new ListUsersCommand({
            UserPoolId: COGNITO_USER_POOL_ID,
            Filter: `email = "${email}"`
        });
        const userPoolResult = await client.send(listUsersCommand);
        if (userPoolResult.Users.length > 0) return callback(new Error("Email is already in use."), event);
        
        //after checking all conditions ( duplicate, able to register) , create new user into db of all users and their queue
        await dynamoDb.put(putParams).promise();

    } catch (err) {
        callback(err, event);
    }
    
    
    callback(null, event)
};
