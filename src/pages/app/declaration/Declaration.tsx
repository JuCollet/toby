import { createContext, useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

export type DeclarationRate = "0.12" | "0.35" | "1.32";

export type DeclarationRow = {
  rate: DeclarationRate;
  basis: number;
  amount: number;
  type: string;
};

export type DeclarationActions = {
  addDeclarationRow: ({
    declarationRow,
  }: {
    declarationRow: DeclarationRow;
  }) => void;
  removeDeclarationRow: ({ index }: { index: number }) => void;
  setDocument: ({ b64Document }: { b64Document: string }) => void;
  setSignature: ({ b64Signature }: { b64Signature: string }) => void;
};

type DeclarationState = {
  declarationRows: DeclarationRow[];
  periods: string[];
  b64Document?: string;
  b64Signature?: string;
} & DeclarationActions;

const defaultState: DeclarationState = {
  declarationRows: [],
  periods: [],
  addDeclarationRow: () => null,
  removeDeclarationRow: () => null,
  setDocument: () => null,
  setSignature: () => null,
};

export const DeclarationContext = createContext<DeclarationState>(defaultState);

export const Declaration = () => {
  const { state: params } = useLocation();
  const [state, setState] = useState({
    ...defaultState,
    periods: params?.selectedPeriods ?? [],
  });

  const addDeclarationRow = useCallback<
    DeclarationActions["addDeclarationRow"]
  >(
    ({ declarationRow }) => {
      setState((p) => ({
        ...p,
        declarationRows: [declarationRow, ...p.declarationRows],
      }));
    },
    [setState]
  );

  const removeDeclarationRow = useCallback<
    DeclarationActions["removeDeclarationRow"]
  >(
    ({ index }) =>
      setState((p) => ({
        ...p,
        declarationRows: p.declarationRows.filter((_, i) => i !== index),
      })),
    [setState]
  );

  const setDocument = useCallback<DeclarationActions["setDocument"]>(
    ({ b64Document }) =>
      setState((p) => ({
        ...p,
        b64Document,
      })),
    [setState]
  );

  const setSignature = useCallback<DeclarationActions["setSignature"]>(
    ({ b64Signature }) =>
      setState((p) => ({
        ...p,
        b64Signature,
      })),
    [setState]
  );

  return (
    <DeclarationContext.Provider
      value={{
        ...state,
        addDeclarationRow,
        removeDeclarationRow,
        setDocument,
        setSignature,
      }}
    >
      <Outlet />
    </DeclarationContext.Provider>
  );
};
