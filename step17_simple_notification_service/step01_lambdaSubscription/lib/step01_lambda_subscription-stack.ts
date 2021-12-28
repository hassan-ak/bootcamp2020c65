import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_sqs as sqs } from 'aws-cdk-lib';
import { aws_sns as sns } from 'aws-cdk-lib';
import { aws_sns_subscriptions as subscriptions } from 'aws-cdk-lib';

export class Step01LambdaSubscriptionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // create a lambda function
    const helloLambda = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler',
    });

    // adding a dead letter queue
    const dlQueue = new sqs.Queue(this, 'DeadLetterQueue', {
      queueName: 'MySubscription_DLQ',
      retentionPeriod: Duration.days(1),
    });

    // create an SNS topic
    const myTopic = new sns.Topic(this, 'MyTopic');

    // subscribe lambda function to the topic
    // we have also assinged a filter policy here.
    //  The SNS will only invoke the lambda function if the message published on
    // the topic satisfies the condition in the filter.
    // We have also assigned a dead letter queue to store the failed events
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
  }
}
