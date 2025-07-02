import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { KeyValuePair } from "./types";

interface KeyValuePairSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: KeyValuePair[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: "key" | "value", value: string) => void;
  keyPlaceholder: string;
  valuePlaceholder: string;
  valueType?: string;
  addButtonText: string;
}

export function KeyValuePairSection({
  title,
  description,
  icon,
  items,
  onAdd,
  onRemove,
  onUpdate,
  keyPlaceholder,
  valuePlaceholder,
  valueType = "text",
  addButtonText,
}: KeyValuePairSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              placeholder={keyPlaceholder}
              value={item.key}
              onChange={(e) => onUpdate(index, "key", e.target.value)}
            />
            <Input
              type={valueType}
              placeholder={valuePlaceholder}
              value={item.value}
              onChange={(e) => onUpdate(index, "value", e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addButtonText}
        </Button>
      </CardContent>
    </Card>
  );
}