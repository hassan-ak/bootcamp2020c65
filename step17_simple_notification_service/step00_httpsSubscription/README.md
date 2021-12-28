# Subscribing HTTPS to an SNS topic

## Steps to code

1. Create new directory using `mkdir step00_httpsSubscription`
2. Navigate to newly created directory using `cd step00_httpsSubscription`
3. Create cdk app using `cdk init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Update "./lib/step00_httpsSubscription-stack.ts" to create a lambda function.

   ```js
   import { aws_lambda as lambda } from 'aws-cdk-lib';
   const hello = new lambda.Function(this, 'HelloHandler', {
     runtime: lambda.Runtime.NODEJS_14_X,
     code: lambda.Code.fromAsset('lambda'),
     handler: 'hello.handler',
   });
   ```

6. Update "./lib/step00_httpsSubscription-stack.ts" to create a api gateway endpoint

   ```js
   import { aws_apigateway as apigw } from 'aws-cdk-lib';
   const api = new apigw.LambdaRestApi(this, 'Endpoint', {
     handler: hello,
   });
   ```

7. Update "./lib/step00_httpsSubscription-stack.ts" to create a new topic

   ```js
   import { aws_sns as sns } from 'aws-cdk-lib';
   const myTopic = new sns.Topic(this, 'MyTopic');
   ```

8. Update "./lib/step00_httpsSubscription-stack.ts" to create a subscription for the https endpoint

   ```js
   import { aws_sns_subscriptions as subscriptions } from 'aws-cdk-lib';
   myTopic.addSubscription(
     new subscriptions.UrlSubscription(api.url, {
       protocol: sns.SubscriptionProtocol.HTTPS,
     })
   );
   ```

9. Create "./lambda/hello.ts" to defien lambda handler code

   ```js
   import {
     APIGatewayProxyEvent,
     APIGatewayProxyResult,
     Context,
   } from 'aws-lambda';

   export async function handler(
     event: APIGatewayProxyEvent,
     context: Context
   ): Promise<APIGatewayProxyResult> {
     // the messages sent by SNS are recieved in the event's body
     const data = JSON.parse(event.body!);

     // we are logging the data coming from SNS. You can view it in the cloudWatch log events.
     console.log(data);

     return {
       statusCode: 200,
       headers: { 'Content-Type': 'text/plain' },
       body: `Hello World`,
     };
   }
   ```

10. Deploy the app using `cdk deploy`.

11. After deployment a lambda conformation link is loged in lambda console. Visit the link to confirm subscription.

12. Publish a new message from topics tab and check the log for the recieved message.
13. Destroy the app using `cdk destroy`
