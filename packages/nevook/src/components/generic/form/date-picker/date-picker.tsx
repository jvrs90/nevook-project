import { Dispatch, FC, useState } from 'react';
import DayPicker from './day-picker';
import MonthPicker from './month-picker';
import YearPicker from './year-picker';

export interface SelectedDate {
	day?: number;
	month: number;
	year: number;
}

export enum Screens {
	CALENDAR,
	MONTH,
	YEAR,
}

export type DatePickerProps = {
	initialDate: Date;
	hasInitialDay?: boolean;
	setDateAndClose: (date: Date) => void;
	className?: string;
	minDate?: Date;
	maxDate?: Date;
};

/**
 * Custom date picker component.
 *
 * @param props.initialDate Initial date at picker starts
 * @param props.setDateAndClose Sets input value and close picker
 * @param props.hasInitialDay True if input has previous value
 * @param props.className Additional className
 * @param props.minDate Minumum date allowed
 * @param props.maxDate Maximum date allowed
 */
const DatePicker: FC<DatePickerProps> = ({
	initialDate,
	setDateAndClose,
	hasInitialDay,
	minDate,
	maxDate,
	className = '',
}) => {
	const [screen, setScreen] = useState<Screens>(Screens.CALENDAR);

	const {
		selectedDate,
		selectDay,
		modifyYear,
		modifyMonth,
		limits,
	} = useSelectedDate(
		setDateAndClose,
		setScreen,
		initialDate,
		hasInitialDay,
		minDate,
		maxDate
	);

	let calendar;

	if (screen === Screens.MONTH) {
		calendar = (
			<MonthPicker
				modifyMonth={modifyMonth}
				selectedMonth={selectedDate.month}
				minMonth={limits.minMonth}
				maxMonth={limits.maxMonth}
			/>
		);
	} else if (screen === Screens.YEAR) {
		calendar = (
			<YearPicker
				modifyYear={modifyYear}
				selectedYear={selectedDate.year}
				minYear={limits.minYear}
				maxYear={limits.maxYear}
			/>
		);
	} else {
		calendar = (
			<DayPicker
				selectDay={selectDay}
				selectedDate={selectedDate}
				setScreen={setScreen}
				minDay={limits.minDay}
				maxDay={limits.maxDay}
			/>
		);
	}

	return (
		<div
			className={`flexcol-c-c w-20 shadow-xl select-none rounded-xl bg-white dark:bg-white-dark text-white-dark dark:text-white ${className}`}>
			<div className='p-1_25'>{calendar}</div>
		</div>
	);
};

/**
 *
 * @param selectedDate Current selectedDate state
 * @param minDate Minumum date allowed
 * @param maxDate Maximum date allowed
 */
const getLimits = (
	selectedDate: SelectedDate,
	minDate?: Date,
	maxDate?: Date
) => {
	const { month, year } = selectedDate;

	const minYear = minDate?.getFullYear();
	const maxYear = maxDate?.getFullYear();

	const minMonth = minDate && minYear === year ? minDate.getMonth() : undefined;
	const maxMonth = maxDate && maxYear === year ? maxDate.getMonth() : undefined;

	const minDay = minDate && minMonth === month ? minDate?.getDate() : undefined;
	const maxDay = maxDate && maxMonth === month ? maxDate?.getDate() : undefined;

	return {
		minYear,
		maxYear,
		minMonth,
		maxMonth,
		minDay,
		maxDay,
	};
};

/**
 * Hook to handle selectedDate state.
 *
 * @param props.setDateAndClose Sets input value and close picker
 * @param setScreen SetState for screen to render (day, month or year picker)
 * @param initialDate Initial date at picker starts
 * @param hasInitialDay True if input has previous value
 * @param minDate Minumum date allowed
 * @param maxDate Maximum date allowed
 */
const useSelectedDate = (
	setDateAndClose: (date: Date) => void,
	setScreen: Dispatch<Screens>,
	initialDate: Date,
	hasInitialDay?: boolean,
	minDate?: Date,
	maxDate?: Date
) => {
	const [selectedDate, setSelectedDate] = useState<SelectedDate>({
		day: hasInitialDay ? initialDate.getDate() : undefined,
		month: initialDate.getMonth(),
		year: initialDate.getFullYear(),
	});

	const limits = getLimits(selectedDate, minDate, maxDate);

	const selectDay = (newDay: number) => {
		setSelectedDate({
			...selectedDate,
			day: newDay,
		});
		setDateAndClose(new Date(selectedDate.year, selectedDate.month, newDay));
	};

	const modifyMonth = (newMonth: number) => {
		setSelectedDate({
			day: undefined,
			month: newMonth,
			year: selectedDate.year,
		});
		setScreen(Screens.CALENDAR);
	};

	const modifyYear = (newYear: number) => {
		let newMonth = selectedDate.month;

		const newLimits = getLimits(
			{ ...selectedDate, year: newYear },
			minDate,
			maxDate
		);

		if (
			newLimits.maxYear === newYear &&
			newLimits.maxMonth &&
			newLimits.maxMonth < selectedDate.month
		) {
			newMonth = newLimits.maxMonth;
		}

		if (
			newLimits.minYear === newYear &&
			newLimits.minMonth &&
			newLimits.minMonth > selectedDate.month
		) {
			newMonth = newLimits.minMonth;
		}

		setSelectedDate({
			day: undefined,
			month: newMonth,
			year: newYear,
		});
		setScreen(Screens.CALENDAR);
	};

	return {
		selectedDate,
		selectDay,
		modifyYear,
		modifyMonth,
		limits,
	};
};

export default DatePicker;
