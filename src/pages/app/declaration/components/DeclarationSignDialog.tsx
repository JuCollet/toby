import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

import { DeclarationContext } from "../Declaration";

type Props = {
  open: boolean;
  onOpenChange(open: boolean): void;
};

const styles = {
  border: "none",
  borderRadius: "0",
};

export const DeclarationSignDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation();
  const { setSignature } = useContext(DeclarationContext);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("declaration.sign.modal.title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 my-4 border border-neutral-300 rounded-sm overflow-auto">
          <ReactSketchCanvas
            ref={canvasRef}
            style={styles}
            width="370"
            height="150"
            strokeWidth={2}
            strokeColor="black"
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            variant="outline"
            onClick={() => canvasRef.current?.resetCanvas()}
          >
            {t("common.clear")}
          </Button>
          <Button
            type="submit"
            onClick={async () => {
              const b64Signature = await canvasRef.current?.exportImage("png");
              if (b64Signature) {
                setSignature({ b64Signature });
              }
              onOpenChange(false);
            }}
          >
            {t("declaration.sign.modal.signButtonLabel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
