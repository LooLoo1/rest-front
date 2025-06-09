import axiosInstance from "./client";
import type {
  AuthenticationRequest,
  RegisterRequest,
  User,
  UserProfileDTO,
  Movie,
  MovieDTO,
  WatchListRequest,
} from "./types";

class ApiService {
  // ===================
  // 🧑 Auth & Users
  // ===================

  async login(data: AuthenticationRequest): Promise<{ token: string }> {
    return this._post("/auth", data);
  }

  async register(data: RegisterRequest): Promise<User> {
    return this._post("/users/register", data);
  }

  async getCurrentUser(): Promise<User> {
    return this._get("/users/me");
  }

  async getMe(): Promise<UserProfileDTO> {
    return this._get("/users/profile");
  }

  // ===================
  // 🎬 Movies
  // ===================

  async getMovies(limit = 40): Promise<MovieDTO[]> {
    return this._get("/movies", { params: { limit } });
  }

  async getMovieById(id: string): Promise<Movie> {
    return this._get(`/movies/${id}`);
  }

  async getMovieByTitle(title?: string): Promise<Movie> {
    return this._get("/movies/title", { params: { title } });
  }

  async searchMovies(keyword?: string): Promise<Movie[]> {
    return this._get("/movies/search", { params: { keyword } });
  }

  async getFiveMovies(): Promise<MovieDTO[]> {
    return this._get("/movies/get-5")
  }

  async getRandomMovie(): Promise<Movie> {
    return this._get("/movies/random");
  }
  
  async setMovieStatus(data: WatchListRequest): Promise<Movie> {
    return this._post("/status/add", data);
  }

  async removeMovieStatus(userId: number, movieId: string): Promise<void> {
    return this._delete("/status/remove", { params: { userid: userId, movieId } });
  }

  // ===================
  // 🤖 AI Chat
  // ===================

  async sendMessage(message: string): Promise<string> {
    return this._post("/api/ai/messages", message, {
      headers: { "Content-Type": "application/json" },
    });
  }

  // ===================
  // 🛠️ Private helpers
  // ===================

  private async _get<T = unknown>(url: string, config?: object): Promise<T> {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  }

  private async _post<T = unknown>(url: string, data?: unknown, config?: object): Promise<T> {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  private async _delete<T = unknown>(url: string, config?: object): Promise<T> {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();
