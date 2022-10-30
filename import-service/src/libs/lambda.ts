import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import middyInputOutputLogger from "@middy/input-output-logger"

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(middyInputOutputLogger());
}
