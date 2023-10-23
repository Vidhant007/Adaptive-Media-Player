const getMovies = async(req,res)=>{
    res.send("Get Movies");
}

//runs with the player middleware
const getMovieDetails = async(req,res)=>{
    res.send("Get Movies Details");
}



module.exports = {
    GETMOVIES:getMovies,
    GETMOVIEDETAILS:getMovieDetails,
}
