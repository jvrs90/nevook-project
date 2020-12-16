import { DAYS, MONTHS } from '@Enums/config/constants';
import { DownArrowIcon } from '@Icons/menu/down-arrow-icon';
import { Dispatch, FC } from 'react';
import { Screens, SelectedDate } from './date-picker';

export type DayPickerProps = {
	selectDay: Function;
	selectedDate: SelectedDate;
	setScreen: Dispatch<Screens>;
	minDay?: number;
	maxDay?: number;
};

/**
 * Custom day picker for date picker input.
 *
 * @param props.selectDay SetState for date picker's day state
 * @param props.selectedDate Date picker's state
 * @param props.setScreen SetState for date picker's screen state
 * @param props.minDay Minimum day allowed
 * @param props.maxDay Maximum day allowed
 */
const DayPicker: FC<DayPickerProps> = ({
	selectDay,
	selectedDate,
	setScreen,
	minDay,
	maxDay,
}) => {
	const calendarDays = renderCalendarDays(
		selectedDate,
		selectDay,
		minDay,
		maxDay
	);

	return (
		<>
			<div className='flex-c-c mx-auto border border-gray-400 rounded-lg px-1 mb-1'>
				<button
					className='flex-c-c py-0_25 px-0_75 text-lg'
					onClick={() => setScreen(Screens.MONTH)}>
					{MONTHS[selectedDate.month]}
					<DownArrowIcon className='ml-0_5 w-1 fill-current' />
				</button>
				<button
					className='flex-c-c py-0_25 px-0_75 text-lg'
					onClick={() => setScreen(Screens.YEAR)}>
					{selectedDate.year}
					<DownArrowIcon className='ml-0_5 w-1 fill-current' />
				</button>
			</div>
			<div className='flex-c-c flex-wrap w-17_5'>
				{DAYS.map(i => (
					<div key={i} className='h-2_5 w-2_5 flex-c-c text-primary'>
						{i}
					</div>
				))}
				{calendarDays}
			</div>
		</>
	);
};

/**
 * Renders the calendar view.
 *
 * @param selectedDate Date picker's state
 * @param selectDay SetState for date picker's day state
 * @param minDay Minimum day allowed
 * @param maxDay Maximum day allowed
 */
const renderCalendarDays = (
	selectedDate: SelectedDate,
	selectDay: Function,
	minDay?: number,
	maxDay?: number
) => {
	const { year, month, day } = selectedDate;

	let firstDayOfWeek = new Date(year, month, 1).getDay();
	if (firstDayOfWeek === 0) firstDayOfWeek = 7;
	const lastDay = new Date(year, month + 1, 0);
	let lastDayOfWeek = lastDay.getDay();
	if (lastDayOfWeek === 0) lastDayOfWeek = 7;
	const endDate = lastDay.getDate();
	const endBlankDays = 7 - lastDayOfWeek;

	const days = [];
	let key = 0;
	let currentDay = 1;
	let dayCount = 1;

	const incrementDay = () => {
		if (currentDay === 7) currentDay = 1;
		else currentDay++;
	};

	const getDayStyle = () => {
		const baseClassName = `h-2_5 w-2_5 flex-c-c ${
			(minDay && dayCount < minDay) || (maxDay && dayCount > maxDay)
				? 'text-gray-400'
				: 'cursor-pointer'
		}`;
		const selectedDayClassName = `${baseClassName} bg-primary rounded-full text-white`;

		if (dayCount === day) return selectedDayClassName;
		return baseClassName;
	};

	for (let i = 0; i < firstDayOfWeek - 1; i++) {
		days.push(<div key={key++} className='h-2_5 w-2_5'></div>);
		incrementDay();
	}

	for (let j = 1; j <= endDate; j++) {
		const className = getDayStyle();

		const onClick =
			(minDay && dayCount < minDay) || (maxDay && dayCount > maxDay)
				? undefined
				: () => selectDay(j);

		days.push(
			<div key={key++} className={className} onClick={onClick}>
				{j}
			</div>
		);

		dayCount++;
		incrementDay();
	}

	for (let k = 0; k < endBlankDays; k++) {
		days.push(<div key={key++} className='h-2_5 w-2_5'></div>);
		incrementDay();
	}

	return days;
};

export default DayPicker;
