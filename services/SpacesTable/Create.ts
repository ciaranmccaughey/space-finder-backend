import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent,APIGatewayProxyResult, Context } from "aws-lambda";
import { inputValidator, MissingInputError } from "../common/inputValidator";
import { generateRandomId, getEventBody } from "../common/Utils";

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

const handler = async (event: APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult> => {

  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: ''
  }
  
  try {
    const item = getEventBody(event);
    item.spaceId = generateRandomId();
    
    inputValidator(item);

    await dbClient.put({
      TableName: TABLE_NAME!,
      Item: item
    }).promise()

    result.body = JSON.stringify(`Created Item with id: ${item.spaceId}`);

  } catch (error) {
    result.statusCode = 500;
    if (error instanceof MissingInputError) {
      result.statusCode = 403;
    }
    result.body = (error as Error).message;
  }

  return result;

} 

export { handler };