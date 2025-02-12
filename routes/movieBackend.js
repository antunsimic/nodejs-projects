import express from "express";
import cors from 'cors'
import rateLimit from "express-rate-limit";



const router = express.Router();



router.use(express.json()); // Parses JSON request bodies

const movieRateLimiter = rateLimit({
  windowMs: 2000, // 2 second
  limit: 3, // Limit each IP to 3 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req, res) => req.method === 'OPTIONS' // ✅ Skip preflight requests
});

router.use('/movie', movieRateLimiter)


const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', "https://movie-recommendation-by-antun.vercel.app"]; // Add all allowed frontends
const corsOptions = {
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  allowedHeaders: ['Content-Type'],
  maxAge: 600,
};

router.use(cors(corsOptions));

// Handle CORS preflight for all routes
router.options('*', cors(corsOptions));


function getRandom1To(max) {
  let n = Math.random();
  n *= max;
  n = Math.floor(n) + 1;
  return n;
}


async function getMovie(country, prominence, christmas) {
  const lower = Math.min(country.population, 300) 
  let vote_greater; 
  let vote_lower = 100000000;;
  if (country.population * 3 < 100) {
    // small country
    const upper = 100
    vote_greater = upper;
    
    if (prominence === "Locally Well Known") {
      vote_greater = lower;
    } 
    
  } else {
    //big country
    const upper = Math.min(country.population * 3, 1000)
    vote_greater = upper;
    if (prominence === "Hidden Gem") {
      vote_greater = lower;
      vote_lower = upper;
    } 

  }
  const queryParams = new URLSearchParams({
    include_adult: 'false',
    include_video: 'false',
    page: 1,
    'release_date.gte': '1950-01-01',
    'primary_release_date.gte': '1950-01-01',
    sort_by: 'popularity.desc',
    'vote_average.gte': '6.9',
    'vote_count.gte': vote_greater,
    'vote_count.lte': vote_lower,
    with_origin_country: country.iso,
    without_keywords: 207317
  }).toString();

  let url = `https://api.themoviedb.org/3/discover/movie?${queryParams}`
  if (christmas) {
    url = url.replace("without_keywords=207317", "with_keywords=207317")
  }

let response = await fetch(url, {
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + process.env.MR_TOKEN, // Replace with your actual token
    accept: 'application/json',
  } 
})


let resData = await response.json();
      let result1;
      if (resData.results.length > 0) {
    
        if (resData.total_pages > 1) {
          url = url.replace("page=1", "page="+getRandom1To(resData.total_pages))
          response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + process.env.MR_TOKEN, // Replace with your actual token
              accept: 'application/json',
            } 
          })
          resData = await response.json();

        }
    
    
     //   console.log("chose movie " + n + " within the page")
        result1 = resData.results[getRandom1To(resData.results.length)-1];
      } else {
        if (prominence === "Globally Recognized") {
        return await  getMovie(country, "Locally Well Known", christmas)

        } else {

        
        if (!christmas) {
          result1 = {
            backdrop_path: "/images/no_movie.png",
            title: "No movie found",
            overview: "We don't know of any good movies from " + country.english_name + ". Come back in the future - new films get added to TMDB all the time!",
          }
        }
        else {
          result1 = {
            backdrop_path: "/images/bad_christmas.jpg",
            title: "No movie found",
            overview: country.english_name + " doesn't have any beloved Christmas films.",
          }
        }
        } }
return result1;
}


router.post("/", async (req, res) => {

   res.json(await getMovie(req.body.country, req.body.prominence, req.body.christmas))
   
});




export default router;


