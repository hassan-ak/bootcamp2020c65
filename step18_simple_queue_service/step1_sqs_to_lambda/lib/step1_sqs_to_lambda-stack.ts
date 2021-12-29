import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import * as sqs from '@aws-cdk/aws-sqs';
import * as lambdaEvents from '@aws-cdk/aws-lambda-event-sources';

export class Step1SqsToLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function to get notifications
    const sqsLambda = new lambda.Function(this, 'sqsLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '/../', 'lambda')),
      handler: 'index.handler',
      reservedConcurrentExecutions: 5, // only have 5 invocations at a time, having this <5 has a problem?
    });

    // Defien a queue
    const queue = new sqs.Queue(this, 'testQueue', {
      queueName: 'testQueue',
      encryption: sqs.QueueEncryption.UNENCRYPTED,
      retentionPeriod: cdk.Duration.days(4),
      visibilityTimeout: cdk.Duration.seconds(30), // default,
      receiveMessageWaitTime: cdk.Duration.seconds(20), // default
    });

    sqsLambda.addEventSource(
      new lambdaEvents.SqsEventSource(queue, {
        batchSize: 10,
      })
    );
  }
}
