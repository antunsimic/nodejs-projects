import express from "express";
import "dotenv/config";
import methodOverride from "method-override";
import currencyExchange from "./routes/currencyExchange.js"; // Import the specialized route
import stickyNotes from "./routes/stickyNotes.js";
import movieBackend from "./routes/movieBackend.js";

const app = express();


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}



app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    return req.body._method;
  }
  return req.method; 

}));

app.use("/currencyExchange", currencyExchange);
app.use("/stickyNotes", stickyNotes);
app.use("/movieBackend", movieBackend);

app.get("/",  (req, res) => {
  res.redirect("https://antunsimic.github.io/resume/")
    
 });


 app.use((req, res) => {
  res.redirect("/");
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



