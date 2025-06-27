'use client';

import { useEffect, useState } from 'react';
import {
  validateClients,
  validateWorkers,
  validateTasks,
  ValidationError,
} from '@/lib/validators';

type Props = {
  data: any[];
  setData: (newData: any[]) => void;
  entityType: 'clients' | 'workers' | 'tasks';
};

export default function DataGrid({ data, setData, entityType }: Props) {
  const [editing, setEditing] = useState<{ row: number; col: string } | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const headers = Object.keys(data[0] || {});

  useEffect(() => {
    let errs: ValidationError[] = [];
    if (entityType === 'clients') errs = validateClients(data);
    if (entityType === 'workers') errs = validateWorkers(data);
    if (entityType === 'tasks') errs = validateTasks(data);
    setErrors(errs);
  }, [data, entityType]);

  const isError = (rowIndex: number, field: string) =>
    errors.some((e) => e.rowIndex === rowIndex && e.column === field);

  const getErrorMsg = (rowIndex: number, field: string) =>
    errors.find((e) => e.rowIndex === rowIndex && e.column === field)?.message;

  const handleEdit = (rowIndex: number, field: string, value: string) => {
    const updated = [...data];
    updated[rowIndex] = { ...updated[rowIndex], [field]: value };
    setData(updated);
  };

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-md bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="p-2 border-b font-medium text-left bg-gray-100">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((field) => (
                <td
                  key={field}
                  className={`p-2 border-t border-gray-200 ${isError(rowIndex, field) ? 'bg-red-100' : ''}`}
                  onClick={() => setEditing({ row: rowIndex, col: field })}
                >
                  {editing?.row === rowIndex && editing.col === field ? (
                    <input
                      type="text"
                      value={row[field]}
                      autoFocus
                      onBlur={() => setEditing(null)}
                      onChange={(e) => handleEdit(rowIndex, field, e.target.value)}
                      className="w-full border px-1"
                    />
                  ) : (
                    <>
                      {row[field]}
                      {isError(rowIndex, field) && (
                        <div className="text-xs text-red-600 italic">{getErrorMsg(rowIndex, field)}</div>
                      )}
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {errors.length > 0 && (
        <div className="p-2 text-sm text-red-600">
          ⚠️ {errors.length} validation issue(s) found. Please fix them before exporting.
        </div>
      )}
    </div>
  );
}
