import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dynamodbClient = new DynamoDB.DocumentClient();

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {

  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from create!'
  };

  try {
    if(event.queryStringParameters) {
      if (PRIMARY_KEY! in event.queryStringParameters) {
        result.body = await queryWithPrimaryPartition(event.queryStringParameters);
      } else {
        result.body = await queryWithSecondartPartition(event.queryStringParameters);
      }
    } else {
      result.body = await scanItems();
    }
  } catch (error) {
    result.body = (error as Error).message;
  }

  return result;
}

const scanItems = async () => {
  const queryResponse = await dynamodbClient.scan({
    TableName: TABLE_NAME!,
  }).promise();

  return JSON.stringify(queryResponse.Items);
}

const queryWithSecondartPartition = async (queryParameters: APIGatewayProxyEventQueryStringParameters) => {
  const queryKey = Object.keys(queryParameters)[0];
  const queryValue = queryParameters[queryKey];
  const queryResponse = await dynamodbClient.query({
    TableName: TABLE_NAME!,
    IndexName: queryKey,
    KeyConditionExpression: '#zz = :zzzz',
    ExpressionAttributeNames: {
      '#zz': queryKey
    },
    ExpressionAttributeValues: {
      ':zzzz': queryValue
    }
  }).promise();

  return JSON.stringify(queryResponse.Items);

}

const queryWithPrimaryPartition = async (queryParameters: APIGatewayProxyEventQueryStringParameters) => {
  const keyValue = queryParameters[PRIMARY_KEY!];
  const queryResponse = await dynamodbClient.query({
    TableName: TABLE_NAME!,
    KeyConditionExpression: '#zz = :zzzz',
    ExpressionAttributeNames: {
      '#zz': PRIMARY_KEY!
    },
    ExpressionAttributeValues: {
      ':zzzz': keyValue
    }
  }).promise();

  return JSON.stringify(queryResponse.Items);

}

export { handler }