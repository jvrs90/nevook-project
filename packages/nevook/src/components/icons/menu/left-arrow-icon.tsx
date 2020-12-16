import { ComponentProps, FC } from 'react';

export const LeftArrowIcon: FC<ComponentProps<'svg'>> = props => (
	<svg {...props} viewBox='0 0 64 64'>
		<path d='M54 30H14.1L29.38 15.448a2 2 0 1 0-2.759-2.897L9.172 29.17C8.417 29.927 8 30.93 8 32s.417 2.073 1.207 2.862L26.62 51.448A1.99 1.99 0 0 0 28 52c.528 0 1.056-.208 1.45-.62a2 2 0 0 0-.069-2.827L14.038 34H54a2 2 0 1 0 0-4z' />
	</svg>
);
