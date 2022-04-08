import {useState, useEffect} from 'react';
import {StopCoordiantes} from '../../typings';
import {EVENTS} from '../constants';

const DRAG_HANDLERS = {
    MOUSE: {
        stop: (e) => {
            e.preventDefault();
            e.stopPropagation();
        },
        coordinates: ({clientX, clientY}) => ({clientX, clientY}),
        dragEvent: {name: EVENTS.MOUSEMOVE},
        dragEndEvent: {name: EVENTS.MOUSEUP},
    },
    TOUCH: {
        stop: () => {},
        coordinates: (e) => {
            const [touch] = e.touches;
            return {clientX: touch.clientX, clientY: touch.clientY};
        },
        dragEvent: {name: EVENTS.TOUCHMOVE, options: {cancelable: true, passive: true}},
        dragEndEvent: {name: EVENTS.TOUCHEND},
    },
};

const isTouch = (e) => e.type === EVENTS.TOUCHSTART;

type useDraggingProps = {
    onDragStart: (coordinates: StopCoordiantes) => void;
    onDrag: (coordinates: StopCoordiantes) => void;
    onDragEnd: (coordinates: StopCoordiantes) => void;
};

const useDragging = ({onDragStart, onDrag, onDragEnd}: useDraggingProps) => {
    const [context, setContext] = useState({} as any);
    const [dragging, setDragging] = useState(false);

    const dragHandler = (e) => {
        const handler = isTouch(e) ? DRAG_HANDLERS.TOUCH : DRAG_HANDLERS.MOUSE;

        handler.stop(e);

        if (!e.button) activate(e, handler);
    };

    const activate = (e, handler) => {
        setDragging(true);
        context.handler = handler;
        e.stopPropagation();
        onDragStart(handler.coordinates(e));
    };

    const deactivate = () => {
        setDragging(false);
        onDragEnd(context.change);
        setContext({});
    };

    const handleDrag = (e) => {
        const {handler} = context;
        if (!dragging) return;

        context.change = onDrag(handler.coordinates(e));
    };

    useEffect(() => {
        const {handler} = context;
        if (!handler) return;

        const {dragEvent, dragEndEvent} = handler;

        if (dragging) {
            document.addEventListener(dragEvent.name, handleDrag, dragEndEvent.options);
            document.addEventListener(dragEndEvent.name, deactivate);
        }

        return () => {
            document.removeEventListener(dragEvent.name, handleDrag, dragEndEvent.options);
            document.removeEventListener(dragEndEvent.name, deactivate);
        };
    }, [dragging]);

    return [dragHandler, activate, deactivate];
};

export default useDragging;