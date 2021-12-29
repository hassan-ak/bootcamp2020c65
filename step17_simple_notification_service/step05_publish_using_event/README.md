# Publishing data on an SNS topic using eventbridge

## Stesp to code

1. Create new directory using `mkdir step05_publish_using_event`
2. Navigate to newly created directory using `cd step05_publish_using_event`
3. Create cdk app using `cdk init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Install appSync module using `npm i @aws-cdk/aws-appsync`. Update "./lib/step05_publish_using_event-stack.ts" to create a new GQL api to invoke the producer function

   ```js
   import * as appsync from '@aws-cdk/aws-appsync';
   const api = new appsync.GraphqlApi(this, 'Api', {
     name: 'appsyncEventbridgeAPI',
     schema: appsync.Schema.fromAsset('schema/schema.graphql'),
     authorizationConfig: {
       defaultAuthorization: {
         authorizationType: appsync.AuthorizationType.API_KEY,
         apiKeyConfig: {
           expires: cdk.Expiration.after(cdk.Duration.days(365)),
         },
       },
     },
     logConfig: { fieldLogLevel: appsync.FieldLogLevel.ALL },
     xrayEnabled: true,
   });
   ```

6. Create ".schema/schema.graphql" to define schema for the api

   ```gql
   type Event {
     result: String
   }
   type Query {
     getEvent: [Event]
   }
   type Mutation {
     createEvent(event: String!): Event
   }
   ```

7. Update "./lib/step05_publish_using_event-stack.ts" to create a http data source for the api. Isntall events using `npm i @aws-cdk/aws-events` and grant put access to http data source

   ```js
   import * as events from '@aws-cdk/aws-events';
   const httpDs = api.addHttpDataSource(
     'ds',
     'https://events.' + this.region + '.amazonaws.com/', // This is the ENDPOINT for eventbridge.
     {
       name: 'httpDsWithEventBridge',
       description: 'From Appsync to Eventbridge',
       authorizationConfig: {
         signingRegion: this.region,
         signingServiceName: 'events',
       },
     }
   );
   events.EventBus.grantAllPutEvents(httpDs);
   ```

8. Update "./lib/step05_publish_using_event-stack.ts" to create resolvers for the api

   ```js
   const putEventResolver = httpDs.createResolver({
     typeName: 'Mutation',
     fieldName: 'createEvent',
     requestMappingTemplate: appsync.MappingTemplate.fromFile('request.vtl'),
     responseMappingTemplate: appsync.MappingTemplate.fromFile('response.vtl'),
   });
   ```

9. create "request.vtl" to define request maping template

   ```vtl
   {
       "version": "2018-05-29",
       "method": "POST",
       "resourcePath": "/",
       "params": {
           "headers": {
               "content-type": "application/x-amz-json-1.1",
               "x-amz-target":"AWSEvents.PutEvents"
            },
            "body": {
                "Entries":[
                    {
                        "Source":"eru-appsync-events",
                        "EventBusName": "default",
                        "Detail":"{ \"event\": \"$ctx.arguments.event\"}",
                        "DetailType":"Event Bridge via GraphQL"
                    }
                ]
            }
        }
   }
   ```

10. create "response.vtl" to define response maping template

    ```vtl
    #if($ctx.error)
        $util.error($ctx.error.message, $ctx.error.type)
    #end
    #if($ctx.result.statusCode == 200)
        {
            "result": "$util.parseJson($ctx.result.body)"
        }
    #else
        $utils.appendError($ctx.result.body, $ctx.result.statusCode)
    #end
    ```

11. Install simple notification module using `npm i @aws-cdk/aws-sns`. Update "./lib/step05_publish_using_event-stack.ts" to create a new topic

    ```js
    import * as sns from '@aws-cdk/aws-sns';
    const myTopic = new sns.Topic(this, 'MyTopic');
    ```

12. Install simple quee module using `npm i @aws-cdk/aws-sqs`. Update "./lib/step05_publish_using_event-stack.ts" to create a dead letter qeue

    ```js
    import * as sqs from '@aws-cdk/aws-sqs';
    const dlQueue = new sqs.Queue(this, 'DeadLetterQueue', {
      queueName: 'MySubscription_DLQ',
      retentionPeriod: cdk.Duration.days(14),
    });
    ```

13. Install sns subscriptions using `npm i @aws-cdk/aws-sns-subscriptions`. Update "./lib/step05_publish_using_event-stack.ts" to create a subscription for the email

    ```js
    import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
    myTopic.addSubscription(
      new subscriptions.EmailSubscription('Email Here', {
        json: false,
        deadLetterQueue: dlQueue,
      })
    );
    ```

14. Update "./lib/step05_publish_using_event-stack.ts" to create a new rule for event

    ```js
    const rule = new events.Rule(this, 'AppSyncEventBridgeRule', {
      eventPattern: {
        source: ['eru-appsync-events'], // every event that has source = "eru-appsync-events" will be sent to SNS topic
      },
    });
    ```

15. Install aws event targets using `npm i @aws-cdk/aws-events-targets` and update "./lib/step05_publish_using_event-stack.ts" and tpoic as target to rule

    ```js
    import * as targets from '@aws-cdk/aws-events-targets';
    rule.addTarget(new targets.SnsTopic(myTopic));
    ```

16. Deploy the app using `cdk deploy`

17. To your email and verify it. verification can be seen in the Topic tab of SNS console
18. Using GQL api send notification

19. Destroy the app using `cdk destroy`
