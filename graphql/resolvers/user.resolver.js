import User from './../../model/user.model.js';
import bcrypt from 'bcryptjs';
const userResolver = {
    Query: {
        user: (_, { userId }) => {
            try {
                const user = User.findById(userId);
                return user;
            } catch (error) {
                console.log('Error in user', error);
                throw new Error(error);
            }
        },
        authUser: async (_, __, context) => {
            try {
                const user = await context.getUser();
                return user;
            } catch (error) {
                console.log('Error in authUser', error);
                throw new Error(error);
            }
        }
    },
    Mutation: {
        signUp: async (_, { input }, context) => {
            try {

                const { name, userName, password, gender } = input;
                if (!name || !userName || !password || !gender) {
                    throw new Error('All fields are required');
                }
                console.log('input', input);
                const userExist = await User.findOne({ userName: userName });

                if (userExist) {
                    console.log('user', userExist);
                    throw new Error('User already exist');
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const newUser = new User({
                    name,
                    userName,
                    password: hashedPassword,
                    gender,
                    profilePicture: `https://avatar.iran.liara.run/public/${gender === 'male' ? 'boy' : 'girl'}?username=${userName}`
                });
                await newUser.save();
                context.login(newUser);
                return newUser;

            } catch (error) {
                console.error('Error in signUp', error);
                throw new Error(error);
            }
        },
        login: async (_, { input }, context) => {
            try {
                const { userName, password } = input;
                if (!userName || !password) {
                    throw new Error('All fields are required');
                }

                console.log('input for login', input);
                console.log('authenticating')
                const username = userName;
                const { user } = await context.authenticate('graphql-local', { username, password });


                console.log('login user', user);
                await context.login(user);
                return user;
            } catch (error) {
                console.error('Error in login', error);
                throw new Error(error);
            }
        },
        logout: async (_, __, context) => {
            try {
                const { logout, req, res } = context;

                await logout();
                req.session.destroy((err) => {
                    if (err) {
                        throw new Error('Error in destroying session');
                    }
                });
                res.clearCookie('connect.sid');
                return {
                    message: 'Logged out successfully'
                }

            } catch (error) {
                console.error('Error in logout', error);
                throw new Error(error);

            }
        }

    }
}

export default userResolver;