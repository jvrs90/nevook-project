import { FC, useState } from 'react';
import ArrowSelector from './arrow-selector';

const TOTAL_YEARS_TO_DISPLAY = 20;

export type YearPickerProps = {
	modifyYear: Function;
	selectedYear: number;
	minYear?: number;
	maxYear?: number;
};

/**
 * Custom year picker for date picker input.
 *
 * @param props.modifyYear SetState for date picker's year state
 * @param props.selectedYear Year value of date picker's state
 * @param props.minYear Minimum year allowed
 * @param props.maxYear Maximum year allowed
 */
const YearPicker: FC<YearPickerProps> = ({
	modifyYear,
	selectedYear,
	minYear,
	maxYear,
}) => {
	const [minYearToRender, setMinYearToRender] = useState<number>(
		getMinYearToRender(selectedYear)
	);

	const yearsToDisplay = [];

	for (let i = 0; i < TOTAL_YEARS_TO_DISPLAY; i++) {
		const year = minYearToRender + i;
		yearsToDisplay.push(year);
	}

	return (
		<div className='flexcol-c-c'>
			<ArrowSelector
				leftHandler={
					minYear && minYearToRender <= minYear
						? undefined
						: () => setMinYearToRender(minYearToRender - TOTAL_YEARS_TO_DISPLAY)
				}
				rightHandler={
					maxYear && minYearToRender + TOTAL_YEARS_TO_DISPLAY >= maxYear
						? undefined
						: () => setMinYearToRender(minYearToRender + TOTAL_YEARS_TO_DISPLAY)
				}
				text='Selecciona año'
			/>
			<div className='flex flex-wrap w-16'>
				{yearsToDisplay.map(i => {
					let onClick: (() => void) | undefined = () => modifyYear(i);
					let className = `cursor-pointer${
						selectedYear === i ? ' bg-primary rounded-full text-white' : ''
					}`;

					if ((maxYear && i > maxYear) || (minYear && i < minYear)) {
						onClick = undefined;
						className = 'text-gray-400';
					}

					return (
						<div
							key={i}
							className={`flex-c-c w-3 h-3 mx-0_5 ${className}`}
							onClick={onClick}>
							{i}
						</div>
					);
				})}
			</div>
		</div>
	);
};

/**
 * Gets the min year to render in year's list.
 * @param selectedYear Selected year
 */
const getMinYearToRender = (selectedYear: number): number => {
	const currentYear = new Date().getFullYear();

	if (currentYear - selectedYear <= TOTAL_YEARS_TO_DISPLAY / 2 - 1)
		return currentYear - TOTAL_YEARS_TO_DISPLAY + 1;

	return selectedYear - TOTAL_YEARS_TO_DISPLAY / 2;
};

export default YearPicker;
