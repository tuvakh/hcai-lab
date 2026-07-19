import { useRef, useState } from 'react';

export function useDragAndDrop(list, setList) {
  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  function reorder(from, to) {
    const result = [...list];
    const [moved] = result.splice(from, 1);
    result.splice(to, 0, moved);
    return result;
  }

  const drag = {
    start: (index) => {
        dragIndex.current = index;
    },
    over: (event, index) => {
        event.preventDefault();
        setDragOverIndex(index);
    },
    drop: (index) => {
        if (dragIndex.current !== null && dragIndex.current !== index) {
            setList(reorder(dragIndex.current, index));
        }
        dragIndex.current = null;
    },
    end: () => {
        dragIndex.current = null;
        setDragOverIndex(null);
    }
  };

  return { drag, dragOverIndex };
}
