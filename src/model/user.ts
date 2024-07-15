import sequelize, { DataTypes, Model } from './db/index';
import Sequelize from "sequelize";
import Auth from "../model/auth";
import { getSalt, hashSeasonPassword, compareHashes } from "../utils/password-hashh";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

class User extends Model {

    static associate(models: any) {
        User.hasOne(models.Auth, {
            foreignKey: "userId",
            onDelete: "CASCADE",
            as: "auth",
        });
    }

    private static async createHashedSeasonPassword(password: string) {
        const salt = getSalt();
        const hashPassword = hashSeasonPassword(password, salt).toString("hex");
        const hashedPassword = `${salt}:${hashPassword}`;
        return hashedPassword;
    }

    static async getUser(email: string) {
        const userInfo = await User.findOne({ where: { email } });
        return { userInfo };
    }

    static async createUser(userData: any) {
        const { username, fullname, password, email, birthdate, nationality } =
            userData;

        const existingUser = await User.findOne({
            where: {
                email,
            },
        });
        if (existingUser) {
            return { error: "User with the provided email already exists" };
        }

        const hashedPassword = await this.createHashedSeasonPassword(password);

        const newUser = await User.create({
            username,
            fullname,
            email,
            birthdate,
            nationality,
        });
        await Auth.createAuth({
            id: newUser.dataValues.id,
            password: hashedPassword,
        });

        return {
            message: `User ${fullname} created successfully`,
            id: newUser.dataValues.id,
        };
    }

    static async updateUser(id: string, userdata: any) {
        const { username, fullname, password, email, nationality, birthdate } = userdata
        const result = await User.findOne({ where: { id } });

        if (result) {
            await result.update({
                username,
                fullname,
                email,
                birthdate: new Date(birthdate),
                nationality,
                password
            },
            );

            await result.save();
            if (password) {
                const auth = await Auth.findOne({
                    where: { userId: id },
                });
                if (auth) {
                    await auth.update({ password });
                    await auth.save();
                }
            }

            return result;
        }
        return 404;
    }

    static async deleteUser(id: any) {
        return await User.destroy({
            where: { id }
        });
    };

    static async login(userCredentials: any) {
        const { email, password } = userCredentials;

        const user = await User.findOne({ where: { email } });
        if (user) {
            const auth = await Auth.findOne({
                where: { userId: user.dataValues.id },
            });


            if (auth) {

                const [salt, dbHashedPassword] = await auth.dataValues.password.split(":");
                const hashedPassword = hashSeasonPassword(password, salt);
                const equalPasswords = compareHashes(dbHashedPassword, hashedPassword);

                if (equalPasswords) {
                    const refreshToken = generateRefreshToken(user.dataValues.id);
                    const accessToken = generateAccessToken(user.dataValues.id);

                    await auth.update({ accessToken, refreshToken });
                    await auth.save();

                    return {
                        message: "User logged successfully!",
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    };

                };

            };
        };
        return { error: 'Wrong credentials....!' };;
    };

    static async logout(userId: number) {
        try {
            // Actualiza la base de datos para invalidar el refreshToken
            const updateResult = await Auth.update({ refreshToken: null }, { where: { userId } });

            if (updateResult[0] === 0) {
                // Si no se actualizó ningún registro, retorna un código de estado 404
                return 404; // Retorna un código de estado 404 si no se encontró el usuario
            }

            return 200; // Retorna un código de estado 200 para indicar éxito

        } catch (error) {
            return 500; // Retorna un código de estado 500 en caso de error
        }
    }

};

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "Users",
        timestamps: false,
    }
);

User.hasOne(Auth, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});

Auth.belongsTo(User, {
    foreignKey: "userId",
});

(async () => await User.sync({ alter: true }))();

export { User };