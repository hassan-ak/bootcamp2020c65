# Step17 - Simple notification service

## Class Notes

- If messag are not sent they can be stored in quee for some period
- Filters can be applied on some message but filters only work on json objects (optional)

## Sections

- [Subscribing HTTPS to an SNS topic](./step00_httpsSubscription)
- [Subscribing Lambda to an SNS topic](./step01_lambdaSubscription)
- [Subscribing SQS to an SNS topic](./step02_sqsSubscription)
- [Subscribing Email to an SNS topic](./step03_emailSubscription)
- [Subscribing SMS to an SNS topic](./step04_smsSubscription)
- [Publishing data on an SNS topic using eventbridge](./step05_publish_using_event)

### Reading Material

- [What is Amazon SNS?](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)
- [aws-sns module](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-sns-readme.html)
- [aws-sns-subscriptions module](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-sns-subscriptions-readme.html)
- [Configuring an Amazon SNS dead-letter queue for a subscription](https://docs.aws.amazon.com/sns/latest/dg/sns-configure-dead-letter-queue.html)
