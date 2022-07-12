import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent,APIGatewayProxyResult, Context } from "aws-lambda";
import { getEventBody } from "../common/Utils";

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

const handler = async (event: APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult> => {

  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: ''
  }

  const requestBody = getEventBody(event);
  const primaryValue = event.queryStringParameters?.[PRIMARY_KEY];

  if (requestBody && primaryValue) {
    try {
      const requestBodyKey = Object.keys(requestBody)[0];
      const requestBodyValue = requestBody[requestBodyKey];

      const updateResult = dbClient.update({
        TableName: TABLE_NAME,
        Key: {
          [PRIMARY_KEY]: primaryValue
        },
        UpdateExpression: 'set #zzzNew = :new',
        ExpressionAttributeValues: {
          ':new': requestBodyValue,
        },
        ExpressionAttributeNames: {
          '#zzzNew': requestBodyKey
        },
        ReturnValues: 'UPDATED_NEW'
      }).promise();

      result.body = JSON.stringify(updateResult);

    } catch (error) {
      result.body = JSON.stringify(error);
      
    }
    
  }

  return result;

} 

export { handler };