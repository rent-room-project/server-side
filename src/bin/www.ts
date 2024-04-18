import app from "../app";
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.clear();
  console.log(`Example app listening on port ${port}`);
});
