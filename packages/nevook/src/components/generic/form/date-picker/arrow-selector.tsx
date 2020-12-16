import { FC, MouseEventHandler } from 'react';

import { LeftArrowIcon } from '@Icons/menu/left-arrow-icon';
import { RightArrowIcon } from '@Icons/menu/right-arrow-icon';

export type ArrowSelectorProps = {
	text: string | number;
	leftHandler: MouseEventHandler<SVGSVGElement> | undefined;
	rightHandler: MouseEventHandler<SVGSVGElement> | undefined;
};

// TODO: Revisar colores

/**
 * Custom arrow selector for year picker.
 *
 * @param props.text Label text
 * @param props.leftHandler Left arrow's click handler
 * @param props.rightHandler Right arrow's click handler
 */
const ArrowSelector: FC<ArrowSelectorProps> = ({
	text,
	leftHandler,
	rightHandler,
}) => (
	<div className='flex-sb-c w-full p-0_5'>
		<LeftArrowIcon
			className={`h-2 py-0_25 px-0_5 ${
				leftHandler ? 'fill-primary' : 'fill-gray-600'
			}`}
			onClick={leftHandler}
		/>

		<span className='text-lg text-gray-600 py-0_5'>{text}</span>

		<RightArrowIcon
			className={`h-2 py-0_25 px-0_5 ${
				rightHandler ? 'fill-primary' : 'fill-gray-600'
			}`}
			onClick={rightHandler}
		/>
	</div>
);

export default ArrowSelector;
