"use client";
import { DataTable } from "@/app/admin/batches/batch-data-table";
import type { BatchWithMediaAndCreatedBy } from "@/components/section-cards";
interface DataTableProps {
  data: BatchWithMediaAndCreatedBy[];
}

export function BatchDataTable({ data }: DataTableProps) {
  return (
    <div>
      <DataTable data={data} />
    </div>
  );
}
