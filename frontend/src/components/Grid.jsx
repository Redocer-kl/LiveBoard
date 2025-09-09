
import { Layer, Shape } from "react-konva";

function Grid({ stageRef, gridSize = 50, stroke = "#e6e6e6", enabled = true }) {
  // drawing is done in the sceneFunc so it respects stage transforms
  return (
    <Layer listening={false}>
      {enabled && (
        <Shape
          sceneFunc={(ctx, shape) => {
            const stage = stageRef.current;
            if (!stage) return;

            const scale = stage.scaleX() || 1;

            // visible area in *world* coordinates
            const viewW = stage.width() / scale;
            const viewH = stage.height() / scale;
            const viewX = -stage.x() / scale;
            const viewY = -stage.y() / scale;

            const startX = Math.floor(viewX / gridSize) * gridSize;
            const endX = Math.ceil((viewX + viewW) / gridSize) * gridSize;
            const startY = Math.floor(viewY / gridSize) * gridSize;
            const endY = Math.ceil((viewY + viewH) / gridSize) * gridSize;

            ctx.beginPath();

            // vertical lines
            for (let x = startX; x <= endX; x += gridSize) {
              ctx.moveTo(x, startY);
              ctx.lineTo(x, endY);
            }

            // horizontal lines
            for (let y = startY; y <= endY; y += gridSize) {
              ctx.moveTo(startX, y);
              ctx.lineTo(endX, y);
            }

            // Make line width consistent on screen regardless of scale
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1 / scale;
            ctx.stroke();
            ctx.closePath();

            // required for Konva Shape
            ctx.fillStrokeShape(shape);
          }}
          listening={false}
        />
      )}
    </Layer>
  );
}

export default Grid;
