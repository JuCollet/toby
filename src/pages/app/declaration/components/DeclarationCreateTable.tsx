import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useContext } from "react";
import { DeclarationContext } from "../Declaration";
import { Card, CardContent } from "@/components/ui/card";

import { DeclarationCreateTableFormRow } from "./DeclarationCreateTableFormRow";
import { useTranslation } from "react-i18next";

export const DeclarationCreateTable = () => {
  const { t } = useTranslation();
  const { declarationRows, removeDeclarationRow } =
    useContext(DeclarationContext);

  const total =
    Math.round(
      declarationRows.reduce((acc, curr) => acc + curr.amount, 0) * 100
    ) / 100;

  return (
    <Card className="flex flex-1">
      <CardContent className="flex flex-1 p-6">
        <div className="flex flex-col flex-1 justify-between">
          <div className="overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[125px] px-0">
                    {t("declaration.create.type")}
                  </TableHead>
                  <TableHead className="w-[200px]">
                    {t("declaration.create.rate")}
                  </TableHead>
                  <TableHead>{t("declaration.create.taxBasis")}</TableHead>
                  <TableHead className="text-right">
                    {t("declaration.create.taxAmount")}
                  </TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <DeclarationCreateTableFormRow key={declarationRows.length} />
                {declarationRows.map(({ rate, type, basis, amount }, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-0">{type}</TableCell>
                    <TableCell>{`${rate}%`}</TableCell>
                    <TableCell>{`${basis} EUR`}</TableCell>
                    <TableCell className="font-medium text-right">{`${amount} EUR`}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => removeDeclarationRow({ index })}
                        variant="link"
                      >
                        <Trash2 size="1rem" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end border-t-2 py-2 border-b-0 border-neutral-600">
            <span className="font-bold">{`${total} EUR`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
