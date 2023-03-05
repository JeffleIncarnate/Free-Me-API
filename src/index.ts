import express, { Request, Response, Application } from "express";

const app: Application = express();
let port = 3000;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  return res.send({ detail: "Welcome to the Free me API" });
});

// fallback
app.all("*", async (req: Request, res: Response) => {
  return res.send({
    detail: "This endpoint does not exist.",
    endpoint: { detail: `'${req.url}' does not exist.` },
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
