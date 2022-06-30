import {Service} from "typedi";
import {UserRepository} from "../repositories/user";
import {User} from "../models/user";
import type {CreateUserInput} from "../types/create-user";
import type {LoginResponse} from "../resolvers/login-response";
import type {LoginUserInput} from "../types/login-user";

@Service()
class UserService {
    private readonly userRepository: UserRepository;

    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async create(data: CreateUserInput): Promise<User> {
        const user = Object.assign(new User(), data);

        return this.userRepository.save(user);
    }

    public async getOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder("u")
            .where("u.email = :email", {email})
            .getOne();

        if (!user) throw new Error("Email or password incorrect.");

        return user;
    }

    public async login(email: string, password: string): Promise<LoginResponse> {
        const user = await this.getOneByEmail(email);

        if (await user.verifyPassword(password)) {
            return {
                token: "to-do"
            };
        }

        throw new Error("You have entered an invalid username or password.");
    }
}

export {UserService};
