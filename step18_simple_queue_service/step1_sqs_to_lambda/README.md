# SQS to lambda

## Steps to code

1. Create new directory using `mkdir step1_sqs_to_lambda`
2. Navigate to newly created directory using `cd step1_sqs_to_lambda`
3. Create cdk v1 app using `cdk init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Install lambda in the stack using `npm i @aws-cdk/aws-lambda`. Update "./lib/step1_sqs_to_lambda-stack.ts" to define a lambda function so it recieves the notification

   ```js
   import * as lambda from '@aws-cdk/aws-lambda';
   import * as path from 'path';
   const sqsLambda = new lambda.Function(this, 'sqsLambda', {
     runtime: lambda.Runtime.NODEJS_14_X,
     code: lambda.Code.fromAsset(path.join(__dirname, '/../', 'lambda')),
     handler: 'index.handler',
     reservedConcurrentExecutions: 5,
   });
   ```

6. Install simple qeue services in the stack using `npm i @aws-cdk/aws-sqs`. Update "./lib/step1_sqs_to_lambda-stack.ts" to define a queue

   ```js
   import * as sqs from '@aws-cdk/aws-sqs';
   const queue = new sqs.Queue(this, 'testQueue', {
     queueName: 'testQueue',
     encryption: sqs.QueueEncryption.UNENCRYPTED,
     retentionPeriod: cdk.Duration.days(4),
     visibilityTimeout: cdk.Duration.seconds(30),
     receiveMessageWaitTime: cdk.Duration.seconds(20),
   });
   ```

7. Install aws lambda event sources in the stack using `npm i @aws-cdk/aws-lambda-event-sources`. Update "./lib/step1_sqs_to_lambda-stack.ts" to add event source to the lambda function

   ```js
   import * as lambdaEvents from '@aws-cdk/aws-lambda-event-sources';
   sqsLambda.addEventSource(
     new lambdaEvents.SqsEventSource(queue, {
       batchSize: 10,
     })
   );
   ```

8. Create "./lambda/index.ts" to define lambda function handler

   ```js
   exports.handler = async (event: any, context: any) => {
     event.Records.forEach((record: any) => {
       const { body } = record;
       console.log(body);
     });
     return {};
   };
   ```

9. Deploy using `cdk deploy`
10. Go to Queue console and send message
11. Sent message will be recieved in the lambda function
12. Destroy using `cdk destroy`
