# Publishing data on an SNS topic using eventbridge

## Stesp to code

1. Create new directory using `mkdir step05_publish_using_event`
2. Navigate to newly created directory using `cd step05_publish_using_event`
3. Create cdk app using `cdk init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Install appSync module using `npm i @aws-cdk/aws-appsync`. Update "./lib/step05_publish_using_event-stack.ts" to create a new GQL api to invoke the producer function

   ```js
   import * as appsync from '@aws-cdk/aws-appsync';
   const api = new appsync.GraphqlApi(this, 'Api', {
     name: 'appsyncEventbridgeAPI',
     schema: appsync.Schema.fromAsset('schema/schema.graphql'),
     authorizationConfig: {
       defaultAuthorization: {
         authorizationType: appsync.AuthorizationType.API_KEY,
         apiKeyConfig: {
           expires: cdk.Expiration.after(cdk.Duration.days(365)),
         },
       },
     },
     logConfig: { fieldLogLevel: appsync.FieldLogLevel.ALL },
     xrayEnabled: true,
   });
   ```

6. Create ".schema/schema.graphql" to define schema for the api

   ```gql
   type Event {
     result: String
   }
   type Query {
     getEvent: [Event]
   }
   type Mutation {
     createEvent(event: String!): Event
   }
   ```
