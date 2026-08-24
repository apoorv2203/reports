import * as React from "react"
import { AppTable } from "./AppTable"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type AppDataTableColumn<T> = { key: string; header: React.ReactNode; render?: (row: T) => React.ReactNode }

export function AppDataTable<T>({ columns, data, getRowKey, empty }: { columns: AppDataTableColumn<T>[]; data: T[]; getRowKey?: (row: T, index: number) => React.Key; empty?: React.ReactNode }) {
  return <AppTable><TableHeader><TableRow>{columns.map((column) => <TableHead key={column.key}>{column.header}</TableHead>)}</TableRow></TableHeader><TableBody>{data.length ? data.map((row, index) => <TableRow key={getRowKey?.(row, index) ?? index}>{columns.map((column) => <TableCell key={column.key}>{column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? "")}</TableCell>)}</TableRow>) : <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">{empty}</TableCell></TableRow>}</TableBody></AppTable>
}
