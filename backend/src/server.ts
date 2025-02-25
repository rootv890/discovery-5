import express from "express";
import env from "./config/env";

import { CategoriesRouter } from "./routes/categories.route";
import { PlatformsRouter } from "./routes/platforms.route";
import { ToolsRouter } from "./routes/tools.route";
const app = express();
app.use(express.json());

// Auth Routers
app.get("/", (req, res) => {
	res.send("Hello World");
});

app.get(`${env.API_URL}/hi`, (req, reply) => {
	reply.send({
		message: "Hello World",
	});
});

app.use(`${env.API_URL}/platforms`, PlatformsRouter);
app.use(`${env.API_URL}/categories`, CategoriesRouter);
app.use(`${env.API_URL}/tools`, ToolsRouter);

// Test protecd router
// app.get( `/${ env.API_URL }/protected`, authenticateToken, ( req, reply ) => {
//   reply.send( {
//     message: "Protected route",
//     data: req.body.user ?? null,
//   } );
// } );

// Server
app.listen(env.PORT, () => {
	console.log(`Server started @ http://localhost:${env.PORT}`);
});

// export default app;
