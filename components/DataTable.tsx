interface DataTableProps {
  headers: string[];
  rows: string[][];
  highlightColumn?: number;
}

export default function DataTable({ headers, rows, highlightColumn }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "#e7e5e4" }}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: "#1c1917" }}>
            {headers.map((header, colIndex) => (
              <th
                key={colIndex}
                className="px-4 py-3 text-left font-semibold"
                style={{
                  color:
                    highlightColumn !== undefined && colIndex === highlightColumn
                      ? "#ef4444"
                      : "#fafaf9",
                  borderBottom: "1px solid #44403c",
                  whiteSpace: "nowrap",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                backgroundColor: "#fdfcfb",
                borderBottom: rowIndex < rows.length - 1 ? "1px solid #e7e5e4" : "none",
              }}
            >
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-3"
                  style={{
                    color:
                      highlightColumn !== undefined && colIndex === highlightColumn
                        ? "#dc2626"
                        : "#44403c",
                    fontWeight:
                      highlightColumn !== undefined && colIndex === highlightColumn
                        ? 600
                        : 400,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
