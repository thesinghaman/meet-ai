"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

// DataTableProps defines the expected props for the DataTable component.
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  // Initialize the table instance using the useReactTable hook
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // Fetches core row model data
  });

  return (
    // Wrapper for the table with rounded corners and border styling
    <div className="rounded-lg border bg-background overflow-hidden">
      <Table>
        <TableBody>
          {/* Check if there are any rows to render */}
          {table.getRowModel().rows?.length ? (
            // Map over rows and render each row with its respective cells
            table.getRowModel().rows.map((row) => (
              <TableRow
                onClick={() => onRowClick?.(row.original)} // Trigger row click handler
                key={row.id}
                data-state={row.getIsSelected() && "selected"} // Highlight selected row
                className="cursor-pointer"
              >
                {/* Render all visible cells for the row */}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-sm p-4">
                    {/* Render the content of the cell */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Render this row when no data is available
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-19 text-center text-muted-foreground"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
