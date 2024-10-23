import Transaction from '../../model/transaction.model.js';
/* description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        date: String! */
const transactionResolver = {
    Query: {
        transactions: async (_, ae, context) => {
            try {
                const user = await context.getUser();
                if (!user) {
                    throw new Error("Unauthorized");
                }
                return await Transaction.find({
                    userId: user._id
                });
            } catch (error) {
                console.error('Error fetching transactions: ', error);
                throw new Error(error);
            }
        },
        transaction: async (_, { transactionId }, context) => {
            try {
                const user = await context.getUser();
                if (!user) {
                    throw new Error("Unauthorized");
                }
                return await Transaction.findById(transactionId);

            } catch (error) {
                console.error('Error fetching transaction: ', error);
                throw new Error(error);
            }
        }
    },
    Mutation: {
        createTransaction: async (_, { input }, context) => {
            try {
                const {
                    description,
                    paymentType,
                    category,
                    amount,
                    location,
                    date
                } = input;
                if (!description || !paymentType || !category || !amount || !date) {
                    throw new Error("All fields are required");
                }
                const user = await context.getUser();
                if (!user) {
                    throw new Error("Unauthorized");
                }
                const transaction = new Transaction({
                    userId: user._id,
                    description,
                    paymentType,
                    category,
                    amount,
                    location,
                    date
                });
                await transaction.save();
                return transaction;
            } catch (error) {
                console.error('Error creating transaction: ', error);
                throw new Error(error);
            }
        },
        updateTransaction: async (_, { input }, context) => {
            try {
                const { transactionId, description, paymentType, category, amount, location, date } = input;
                const user = await context.getUser();
                if (!user) {
                    throw new Error("Unauthorized");
                }
                const transaction = await Transaction.findByIdAndUpdate(transactionId, input, { new: true });

                return transaction;

            } catch {
                console.error('Error updating transaction: ', error);
                throw new Error(error);

            }
        },
        deleteTransaction: async (_, { transactionId }, context) => {
            try {
                const user = await context.getUser();
                if (!user) {
                    throw new Error("Unauthorized");
                }
                const transaction = await Transaction.findByIdAndDelete(transactionId)
                return transaction;

            } catch (error) {
                console.error('Error deleting transaction: ', error);
                throw new Error(error);
            }
        }

    }
}

export default transactionResolver;