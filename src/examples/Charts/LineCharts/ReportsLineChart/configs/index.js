// function configs(labels, datasets) {
//   return {
//     data: {
//       labels: Array.isArray(labels) && labels.length ? labels : ["No Data"],
//       datasets: [
//         {
//           label: datasets.label || "Revenue",
//           data: Array.isArray(datasets.data) && datasets.data.length ? datasets.data : [0],
//           tension: 0,
//           pointRadius: 5,
//           pointBorderColor: "transparent",
//           pointBackgroundColor: "rgba(255, 255, 255, .8)",
//           borderColor: "rgba(255, 255, 255, .8)",
//           borderWidth: 4,
//           backgroundColor: "transparent",
//           fill: true,
//           data: datasets.data,
//           maxBarThickness: 6,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: false,
//         },
//       },
//       interaction: {
//         intersect: false,
//         mode: "index",
//       },
//       scales: {
//         y: {
//           beginAtZero: true,
//           grid: {
//             drawBorder: false,
//             display: true,
//             drawOnChartArea: true,
//             drawTicks: false,
//             borderDash: [5, 5],
//             color: "rgba(255, 255, 255, .2)",
//           },
//           ticks: {
//             display: true,
//             color: "#f8f9fa",
//             padding: 10,
//             callback: function (value) {
//               return typeof value === "number" ? value.toFixed(2) : value;
//             },
//             font: {
//               size: 14,
//               weight: 300,
//               family: "Roboto",
//               style: "normal",
//               lineHeight: 2,
//             },
//           },
//         },
//         x: {
//           grid: {
//             drawBorder: false,
//             display: false,
//             drawOnChartArea: false,
//             drawTicks: false,
//             borderDash: [5, 5],
//           },
//           ticks: {
//             display: true,
//             color: "#f8f9fa",
//             padding: 10,
//             font: {
//               size: 14,
//               weight: 300,
//               family: "Roboto",
//               style: "normal",
//               lineHeight: 2,
//             },
//           },
//         },
//       },
//     },
//   };
// }

// export default configs;
