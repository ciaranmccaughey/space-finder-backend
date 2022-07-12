import { APIGatewayProxyEvent } from "aws-lambda";

const generateRandomId = () => Math.random().toString(32).slice(2);
const getEventBody = (event: APIGatewayProxyEvent) => typeof event.body == 'object' ? event.body : JSON.parse(event.body);

export { generateRandomId, getEventBody }