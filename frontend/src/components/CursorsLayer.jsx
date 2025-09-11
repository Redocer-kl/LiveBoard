// CursorsLayer.jsx (JSX-only)
// Exports a <CursorsLayer /> component that renders cursor shapes inside an existing <Stage>.
// Usage:
// 1) Keep your Stage already in place.
// 2) Import: import CursorsLayer from './CursorsLayer';
// 3) Add inside your Stage (siblings with other Layers):
//     <CursorsLayer users={Array.from(usersMap.values())} />
// Props:
// - users: array of { userId, color, posx, posy, label }
// - size: base size of the cursor (default 18)
// - showLabels: boolean
// - normalizeToNumber: ensure posx/posy are numbers (default true)

import React, { useMemo } from 'react';
import { Layer, Group, Arrow, Circle, Rect, Text } from 'react-konva';

function CursorShape({ user, size = 18, showLabel = true }) {
  const { userId, username, color = '#ff0000', posx = 0, posy = 0, label } = user;
  const labelText = String(label ?? `${username}`);

  // Arrow geometry relative to group origin (0,0 is where we place the group)
  const arrowPoints = [0, 0, -size * 0.45, -size * 1.2];
  const dotX = -size * 0.45;
  const dotY = -size * 1.2;

  const labelPadding = 6;
  const approxCharW = 7;
  const labelW = Math.max(60, labelText.length * approxCharW + labelPadding * 2);
  const labelH = 20;
  const labelOffsetX = -labelW - size * 0.5;
  const labelOffsetY = -size * 2.5;

  return (
    <Group x={posx + 10} y={posy + 20}>
      <Arrow
        points={arrowPoints}
        pointerLength={size * 0.9}
        pointerWidth={size * 0.7}
        fill={"#fff"}
        stroke={"#000"}
        strokeWidth={1}
      />



      {showLabel && (
        <Group x={labelOffsetX} y={labelOffsetY}>
          <Rect
            x={0}
            y={0}
            width={labelW}
            height={labelH}
            cornerRadius={6}
            fill={color}
            opacity={0.95}
            shadowColor="#000"
            shadowBlur={6}
            shadowOpacity={0.25}
          />
          <Text
            x={labelPadding}
            y={2}
            text={labelText}
            fontSize={12}
            fontStyle="bold"
            fill="#fff"
            align="left"
            width={labelW - labelPadding * 2}
            verticalAlign="middle"
          />
        </Group>
      )}
    </Group>
  );
}

export default function CursorsLayer({ users = [], size = 18, showLabels = true, normalizeToNumber = true }) {
  // Accept either an array or a Map/iterable; normalize to array of user objects
  const usersArray = useMemo(() => {
    if (!users) return [];
    if (Array.isArray(users)) return users.map(u => ({ ...u }));
    // handle Map or other iterable
    try {
      return Array.from(users).map(u => ({ ...u }));
    } catch (e) {
      return [];
    }
  }, [users]);

  const normalized = useMemo(() => {
    return usersArray.map(u => {
      const id = String(u.userId ?? u.id ?? Math.random());
      const posx = normalizeToNumber ? Number(u.posx || 0) : u.posx;
      const posy = normalizeToNumber ? Number(u.posy || 0) : u.posy;
      return { ...u, userId: id, posx, posy };
    });
  }, [usersArray, normalizeToNumber]);

  return (
    <Layer listening={false}>
      {normalized.map(u => (
        // IMPORTANT: use stable unique keys. Do not use index.
        <CursorShape key={String(u.userId)} user={u} size={size} showLabel={showLabels} />
      ))}
    </Layer>
  );
}

/*
Integration notes (quick):
- Put <CursorsLayer users={Array.from(usersMap.values())} /> inside your existing <Stage> next to other Layers.
- listening={false} on Layer disables pointer events so it won't intercept drawing/interaction if you need that.
- Ensure the Stage and the cursor coordinates use the same coordinate system (if you pan/zoom, send stage coords to the server or transform coords before rendering).
- For smooth motion, consider animating properties using Konva.Tween or interpolate positions between updates.
*/
