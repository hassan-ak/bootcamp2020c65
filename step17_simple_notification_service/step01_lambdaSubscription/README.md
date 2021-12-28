# Subscribing Lambda to an SNS topic

## Steps to code

1. Create new directory using `mkdir step01_lambdaSubscription`
2. Navigate to newly created directory using `cd step01_lambdaSubscription`
3. Create cdk app using `cdk init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Update "./lib/step01_lambdaSubscription-stack.ts" to create a lambda function.

   ```js
   import { aws_lambda as lambda } from 'aws-cdk-lib';
   const helloLambda = new lambda.Function(this, 'HelloHandler', {
     runtime: lambda.Runtime.NODEJS_14_X,
     code: lambda.Code.fromAsset('lambda'),
     handler: 'hello.handler',
   });
   ```

6. Update "./lib/step01_lambdaSubscription-stack.ts" to create a dead letter que

   ```js
   import { aws_sqs as sqs } from 'aws-cdk-lib';
   const dlQueue = new sqs.Queue(this, 'DeadLetterQueue', {
     queueName: 'MySubscription_DLQ',
     retentionPeriod: Duration.days(1),
   });
   ```

7. Update "./lib/step01_lambdaSubscription-stack.ts" to create a new topic

   ```js
   import { aws_sns as sns } from 'aws-cdk-lib';
   const myTopic = new sns.Topic(this, 'MyTopic');
   ```

8. Update "./lib/step01_lambdaSubscription-stack.ts" to create a subscription for the lambda function

   ```js
   import { aws_sns_subscriptions as subscriptions } from 'aws-cdk-lib';
   myTopic.addSubscription(
     new subscriptions.LambdaSubscription(helloLambda, {
       filterPolicy: {
         test: sns.SubscriptionFilter.numericFilter({
           between: { start: 100, stop: 200 },
         }),
       },
       deadLetterQueue: dlQueue,
     })
   );
   ```

9. Create "./lambda/hello.ts" to defien lambda handler code

   ```js
   import { SNSEvent, Context } from 'aws-lambda';

   export async function handler(event: SNSEvent, context: Context) {
     // logging the event generated by SNS
     console.log(event.Records[0].Sns);
   }
   ```

10. Deploy the app using `cdk deploy`.

11. We can add message attributes to the message and these are the one on which filter is going to be be applied

12. Publish a new message from topics tab and check the log for the recieved message.
13. Destroy the app using `cdk destroy`