import { MovieDA } from "../da"; 
import { IMovie, IMovieInputDTO } from "../interfaces/IMovie"; 

export class MovieService {

    constructor(private movieda: MovieDA) { }
   
    public async GetAllMovies() {
        try {
            const data = await this.movieda.GetAllMovies();
            return data;
        } catch (error) {
            throw error;
        }
    } 

    public async InsertMovies(movies : [IMovieInputDTO]) {
        for (var newM of movies) {
            this.movieda.CreateMovie(newM);
        } 
    }   
}