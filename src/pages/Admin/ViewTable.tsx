import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type GenericTableProps<T> = {
  data: T[];
  columns: string[];
  onDelete?: (id: string | number) => void;
  title?: string;
};

export function GenericTable<T>({ data, columns, onDelete, title }: GenericTableProps<T>) {
  return (
    <Card className="bg-card text-card-foreground border border-border shadow-none ">
  <div className="flex items-center justify-between px-6 py-4">
    {/* Title */}
    <div>
      {title && (
        <>
          <div className="font-semibold text-lg">{title}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} Total {title}
          </p>
        </>
      )}
    </div>

    {/* Search */}
    <div className="w-64 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Search..."
        className="pl-9 bg-muted border-border rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-ring transition-colors"
      />
    </div>
  </div>

  <CardContent className="p-0 overflow-x-auto">
    <table className="w-full border-collapse text-center">
      <thead className="bg-muted text-muted-foreground">
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="px-4 py-2 border-b border-border text-center"
            >
              {col}
            </th>
          ))}
          {onDelete && (
            <th className="px-4 py-2 border-b border-border">Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any) => (
          <tr
            key={row.id}
            className="even:bg-background/50 odd:bg-background border-b border-border"
          >
            {columns.map((col) => (
              <td key={col} className="px-4 py-2">
                {row[col]}
              </td>
            ))}
            {onDelete && (
              <td className="px-4 py-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(row.id)}
                >
                  Delete
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </CardContent>
</Card>

  );
}
