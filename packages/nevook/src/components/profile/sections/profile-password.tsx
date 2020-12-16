import { ApolloError, useMutation } from '@apollo/client';
import Button from '@Components/generic/form/button/button';
import Input from '@Components/generic/form/input';
import { AlertMessages, FormMessages } from '@Enums/config/constants';
import { ApolloMutation } from '@Interfaces/apollo/apollo-query.types';
import { ApolloQueryRefetch } from '@Interfaces/apollo/apollo-refetch.types';
import { UserProfileOtherInfo } from '@Interfaces/user/user.interface';
import { ProfileContext } from '@Lib/context/profile.context';
import { Form, Formik, FormikConfig } from 'formik';
import { FormValidation, GraphqlUser } from 'nevook-utils';
import { FC, useContext } from 'react';
import { toast } from 'react-toastify';
import { object as YupObject, ref as YupRef, string as YupString } from 'yup';

//#region TS

/**
 * Enum for form field names
 */
enum ProfilePassFields {
	OLD_PASSWORD = 'old_password',
	NEW_PASSWORD = 'new_password',
	NEW_PASSWORD_CONFIRM = 'new_password_confirm',
}

/**
 * Interface for form field values
 */
interface IProfilePass {
	[ProfilePassFields.OLD_PASSWORD]: string;
	[ProfilePassFields.NEW_PASSWORD]: string;
	[ProfilePassFields.NEW_PASSWORD_CONFIRM]: string;
}

//#endregion

/**
 * Component to change user's password.
 */
const ProfilePassword: FC = () => {
	const { profile, refetch } = useContext(ProfileContext);

	const { changePassMutation, loading } = getChangePassMutation(refetch);

	const form = getForm(profile, changePassMutation);

	return (
		<Formik {...form}>
			<Form className='flex-s-s flex-wrap'>
				{!profile.isSocialLogin && (
					<Input
						className='flexcol-s-s mt-1 mdlg:w-1/3 mdlg:pr-1_5 xssm:w-full box-border'
						name={ProfilePassFields.OLD_PASSWORD}
						type='password'
						label='Contraseña anterior'
					/>
				)}
				<Input
					className='flexcol-s-s mt-1 mdlg:w-1/3 mdlg:pr-1_5 xssm:w-full box-border'
					name={ProfilePassFields.NEW_PASSWORD}
					type='password'
					label='Nueva contraseña'
				/>
				<Input
					className='flexcol-s-s mt-1 mdlg:w-1/3 mdlg:pr-1_5 xssm:w-full box-border'
					name={ProfilePassFields.NEW_PASSWORD_CONFIRM}
					type='password'
					label='Repetir contraseña'
				/>
				<div className='w-full'>
					<Button
						loading={loading}
						className='mt-1_5'
						type='submit'
						kind='primary'>
						{!profile.isSocialLogin ? 'Cambiar contraseña' : 'Crear contraseña'}
					</Button>
				</div>
			</Form>
		</Formik>
	);
};

/**
 * Gets the graphql mutation to modify user's password.
 *
 * @param refetch Refetch profile query
 */
const getChangePassMutation = (refetch: ApolloQueryRefetch) => {
	const [changePassMutation, { loading }] = useMutation(
		GraphqlUser.user_change_password,
		{
			onCompleted: () => {
				toast.success(AlertMessages.PASSWORD_CHANGED);
				refetch();
			},
			onError: (error: ApolloError) => {
				toast.error(error.message || AlertMessages.SERVER_ERROR);
			},
		}
	);

	return { changePassMutation, loading };
};

/**
 * Gets the formik data to build the form.
 * @param profile User's profile data
 * @param changePassMutation Graphql mutation
 */
const getForm = (
	profile: UserProfileOtherInfo,
	changePassMutation: ApolloMutation
): FormikConfig<IProfilePass> => {
	const initialValues: IProfilePass = {
		[ProfilePassFields.OLD_PASSWORD]: '',
		[ProfilePassFields.NEW_PASSWORD]: '',
		[ProfilePassFields.NEW_PASSWORD_CONFIRM]: '',
	};

	const genericSchema: any = {
		[ProfilePassFields.NEW_PASSWORD]: YupString()
			.test(
				'profile-password.password',
				FormMessages.PASSWORD_ERROR,
				(value: any) => FormValidation.passwordValidation(value || '')
			)
			.required(FormMessages.PASSWORD_REQUIRED),
		[ProfilePassFields.NEW_PASSWORD_CONFIRM]: YupString()
			.oneOf(
				[YupRef(ProfilePassFields.NEW_PASSWORD)],
				FormMessages.PASSWORD_CHECK
			)
			.required(FormMessages.CONFIRM_PASSWORD_REQUIRED),
	};

	const socialSchema = !profile.isSocialLogin
		? {
				[ProfilePassFields.OLD_PASSWORD]: YupString().required(),
		  }
		: {};

	const validationSchema = YupObject().shape({
		...genericSchema,
		...socialSchema,
	});

	const onSubmit = (values: IProfilePass) => {
		changePassMutation({
			variables: {
				input: {
					oldPassword: values[ProfilePassFields.OLD_PASSWORD],
					newPassword: values[ProfilePassFields.NEW_PASSWORD],
				},
			},
		});
	};

	return {
		initialValues,
		onSubmit,
		validateOnChange: false,
		validationSchema,
	};
};

export default ProfilePassword;
