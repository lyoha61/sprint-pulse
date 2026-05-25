import e from "express";

const app = e();
const PORT = 3000;

app.listen(PORT, () => {
	console.log(`app listening on port ${PORT}`);
})