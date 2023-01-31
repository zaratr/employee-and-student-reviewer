# Use AWS Cognito to Authenticate and Add Personal Info to Queue!

Need to Create a Database SQL that correctly doesn't have null as a place holder? Look no Further, use AWS DynamoDb. This app is set up to use CRUD method with DynamoDb and Cognito. Gateway is another way to do this but there are many ways to the same with AWS!!

### Set up
- Create an account with AWS so that only users with specific emails can register an account. Attach a layer to [AWS Lambda Trigger](serverless/README.md) and activate the Lambda into Pre-Auth and Pre-Signup. Make sure to add the correct policies to access the Cognito User-Pools and DynamoDb.
- Set Up a table in DynamoDb to have Item sorted by student and employee. 
- [Lambda Function on AWS](serverless/AWSLambdaFunctions/LambdaPreAuth.js). use this to run this project.
- [Lambda Function on AWS](serverless/AWSLambdaFunctions/LambdaPreSignup.js). use this to run this project.
- [Lambda Function example for Google Auth and Apple Auth](serverless/pre_signup.js). Example Code but needs some refactoring to add into this project.
- Create a zip file to add into your lambda for a layer. Just attach this code to your lambda function and your set!
- this also will work serverless and Docker.