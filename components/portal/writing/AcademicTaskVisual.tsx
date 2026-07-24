"use client";

import { VisualData } from "@/lib/mock/writing-tests";

interface AcademicTaskVisualProps {
  visualData?: VisualData;
}

export function AcademicTaskVisual({ visualData }: AcademicTaskVisualProps) {
  if (!visualData) return null;

  const { type, data } = visualData;

  const renderContent = () => {
    switch (type) {
      case "table":
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                  {data.headers.map((h: string, i: number) => (
                    <th key={i} className="px-4 py-3 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.rows.map((row: string[], i: number) => (
                  <tr key={i} className="hover:bg-muted/20">
                    {row.map((cell: string, j: number) => (
                      <td key={j} className={`px-4 py-3 ${j === 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "bar-chart":
      case "line-graph":
        // Fallback representation of charts using a stylized data grid 
        // since external charting libraries are not available.
        // A simple horizontal bar representation for 'bar-chart'
        return (
          <div className="space-y-6">
            <div className="flex justify-center gap-6 mb-4">
              {data.datasets.map((ds: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm font-bold">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ds.color }}></div>
                  {ds.label}
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              {data.labels.map((label: string, labelIdx: number) => (
                <div key={labelIdx} className="space-y-2 border-b border-border/50 pb-4 last:border-0">
                  <p className="font-bold text-sm text-foreground w-20 shrink-0">{label}</p>
                  <div className="flex flex-col gap-2 flex-1">
                    {data.datasets.map((ds: any, dsIdx: number) => {
                      // Find max value to calculate percentage width
                      const allValues = data.datasets.flatMap((d: any) => d.data);
                      const maxVal = Math.max(...allValues);
                      const val = ds.data[labelIdx];
                      const pct = Math.max((val / maxVal) * 100, 5); // min 5% for visibility
                      
                      return (
                        <div key={dsIdx} className="flex items-center gap-3">
                          <div className="w-full bg-muted rounded-full h-4 overflow-hidden relative">
                            <div 
                              className="h-full rounded-full transition-all duration-1000" 
                              style={{ width: `${pct}%`, backgroundColor: ds.color }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-muted-foreground w-12 text-right">
                            {type === 'bar-chart' ? `${val}%` : val.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "pie-charts":
        // Simple representation of pie charts data
        return (
          <div className="grid md:grid-cols-2 gap-8">
            {data.charts.map((chart: any, i: number) => (
              <div key={i} className="bg-muted/30 p-4 rounded-xl border border-border">
                <h4 className="font-bold text-center mb-4 text-foreground">{chart.label}</h4>
                <div className="space-y-3">
                  {chart.segments.map((seg: any, j: number) => (
                    <div key={j} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></div>
                        <span className="text-sm font-medium text-muted-foreground">{seg.name}</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{seg.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case "process-diagram":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.steps.map((step: any, i: number) => (
              <div key={i} className="relative bg-muted/50 border border-border p-4 rounded-xl flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3 z-10">
                  {step.id}
                </div>
                <p className="text-xs font-medium text-foreground">{step.text}</p>
                {/* Connector line for desktop */}
                {i < data.steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 w-full h-[2px] bg-border translate-x-1/2 z-0"></div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return <div className="text-muted-foreground text-sm italic">Visual data cannot be rendered.</div>;
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
      <h3 className="font-extrabold text-foreground mb-6 text-center text-lg">{data.title}</h3>
      {renderContent()}
    </div>
  );
}
