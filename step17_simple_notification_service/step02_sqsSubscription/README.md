# Subscribing SQS to an SNS topic

## Steps to code

1. Create new directory using `mkdir step02_sqsSubscription`
2. Navigate to newly created directory using `cd step02_sqsSubscription`
3. Create cdk app using `cdk init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Install simple notification module using `npm i @aws-cdk/aws-sns`. Update "./lib/step02_sqsSubscription-stack.ts" to create a new topic

   ```js
   import * as sns from '@aws-cdk/aws-sns';
   const myTopic = new sns.Topic(this, 'MyTopic');
   ```

6. Install simple quee module using `npm i @aws-cdk/aws-sqe`. Update "./lib/step02_sqsSubscription-stack.ts" to create a new que for subscription

   ```js
   import * as sqs from '@aws-cdk/aws-sqs';
   const myQueue = new sqs.Queue(this, 'MyQueue');
   ```

7. Update "./lib/step02_sqsSubscription-stack.ts" to create a dead letter que

   ```js
   const dlQueue = new sqs.Queue(this, 'DeadLetterQueue', {
     queueName: 'MySubscription_DLQ',
     retentionPeriod: cdk.Duration.days(1),
   });
   ```

8. Update "./lib/step02_sqsSubscription-stack.ts" to create a subscription for the simple queue

   ```js
   import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
   myTopic.addSubscription(
     new subscriptions.SqsSubscription(myQueue, {
       filterPolicy: {
         test: sns.SubscriptionFilter.stringFilter({
           whitelist: ['test'],
         }),
       },
       deadLetterQueue: dlQueue,
     })
   );
   ```

9. Deploy the app using `cdk deploy`.

10. We can add message attributes to the message and these are the one on which filter is going to be be applied

11. Publish a new message from topics tab and check qeue for the recieved message we have to pull message there
12. Destroy the app using `cdk destroy`
