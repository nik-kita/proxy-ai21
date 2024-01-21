import { Hono } from "hono";
import { load } from "dotenv";

const headers = new Headers({
  authorization: `Bearer ${
    Deno.env.get("AI21_API_KEY") ?? (await load())["AI21_API_KEY"]
  }`,
  "content-type": "application/json",
});
const app = new Hono();

app.post("/:model_type?", async (c) => {
  const model_type = c.req.param("model_type") ?? "ultra";
  const body = await c.req.json();

  return fetch(`https://api.ai21.com/studio/v1/j2-${model_type}/complete`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
});

app.all("*", (c) => {
  return c.json({
    message: "Not Found",
    tip: "https://docs.ai21.com/reference/j2-complete-ref",
  }, 404);
});

Deno.serve(app.fetch);
