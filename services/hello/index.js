
exports.main = async function name(event, context) {
  return {
    statusCode: 200,
    body: 'hello from lambda'
  }
}