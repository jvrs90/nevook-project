import gql from 'graphql-tag';

export const user_login = gql`
	query user_login($input: LoginDto!) {
		user_login(input: $input) {
			user {
				email
				alias
				name
				surname
				username
				photo
			}
			token
		}
	}
`;

export const user_valid_forgot_password_token = gql`
	query user_valid_forgot_password_token($token: ID!) {
		user_valid_forgot_password_token(token: $token)
	}
`;

export const user_profile = gql`
	query user_profile {
		user_profile {
			email
			name
			surname
			username
			photo
			alias
			bio
			gender
			birthDate
			isSocialLogin
			socialAccounts {
				id
				type
			}
		}
	}
`;

export const user_profile_min = gql`
	query user_profile {
		user_profile {
			email
			name
			surname
			alias
			username
			photo
		}
	}
`;

export const user_social_login = gql`
	mutation user_social_login($input: SocialLoginDto!) {
		user_social_login(input: $input) {
			token
			user {
				email
				name
				surname
				username
				photo
				isSocialLogin
				socialAccounts {
					id
					type
				}
			}
		}
	}
`;

export const user_link_social_profile = gql`
	mutation user_link_social_profile($input: SocialLoginDto!) {
		user_link_social_profile(input: $input)
	}
`;

export const user_unlink_social_profile = gql`
	mutation user_unlink_social_profile($input: SocialUnlinkDto!) {
		user_unlink_social_profile(input: $input)
	}
`;

export const user_register = gql`
	mutation user_register($input: RegisterDto!) {
		user_register(input: $input)
	}
`;

export const user_activate_account = gql`
	mutation user_activate_account($token: ID!) {
		user_activate_account(token: $token)
	}
`;

export const user_create_forgot_password_token = gql`
	mutation user_create_forgot_password_token($email: String!) {
		user_create_forgot_password_token(email: $email)
	}
`;

export const user_change_forgot_password = gql`
	mutation user_change_forgot_password($input: RecoverPasswordDto!) {
		user_change_forgot_password(input: $input)
	}
`;

export const user_change_password = gql`
	mutation user_change_password($input: ChangePasswordDto!) {
		user_change_password(input: $input)
	}
`;

export const user_modify_profile = gql`
	mutation user_modify_profile($input: ModifyProfileDto!) {
		user_modify_profile(input: $input) {
			name
			surname
		}
	}
`;

export const user_change_email = gql`
	mutation user_change_email($newEmail: String!) {
		user_change_email(newEmail: $newEmail)
	}
`;

export const user_change_username = gql`
	mutation user_change_username($newUsername: String!) {
		user_change_username(newUsername: $newUsername)
	}
`;


export const user_find = gql`
	query user_find($paginate: PaginateDto) {
		user_find(paginate: $paginate) {
			data {
				_id
				active
			}
			offset
			limit
			total
		}
	}
`;