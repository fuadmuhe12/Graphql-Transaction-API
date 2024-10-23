import passport from "passport";
import { GraphQLLocalStrategy } from "graphql-passport";
import User from "../model/user.model.js";
import bycrypt from "bcryptjs";

export const passportConfig = async () => {

    passport.serializeUser((user, done) => {
        console.log("serializeUser");
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log("deserializeUser");
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const userName = username;
                console.info("GraphQLLocalStrategy called");
                console.log(
                    "\nuserName", userName,
                    "\npassword", password

                );
                const user = await User.findOne({ userName: userName });

                console.info("user from db:", user);

                if (!user) {
                    throw new Error("Invalid password or username");
                }
                console.log("from the graphqllocal", password);


                const validPassword = await bycrypt.compare(password, user.password);
                if (!validPassword) {
                    throw new Error("Invalid password or username");
                }
                return done(null, user);

            } catch (error) {
                return done(error, null);
            }
        })
    )


}