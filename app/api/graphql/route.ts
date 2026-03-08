import { createYoga, createSchema } from "graphql-yoga";
import { typeDefs } from "@/lib/graphql/schema";
import { resolvers } from "@/lib/graphql/resolvers";
import { graphqlRequestDuration, graphqlRequestTotal } from "@/lib/metrics/registry";
import { OperationDefinitionNode } from "graphql";

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/api/graphql",
  plugins: [
    {
      onExecute({ args }: { args: any }) {
        const operationName: string =
          args.operationName ??
          (args.document?.definitions?.find(
            (d: OperationDefinitionNode) => d.kind === "OperationDefinition"
          ) as OperationDefinitionNode | undefined)?.name?.value ??
          "anonymous";

        const end = graphqlRequestDuration.startTimer({
          operation: operationName,
          status: "success",
        });

        return {
          onExecuteDone() {
            end();
            graphqlRequestTotal.inc({ operation: operationName, status: "success" });
          },
        };
      },
    },
  ],
});

export async function GET(request: Request) {
  return yoga.fetch(request);
}

export async function POST(request: Request) {
  return yoga.fetch(request);
}
