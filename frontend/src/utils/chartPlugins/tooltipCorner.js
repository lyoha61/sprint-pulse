import { Tooltip } from 'chart.js';

export const tooltipCorner = {
  id: 'tooltipCorner',
  beforeInit(chart) {
    Tooltip.positioners.followVerticalX = function(activeElements, eventPosition) {
      if (!activeElements.length) return false;

      const activeElement = activeElements[0];
      const chartArea = chart.chartArea;
      
      const x = activeElement.element.x;
      let y = eventPosition.y;

      if (chartArea) {
        if (y < chartArea.top) y = chartArea.top;
        if (y > chartArea.bottom) y = chartArea.bottom;
      }

      const middleX = chartArea ? (chartArea.left + chartArea.right) / 2 : 0;
      
      const xAlign = x < middleX ? 'left' : 'right';

      return {
        x: x,
        y: y,
        caretX: x,
        caretY: y,
        yAlign: 'center', 
        xAlign: xAlign
      };
    };
  }
};