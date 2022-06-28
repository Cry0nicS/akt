import {Service} from "typedi";
import {UserRepository} from "../repositories/user";
import {User} from "../models/user";
import type {CreateUserInput} from "../types/create-user";

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
}

export {UserService};
