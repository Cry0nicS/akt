import {Service} from "typedi";
import {DataSource, Repository} from "typeorm";
import {User} from "../models/user";

@Service()
class UserRepository extends Repository<User> {
    private readonly userRepository: Repository<User>;

    public constructor(dataSource: DataSource) {
        super(User, dataSource.manager);

        this.userRepository = dataSource.getRepository(User);
    }
}

export {UserRepository};
