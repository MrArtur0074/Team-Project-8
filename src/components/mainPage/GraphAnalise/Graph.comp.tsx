import "./Graph.comp.css";
import { CompositeChart } from "@mantine/charts";
import { biaxialData } from "./data_graph.ts";

export default function Graph() {
  return (
    <div className="wrapper_chart" style={{ background: "none" }}>
      <CompositeChart
        h={400}
        data={biaxialData}
        dataKey="name"
        withRightYAxis
        // yAxisLabel="uv"
        // rightYAxisLabel="pv"
        style={{
          border: "1.2px solid #ffff",
          borderRadius: "30px",
          background: "none",
          padding: "50px 30px 40px 30px",
        }}
        className="chart_mega"
        series={[
          { name: "uv", color: "pink.6", type: "line" },
          { name: "pv", color: "cyan.6", yAxisId: "right", type: "area" },
        ]}
      />
    </div>
  );
}
