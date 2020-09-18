import React, { useEffect, useState } from 'react';
import NavBar from '../ui/NavBar';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import { messages } from '../../helpers/calendar-messages-es';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import {
	eventSetActive,
	eventClearActiveEvent,
	eventStartLoading,
} from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');
const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {
	const dispatch = useDispatch();

	// Obtener events del store
	const { events, activeEvent } = useSelector((state) => state.calendar);
	const { uid } = useSelector((state) => state.auth);

	const [lastView, setLastView] = useState(
		localStorage.getItem('lastView') || 'month'
	);

	// Cargar eventos en el calendario
	useEffect(() => {
		dispatch(eventStartLoading());
	}, [dispatch]);

	const onDoubleClick = (e) => {
		// console.log(e);
		dispatch(uiOpenModal());
	};

	const onSelectEvent = (e) => {
		dispatch(eventSetActive(e));
	};

	const onViewChange = (e) => {
		setLastView(e);
		localStorage.setItem('lastView', e);
	};

	const onSelectdSlot = (e) => {
		dispatch(eventClearActiveEvent());
	};

	const eventStyleGetter = (event, start, end, isSelected) => {
		// console.log(event);

		const style = {
			backgroundColor: uid === event.user._id ? '#367cf7' : '#465660',
			borderRadius: '0px',
			display: 'block',
			opacity: 0.8,
			color: 'white',
		};

		return {
			style,
		};
	};

	return (
		<div className='calendar-screen'>
			<NavBar />

			<Calendar
				localizer={localizer}
				events={events}
				startAccessor='start'
				endAccessor='end'
				messages={messages}
				eventPropGetter={eventStyleGetter}
				components={{
					event: CalendarEvent,
				}}
				onDoubleClickEvent={onDoubleClick}
				onSelectEvent={onSelectEvent}
				onSelectSlot={onSelectdSlot}
				selectable={true}
				onView={onViewChange}
				view={lastView}
			/>

			<CalendarModal />

			<AddNewFab />

			{activeEvent && <DeleteEventFab />}
		</div>
	);
};
