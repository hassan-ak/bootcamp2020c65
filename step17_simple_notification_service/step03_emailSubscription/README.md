# Subscribing Email to an SNS topic

## Steps to code

1. Create new directory using `mkdir step03_emailSubscription`
2. Navigate to newly created directory using `cd step03_emailSubscription`
3. Create cdk app using `cdk init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Install simple notification module using `npm i @aws-cdk/aws-sns`. Update "./lib/step03_emailSubscription-stack.ts" to create a new topic

   ```js
   import * as sns from '@aws-cdk/aws-sns';
   const myTopic = new sns.Topic(this, 'MyTopic');
   ```

6. Install simple quee module using `npm i @aws-cdk/aws-sqe`. Update "./lib/step03_emailSubscription-stack.ts" to create a dead letter qeue

   ```js
   import * as sqs from '@aws-cdk/aws-sqs';
   const dlQueue = new sqs.Queue(this, 'DeadLetterQueue', {
     queueName: 'MySubscription_DLQ',
     retentionPeriod: cdk.Duration.days(14),
   });
   ```

7. Install sns subscriptions using `npm i @aws-cdk/aws-sns-subscriptions`. Update "./lib/step03_emailSubscription-stack.ts" to create a subscription for the email

   ```js
   import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
   myTopic.addSubscription(
     new subscriptions.EmailSubscription('Email Here', {
       json: false,
       deadLetterQueue: dlQueue,
     })
   );
   ```

8. Deploy the app using `cdk deploy`.

9. First we need to verify on the email

10. We can add message attributes to the message and these are the one on which filter is going to be be applied

11. Publish a new message from topics tab and check email for the message
12. Destroy the app using `cdk destroy`
