import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {AbstractComponent} from "./abstractComponent";

export class StatsChart extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
   </div>`;
  }
  createChart(genres) {
    if (genres.length === 0) {
      return ``;
    }
    const [keys, values] = genres;

    const ctx = this.getElement()
      .querySelector(`.statistic__chart`)
      .getContext(`2d`);

    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: keys,
        datasets: [
          {
            backgroundColor: `#FBE44D`,
            data: values
          }
        ]
      },
      options: {
        plugins: {
          datalabels: {
            clamp: true,
            anchor: `start`,
            offset: 40,
            color: `#ffffff`,
            align: `start`,
            font: {
              family: `Open Sans`,
              weight: `bold`,
              size: 24
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                defaultFontFamily: `Open Sans`,
                beginAtZero: true,
                display: true,
                fontColor: `#ffffff`,
                fontSize: 24,
                padding: 100
              },
              maxBarThickness: 40,
              barPercentage: 1.0,
              categoryPercentage: 0.9,
              gridLines: {
                display: false,
                drawBorder: false
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                display: false,
                min: 0
              },
              gridLines: {
                display: false,
                drawBorder: false
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        layout: {
          padding: {
            left: 40
          }
        },
        animation: {
          easing: `easeInOutQuad`
        }
      }
    });
  }
}
