import { FC } from 'react';

const MONTHS = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
];

export type MonthPickerProps = {
	modifyMonth: Function;
	selectedMonth: number;
	minMonth?: number;
	maxMonth?: number;
};

/**
 * Custom month picker for date picker input.
 *
 * @param props.modifyMonth SetState for date picker's month state
 * @param props.selectedMonth Month value of date picker's state
 * @param props.minMonth Minimum month allowed
 * @param props.maxMonth Maximum month allowed
 */
const MonthPicker: FC<MonthPickerProps> = ({
	modifyMonth,
	selectedMonth,
	minMonth,
	maxMonth,
}) => (
	<div className='flexcol-c-c'>
		<span className='text-lg text-gray-600 py-0_5'>Selecciona mes</span>
		<div className='flex flex-wrap w-16'>
			{MONTHS.map((i, index) => {
				let onClick: (() => void) | undefined = () => modifyMonth(index);
				let className = `cursor-pointer${
					selectedMonth === index ? ' bg-primary rounded-full text-white' : ''
				}`;

				if ((maxMonth && index > maxMonth) || (minMonth && index < minMonth)) {
					onClick = undefined;
					className = 'text-gray-400';
				}

				return (
					<div
						key={index}
						className={`flex-c-c w-3 h-3 m-0_5 ${className}`}
						onClick={onClick}>
						{i.substr(0, 3).toUpperCase()}
					</div>
				);
			})}
		</div>
	</div>
);

export default MonthPicker;
