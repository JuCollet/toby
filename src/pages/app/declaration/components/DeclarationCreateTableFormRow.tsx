import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  DeclarationContext,
  DeclarationRate,
  DeclarationRow,
} from "../Declaration";

export const DeclarationCreateTableFormRow = () => {
  const { t } = useTranslation();
  const [declarationRow, setDeclarationRow] = useState<
    Omit<DeclarationRow, "basis"> & { basis?: string }
  >({
    rate: "0.12",
    amount: 0,
    basis: "",
    type: t("declaration.create.payment"),
  });
  const { addDeclarationRow } = useContext(DeclarationContext);

  const parsedBasis = parseFloat(declarationRow.basis ?? "0");

  const amount =
    Math.round(parsedBasis * (parseFloat(declarationRow.rate) / 100) * 100) /
    100;

  const onSubmit = () => {
    if (!declarationRow.basis || declarationRow.basis === "0") {
      return;
    }

    addDeclarationRow({
      declarationRow: {
        ...declarationRow,
        type:
          amount >= 0
            ? t("declaration.create.payment")
            : t("declaration.create.reimbursement"),
        amount,
        basis: parsedBasis,
      },
    });
  };

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell className="px-0">
        {parsedBasis < 0
          ? t("declaration.create.reimbursement")
          : t("declaration.create.payment")}
      </TableCell>
      <TableCell>
        <Select
          onValueChange={(rate: DeclarationRate) =>
            setDeclarationRow((p) => ({ ...p, rate }))
          }
          value={declarationRow.rate}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("declaration.create.rate")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.12">0.12% (ETF)</SelectItem>
            <SelectItem value="0.35">{`0.35% (${t("declaration.create.stock")})`}</SelectItem>
            <SelectItem value="1.32">1.32%</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          autoFocus
          value={declarationRow.basis}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
          onChange={(e) => {
            if (
              /\d/.test(e.currentTarget.value) ||
              e.currentTarget.value === ""
            ) {
              return setDeclarationRow((p) => ({
                ...p,
                basis: e.currentTarget.value,
              }));
            }
          }}
        />
      </TableCell>
      <TableCell className="font-medium text-right">
        {isNaN(amount) ? null : amount + " EUR"}
      </TableCell>
      <TableCell className="text-right">
        <Button size="sm" onClick={onSubmit} disabled={parsedBasis === 0}>
          <Plus size="1rem" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
