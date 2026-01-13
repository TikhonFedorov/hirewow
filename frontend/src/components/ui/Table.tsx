import React from 'react';
import './Table.css';

interface Column {
  id: string;
  name: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
  emptyMessage?: string;
  className?: string;
}

export default function Table({ columns, data, emptyMessage = 'Нет данных', className = '' }: TableProps) {
  if (data.length === 0) {
    return (
      <div className={`table-empty ${className}`}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`table-wrapper ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} className="table-header">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              {columns.map((column) => (
                <td key={column.id} className="table-cell">
                  {column.render ? column.render(row[column.id], row) : row[column.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


