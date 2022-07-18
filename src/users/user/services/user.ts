import type {CreateUserInput} from "../types/create-user";
import type {JWTPayload} from "jose";
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

    public async incrementUserRefreshToken(userId: number): Promise<void> {
        await this.userRepository.increment({id: userId}, "tokenVersion", 1);
    }

    /**
     * Verifies the JWT token. Returns the payload containing the user ID and the user's token version.
     */
    public static async validateJwtToken(
        token: string,
        publicKey: string
    ): Promise<Pick<JWTPayload, "jti" | "sub">> {
        const importedPublicKey = await importSPKI(publicKey, "EdDSA");

        try {
            // Verify the token and get the active user ID from the payload.
            const result = await jwtVerify(token, importedPublicKey);

            return result.payload;
        } catch (e) {
            if (typeof e === "string") {
                throw new Error(e);
            } else if (e instanceof Error) {
                throw new Error(e.message);
            }

            throw new Error("Unexpected error while authenticating.");
        }
    }

    // TODO: Consider having a separate service method for generating the JWT refresh token
    // The access token does not need to store the user's token version.
    public static async generateJwtToken(
        user: User,
        privateKey: string,
        duration: string
    ): Promise<string> {
        const importedPrivateKey = await importPKCS8(privateKey, "EdDSA");

        // The userId is stored in the "sub". The token version is stored in the "jti".
        return new SignJWT({sub: user.id.toString(), jti: user.tokenVersion.toString()})
            .setProtectedHeader({alg: "EdDSA"})
            .setIssuedAt()
            .setExpirationTime(duration)
            .sign(importedPrivateKey);
    }
}

export {UserService};
