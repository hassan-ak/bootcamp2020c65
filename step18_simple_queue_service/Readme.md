# Step18 - Amazon Simple Queue Service (SQS)

## Class Notes

SQS is a very important service for Event driven architecture. It is usually a key component of our messaging system. We will send our events or messages to the SQS queue and it will have a consumer that pulls messages from that queue and processes them, this can be done in batches. This way SQS is able to store our events in the form of a queue.

Note that SQS will not send messages to its consumers by itself, the consumers will have to PULL messages from the queue. Whenever a message is requested by a consumer, the SQS service marks that message as hidden but does not delete it. It can be used with SNS or as an event bridge.

SNS and SQS are message delievery system, both of them save messages but SNS sends messages through topics while SQS through ques.

## Sections

- [Basic SQS](./step0_basic_example)
- [SQS to lambda](./step1_sqs_to_lambda)

## Reading Material

- [Call me Maybe](https://www.youtube.com/watch?v=9IYpGTS7Jy0&t=1476s&ab_channel=AWSEvents)
- [The Big Fan](https://www.youtube.com/watch?v=9IYpGTS7Jy0&t=1808s)
- [The Big Fan TypeScript](https://github.com/cdk-patterns/serverless/tree/main/the-big-fan/typescript)
- [The Scalable Webhook](https://github.com/cdk-patterns/serverless/blob/main/the-scalable-webhook/README.md)
