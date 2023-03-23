import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as eCharts from "echarts";
export default function BarCharts(props: any) {
  const { dataName, dataBar, dataLine } = props;
  const barChart: any = useRef();
  useEffect(() => {
    const myChart = eCharts.init(barChart.current);

    let option = {
      // 右上角类别标签
      legend: {
        right: 55,
        textStyle: {
          color: "#fff",
        },
        // data: ["Precipitation", "Temperature"],
        data: dataName,
      },
      // 横坐标轴配置
      xAxis: {
        type: "category",
        // 横坐标轴线的样式
        axisLine: {
          show: true,
          lineStyle: {
            color: "#fff",
            width: 2,
          },
        },
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisPointer: {
          type: "line",
        },
      },
      // 纵坐标轴配置
      yAxis: {
        show: true,
        type: "value",
        min: 0,
        max: 35,
        interval: 5,
        // 纵坐标轴线的样式
        axisLine: {
          show: true,
          lineStyle: {
            color: "#fff",
            width: 2,
          },
        },
        // 背景分割线样式
        splitLine: {
          show: false,
        },
        // 分割线空间样式
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(150,150,150,0.2)", "rgba(200,200,200,0)"],
          },
        },
      },
      // 数据展示内容
      series: [
        {
          name: dataName[0],
          type: "bar",
          data: dataBar,
          // data: [
          //   2.6, 5.9, 9.0, 26.4, 28.7, 7.7, 17.6, 18.2, 8.7, 18.8, 6.0, 2.3,
          // ],
        },
        {
          name: dataName[1],
          type: "line",
          // data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3],
          data: dataLine,
        },
      ],
    };

    myChart.setOption(option);
  });
  return (
    <div>
      <div
        ref={barChart}
        style={{
          width: 600,
          height: 400,
          margin: 100,
        }}
      ></div>
    </div>
  );
}

BarCharts.propTypes = {
  dataName: PropTypes.array,
  dataBar: PropTypes.array,
  dataLine: PropTypes.array,
};
