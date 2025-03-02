'use server';

import Maintainer from '@/db/models/maintainer';
import { connectToDB } from '@/db';
import argon2 from 'argon2';

interface IMaintainer {
	userName: string;
	password: string;
}

export const createMaintainer = async (maintainer: IMaintainer) => {
	try {
		// connect to db
		await connectToDB();

		// create new maintainer
		const newMaintainer = new Maintainer({
			username: maintainer.userName,
			password: await argon2.hash(
				maintainer.password,
				{
					type: argon2.argon2id,
					memoryCost: 19456,
					timeCost: 2,
					parallelism: 1,
				}
			),

		});

		// save new maintainer
		await newMaintainer.save();

		return { success: true, message: 'Maintainer created successfully' };
	} catch (error) {
		console.error('Error creating maintainer:', error);
		return { success: false, error: 'Error creating maintainer' };
	}
};

export const getMaintainers = async () => {
	try {
		// connect to db
		await connectToDB();

		// get maintainers
		const maintainers = await Maintainer.find();

		const maintainersList = maintainers.map((maintainer) => ({
			username: maintainer.username,
		}));

		return { success: true, maintainers: maintainersList };


	} catch (error) {
		console.error('Error getting maintainers:', error);
		return { success: false, error: `Error getting maintainers: ${error}` };
	}

};
