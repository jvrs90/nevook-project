
import { UserModels } from '@Users/enums/user-models.enum';
import {
	IUser,
	IUserDoc,
} from '@Users/interfaces/user-document.interface';
import { config } from 'dotenv';
import { connect, model } from 'mongoose';
import { UserSchema } from './users/schemas/users.schema';

config();

//#region DATA

const userData: IUser = {
	email: 'testing2@test.com',
	name: 'bullchit',
	surname: 'Tanenbaum',
	// test1234
	password: '$2b$12$l9ElSZrSp02bPP.XlsuSQeatkx1AQ7SefCW5VGXFf/vsoIGhPvaPm',
	active: true,
};


export const initDB = async () => {
	console.log('\nCreating DB example data\n');

	const connection = await connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useFindAndModify: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		readPreference: 'primary',
	});

	const userModel = model(UserModels.USER, UserSchema);

	const user = await userModel
		.findOne({ email: userData.email })
		.exec();

	if (!user) {
		console.log('Generating example users...');
		const newUser = new userModel(userData) as IUserDoc;
		await newUser.save();
	}

	connection.disconnect;
};
