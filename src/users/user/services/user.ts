import type {CreateUserInput} from "../types/create-user";
import {importPKCS8, importSPKI, jwtVerify, SignJWT} from "jose";
import {Service} from "typedi";
import {UserRepository} from "../repositories/user";
import {User} from "../models/user";

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

    public async getOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({id});

        if (!user) throw new Error("User not found.");

        return user;
    }

    public async getOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder("u")
            .where("u.email = :email", {email})
            .getOne();

        if (!user) throw new Error("Email or password incorrect.");

        return user;
    }

    /**
     * Verifies the JWT token and returns the user ID or null otherwise.
     */
    public static async validateJwtToken(token: string, publicKey: string): Promise<string | null> {
        const importedPublicKey = await importSPKI(publicKey, "EdDSA");

        try {
            // Verify the token and get the active user ID from the payload.
            const result = await jwtVerify(token, importedPublicKey);

            return result.payload.sub ?? null;
        } catch (e) {
            if (typeof e === "string") {
                throw new Error(e);
            } else if (e instanceof Error) {
                throw new Error(e.message);
            }

            throw new Error("Unexpected error while authenticating.");
        }
    }

    public static async generateJwtToken(
        user: User,
        privateKey: string,
        duration: string
    ): Promise<string> {
        const importedPrivateKey = await importPKCS8(privateKey, "EdDSA");

        // The userId is stored in the "sub".
        return new SignJWT({sub: user.id.toString()})
            .setProtectedHeader({alg: "EdDSA"})
            .setIssuedAt()
            .setExpirationTime(duration)
            .sign(importedPrivateKey);
    }
}

export {UserService};
