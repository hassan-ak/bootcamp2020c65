# Basic SQS

## Steps to code

1. Create new directory using `mkdir step0_basic_example`
2. Navigate to newly created directory using `cd step0_basic_example`
3. Create cdk v1 app using `cdk init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Install simple qeue services in the stack using `npm i @aws-cdk/aws-sqs`. Update "./lib/step0_basic_example-stack.ts" to define a queue

   ```js
   import * as sqs from '@aws-cdk/aws-sqs';
   const basicDefaultQueue = new sqs.Queue(this, 'basicSqs', {
     queueName: 'simpleSQS',
     encryption: sqs.QueueEncryption.UNENCRYPTED,
     retentionPeriod: cdk.Duration.days(4),
     fifo: false,
     maxMessageSizeBytes: 262144,
     visibilityTimeout: cdk.Duration.seconds(30),
     // deadLetterQueue: {
     //   maxReceiveCount: ,
     //   queue: ,
     // }
   });
   ```

6. Deploy using `cdk deploy`
7. This stack will do nothing just a queue will be set up and can be used with any other service
8. Destroy using `cdk destroy`
