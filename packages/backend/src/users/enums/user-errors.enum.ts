/**
 * Message errors enum
 */
export enum UserErrors {
	//Services
	EMAIL_NOT_FOUND = 'Email no encontrado',
	USER_NOT_FOUND = 'Usuario no encontrado',
	INVALID_LOGIN = 'Login incorrecto',
	NOT_ACTIVATED = 'Su cuenta no está activada, revise el correo',
	EMAIL_IN_USE = 'El email ya está en uso',
	SOCIAL_IN_USE = 'La cuenta ya está asociada a otro usuario',
	SOCIAL_NOT_FOUND = 'La cuenta no se encuentra asociada',
	SERVER = 'Error en el servidor, inténtelo de nuevo más tarde',
	NOTHING_TO_MODIFY = 'Nada que modificar',

	// Format
	FORMAT_USERNAME = 'Formato de username incorrecto',
	FORMAT_BIO = 'Formato de bio incorrecto',
	FORMAT_BIRTHDATE = 'Formato de fecha de nacimiento incorrecto',
	FORMAT_GENDER = 'Género inválido',
	FORMAT_NAME = 'Formato de nombre inválido',
	FORMAT_SURNAME = 'Formato de apellidos inválido',
	FORMAT_PHOTO = 'Formato de foto de perfil inválido',
	FORMAT_PASSWORD = 'Formato de contraseña inválido',
	FORMAT_OLD_PASSWORD = 'La contraseña anterior no es correcta',
	FORMAT_SAME_PASSWORD = 'La nueva contraseña coincide con la anterior',
	FORMAT_EMAIL = 'Formato de email inválido',
	FORMAT_TOKEN = 'Token inválido',

}