import { useState, useEffect, useRef, useCallback } from 'react';

const MASCOT_SIZE = 80;

export default function Mascot() {
  const [position, setPosition] = useState({ x: 50, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const wanderTimeoutRef = useRef(null);
  const mascotRef = useRef(null);

  const getRandomPosition = useCallback(() => {
    const maxX = window.innerWidth - MASCOT_SIZE;
    const maxY = window.innerHeight - MASCOT_SIZE;
    return {
      x: Math.random() * maxX,
      y: Math.random() * (maxY - 100) + 90, // не заходит под navbar
    };
  }, []);

  const scheduleWander = useCallback(() => {
    const delay = 3000 + Math.random() * 4000; // 3-7 сек
    wanderTimeoutRef.current = setTimeout(() => {
      setPosition(getRandomPosition());
      scheduleWander();
    }, delay);
  }, [getRandomPosition]);

  useEffect(() => {
    setPosition(getRandomPosition());
    scheduleWander();
    return () => clearTimeout(wanderTimeoutRef.current);
  }, []);

  const handleDragStart = (clientX, clientY) => {
    clearTimeout(wanderTimeoutRef.current);
    setIsDragging(true);
    const rect = mascotRef.current.getBoundingClientRect();
    dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleDragMove = useCallback((clientX, clientY) => {
    setPosition((prev) => {
      const maxX = window.innerWidth - MASCOT_SIZE;
      const maxY = window.innerHeight - MASCOT_SIZE;
      const newX = Math.max(0, Math.min(clientX - dragOffset.current.x, maxX));
      const newY = Math.max(0, Math.min(clientY - dragOffset.current.y, maxY));
      return { x: newX, y: newY };
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    wanderTimeoutRef.current = setTimeout(() => {
      setPosition(getRandomPosition());
      scheduleWander();
    }, 4000);
  }, [getRandomPosition, scheduleWander]);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
    const onMouseUp = () => handleDragEnd();
    const onTouchMove = (e) => {
      if (e.touches[0]) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handleDragEnd();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${MASCOT_SIZE}px`,
        height: `${MASCOT_SIZE}px`,
        zIndex: 40,
        transition: isDragging ? 'none' : 'left 3s ease-in-out, top 3s ease-in-out',
      }}
    >
      <img
        ref={mascotRef}
        src="/mascot.png"
        alt="Jugando mascot"
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
        draggable={false}
        className={!isDragging ? 'mascot-bob' : ''}
        style={{
          width: '100%',
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
          filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.4))',
        }}
      />
    </div>
  );
}