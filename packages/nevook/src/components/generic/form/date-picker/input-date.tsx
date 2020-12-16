import { Field, FieldHookConfig, useField } from 'formik';
import { FC, RefObject, useEffect, useRef, useState } from 'react';
import DatePicker from './date-picker';

export type InputDateProps = {
	label: string;
	defaultDate: Date;
	minDate?: Date;
	maxDate?: Date;
};

/**
 * Formik's custom input date component.
 *
 * @param props.label HTML label text
 * @param props.className Additional className
 * @param props.defaultDate Default date at picker starts
 * @param props.minDate Minumum date allowed
 * @param props.maxDate Maximum date allowed
 */
const InputDate: FC<InputDateProps & FieldHookConfig<string>> = ({
	label,
	className,
	defaultDate,
	minDate,
	maxDate,
	...props
}) => {
	const dropDownRef = useRef<HTMLDivElement>(null);

	const [field, meta, helpers] = useField(props);
	const { isOpened, setOpened } = useDropDown(dropDownRef);

	const error = meta.touched && meta.error;

	const initialDate = field.value ? new Date(field.value) : defaultDate;

	return (
		<div className={`flexcol-c-s relative ${className || ''}`}>
			<span className='mb-0_25 ml-0_5 text-white-dark dark:text-white'>
				{label}
			</span>
			<Field
				readOnly
				className={`w-full px-1 py-0_5 rounded-lg border bg-secondary dark:bg-gray-900 cursor-pointer text-white-dark dark:text-white ${
					error
						? 'border-red'
						: 'border-primary focus:border-primary-hover focus:border-2'
				}`}
				onClick={() => setOpened(!isOpened)}
				{...field}
				value={
					field.value &&
					new Date(field.value).toLocaleDateString(
						typeof window !== 'undefined' ? navigator?.language : 'es-ES',
						{
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
						}
					)
				}
				{...props}
			/>
			{error && <p className='text-red text-sm ml-1'>{meta.error}</p>}
			<div
				ref={dropDownRef}
				className={`absolute top-100 transition-max-h-eio-250 overflow-y-hidden ${
					isOpened ? 'max-h-24' : 'max-h-0'
				}`}>
				<DatePicker
					initialDate={initialDate}
					minDate={minDate}
					maxDate={maxDate}
					hasInitialDay={!!field.value}
					setDateAndClose={(selectedDate: Date) => {
						setOpened(false);
						helpers.setValue(selectedDate.toUTCString());
					}}
					className='my-0_75 box-border'
				/>
			</div>
		</div>
	);
};

/**
 * Handles click events on date picker container.
 * @param dropDownRef HTML dropdown reference
 */
const useDropDown = (dropDownRef: RefObject<HTMLDivElement>) => {
	const [isOpened, setOpened] = useState(false);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (!dropDownRef.current?.contains(event.target as Node)) {
				setOpened(false);
			}
		};

		if (isOpened) document.addEventListener('click', handleClick, true);
		else document.removeEventListener('click', handleClick, true);

		return () => document.removeEventListener('click', handleClick, true);
	}, [isOpened]);

	return { isOpened, setOpened };
};

export default InputDate;
