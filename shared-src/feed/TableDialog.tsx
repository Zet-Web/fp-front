// Dialog component for inserting tables with column/row count selection

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (rows: number, cols: number) => void;
}

const MAX_COLS = 6;
const MAX_ROWS = 10;

export function TableDialog({ isOpen, onClose, onInsert }: TableDialogProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const handleInsert = () => {
    const validRows = Math.min(Math.max(1, rows), MAX_ROWS);
    const validCols = Math.min(Math.max(1, cols), MAX_COLS);
    onInsert(validRows, validCols);
    onClose();
    setRows(3);
    setCols(3);
  };

  const handleCancel = () => {
    onClose();
    setRows(3);
    setCols(3);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
          <DialogDescription>
            Create a table with up to {MAX_COLS} columns and {MAX_ROWS} rows
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rows">
              Rows (max {MAX_ROWS})
            </Label>
            <Input
              id="rows"
              type="number"
              min={1}
              max={MAX_ROWS}
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cols">
              Columns (max {MAX_COLS})
            </Label>
            <Input
              id="cols"
              type="number"
              min={1}
              max={MAX_COLS}
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert Table</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
