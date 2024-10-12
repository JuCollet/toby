import { DeclarationRow } from "@/pages/app/declaration/Declaration";
import { PDFDocument, PDFPage, rgb, StandardFonts } from "pdf-lib";
import { UserSettings } from "../query/useUserConfig";
import { getRoundedFloat } from "@/utils/number";

type Article = "1201" | "1203";
type Rate = "012" | "035" | "132";
export type Row = "ctwoul" | "ctwul" | "rtwoul" | "rtwul";

type TaxAmount = {
  basis: string;
  amount: string;
};

export type RowData = {
  [A in Article]?: {
    [R in Rate]?: TaxAmount;
  };
};

export type TaxData = {
  [R in Row]?: RowData & { totalAmount?: string };
};

type Data = {
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  niss: string;
  firstName: string;
  lastName: string;
  street: string;
  streetNo: string;
  zipCode: string;
  locality: string;
  totalAmount: string;
} & TaxData;

type PageData = {
  page: PDFPage;
  value: string;
  x: number;
  y: number;
  size?: number;
};

const PAYMENTS_LIMIT_AMOUNT = 1600;

const getArrayBufferFromB64 = (base64: string) => {
  const base64String = base64.split(",")[1];
  const binaryString = window.atob(base64String);

  const len = binaryString.length;
  const arrayBuffer = new ArrayBuffer(len);

  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < len; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return arrayBuffer;
};

const splitNumber = (numberStr: string): string[] => {
  const [integerPart, decimalPart] = numberStr.split(".");
  const chunks =
    integerPart
      .split("")
      .reverse()
      .join("")
      .match(/.{1,3}/g)
      ?.map((chunk) => chunk.split("").reverse().join(""))
      .reverse() || [];
  return decimalPart ? [...chunks, decimalPart] : chunks;
};

const getSplittedLargeValuePositions = ({
  value,
  ...pageData
}: Omit<PageData, "value"> & { value?: string }): PageData[] => {
  if (value == null || value === "0.00") {
    return [];
  }

  const gap = 35;
  const decimalGap = 105;
  const splittedAmount = splitNumber(value);
  const hasDecimals =
    splittedAmount.length > 1 &&
    splittedAmount[splittedAmount.length - 1].length == 2;
  const partsAmount = splittedAmount.length - (hasDecimals ? 1 : 0);
  const startPosition = pageData.x + 2 + 2 * gap - (partsAmount - 1) * gap;

  return splittedAmount.map((val, i, arr) => ({
    ...pageData,
    value: val,
    x:
      hasDecimals && i === arr.length - 1
        ? pageData.x + decimalGap
        : startPosition + i * gap,
  }));
};

const getTotalAmount = ({
  declarationRows,
}: {
  declarationRows: DeclarationRow[];
}) => declarationRows.reduce((acc, curr) => acc + curr.amount, 0);

const getTaxData = ({
  declarationRows,
}: {
  declarationRows: DeclarationRow[];
}): TaxData => {
  const taxData: TaxData = {};

  const payments = declarationRows.filter(({ amount }) => amount >= 0);
  const paymentsTotalAmount = payments.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  let paymentsKey: Row =
    paymentsTotalAmount > PAYMENTS_LIMIT_AMOUNT ? "ctwul" : "ctwoul";

  taxData[paymentsKey] = {
    "1201": {
      "012": {
        amount: payments
          .filter(({ rate }) => rate === "0.12")
          .reduce((acc, curr) => acc + curr.amount, 0)
          .toFixed(2),
        basis: payments
          .filter(({ rate }) => rate === "0.12")
          .reduce((acc, curr) => acc + curr.basis, 0)
          .toFixed(2),
      },
      "035": {
        amount: payments
          .filter(({ rate }) => rate === "0.35")
          .reduce((acc, curr) => acc + curr.amount, 0)
          .toFixed(2),
        basis: payments
          .filter(({ rate }) => rate === "0.35")
          .reduce((acc, curr) => acc + curr.basis, 0)
          .toFixed(2),
      },
      "132": {
        amount: payments
          .filter(({ rate }) => rate === "1.32")
          .reduce((acc, curr) => acc + curr.amount, 0)
          .toFixed(2),
        basis: payments
          .filter(({ rate }) => rate === "1.32")
          .reduce((acc, curr) => acc + curr.basis, 0)
          .toFixed(2),
      },
    },
    totalAmount: getRoundedFloat({
      num: payments.reduce((acc, curr) => acc + curr.amount, 0),
    }).toFixed(2),
  };

  return taxData;
};

const getPrefixedMonth = (month: string) => {
  if (!month) {
    return "";
  }

  if (month.length === 1) {
    return "0" + month;
  }

  return month;
};

export const generatePdf = async ({
  declarationRows,
  userSettings,
  periods,
  b64signature,
}: {
  declarationRows: DeclarationRow[];
  userSettings: UserSettings;
  periods: string[];
  b64signature?: string;
}) => {
  const baseFilePath = `${window.location.origin}/toby/tob_form.pdf`;
  const existingPdfBytes = await fetch(baseFilePath).then((res) =>
    res.arrayBuffer()
  );

  const data: Data = {
    startMonth: getPrefixedMonth(periods.sort()[0]?.split("/")[1]),
    startYear: periods.sort()[0]?.split("/")[0].slice(2, 4),
    endMonth: getPrefixedMonth(periods.sort()[1]?.split("/")[1]),
    endYear: periods.sort()[1]?.split("/")[0].slice(2, 4) ?? "",
    niss: userSettings.niss,
    lastName: userSettings.lastName,
    firstName: userSettings.firstName,
    street: userSettings.street,
    streetNo: userSettings.streetNo,
    zipCode: userSettings.zipCode,
    locality: userSettings.locality,
    totalAmount: getRoundedFloat({
      num: getTotalAmount({ declarationRows }),
    }).toFixed(2),
    ...getTaxData({ declarationRows }),
  };

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const today = new Date();
  const formattedDate =
    today.getDate().toString().padStart(2, "0") +
    "/" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    today.getFullYear();

  const pages = pdfDoc.getPages();

  const elements: (PageData | null)[] = [
    {
      page: pages[0],
      value: data.startMonth,
      x: 275,
      y: 725,
      size: 8,
    },
    {
      page: pages[0],
      value: data.startYear,
      x: 290,
      y: 725,
      size: 8,
    },
    data.endMonth
      ? {
          page: pages[0],
          value: data.endMonth,
          x: 386,
          y: 725,
          size: 8,
        }
      : null,
    data.endYear
      ? {
          page: pages[0],
          value: data.endYear,
          x: 399,
          y: 725,
          size: 8,
        }
      : null,
    {
      page: pages[0],
      value: data.niss,
      x: 302,
      y: 655,
    },
    {
      page: pages[0],
      value: `${data.firstName} ${data.lastName}`,
      x: 302,
      y: 643.5,
    },
    {
      page: pages[0],
      value: `${data.street} ${data.streetNo}`,
      x: 302,
      y: 632,
    },
    {
      page: pages[0],
      value: `${data.zipCode} ${data.locality}`,
      x: 302,
      y: 620.5,
    },
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwoul?.["1201"]?.["012"]?.basis,
      x: 277,
      y: 538,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwoul?.["1201"]?.["012"]?.amount,
      x: 408,
      y: 538,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwoul?.["1201"]?.["035"]?.basis,
      x: 277,
      y: 457,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwoul?.["1201"]?.["035"]?.amount,
      x: 408,
      y: 457,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwoul?.["1201"]?.["132"]?.basis,
      x: 277,
      y: 434,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwoul?.["1201"]?.["132"]?.amount,
      x: 408,
      y: 434,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwoul?.["1203"]?.["132"]?.basis,
      x: 277,
      y: 410,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwoul?.["1203"]?.["132"]?.amount,
      x: 408,
      y: 410,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwoul?.totalAmount,
      x: 408,
      y: 329,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwul?.["1201"]?.["012"]?.basis,
      x: 277,
      y: 234,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwul?.["1201"]?.["012"]?.amount,
      x: 408,
      y: 234,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwul?.["1201"]?.["035"]?.basis,
      x: 277,
      y: 212,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwul?.["1201"]?.["035"]?.amount,
      x: 408,
      y: 212,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwul?.["1201"]?.["132"]?.basis,
      x: 277,
      y: 187,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwul?.["1201"]?.["132"]?.amount,
      x: 408,
      y: 187,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwul?.["1203"]?.["132"]?.basis,
      x: 277,
      y: 153,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwul?.["1203"]?.["132"]?.amount,
      x: 408,
      y: 153,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[0],
      value: data?.ctwul?.totalAmount,
      x: 408,
      y: 72,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwoul?.["1201"]?.["012"]?.basis,
      x: 285,
      y: 770,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwoul?.["1201"]?.["012"]?.amount,
      x: 416,
      y: 770,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwoul?.["1201"]?.["035"]?.basis,
      x: 285,
      y: 748,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwoul?.["1201"]?.["035"]?.amount,
      x: 416,
      y: 748,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwoul?.["1201"]?.["132"]?.basis,
      x: 285,
      y: 722,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwoul?.["1201"]?.["132"]?.amount,
      x: 416,
      y: 722,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwoul?.["1203"]?.["132"]?.basis,
      x: 285,
      y: 700,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwoul?.["1203"]?.["132"]?.amount,
      x: 416,
      y: 700,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwoul?.totalAmount,
      x: 416,
      y: 630,
    }),

    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwul?.["1201"]?.["012"]?.basis,
      x: 285,
      y: 559,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwul?.["1201"]?.["012"]?.amount,
      x: 416,
      y: 559,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwul?.["1201"]?.["035"]?.basis,
      x: 285,
      y: 535,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwul?.["1201"]?.["035"]?.amount,
      x: 416,
      y: 535,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwul?.["1201"]?.["132"]?.basis,
      x: 285,
      y: 513,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwul?.["1201"]?.["132"]?.amount,
      x: 416,
      y: 513,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwul?.["1203"]?.["132"]?.basis,
      x: 285,
      y: 490,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwul?.["1203"]?.["132"]?.amount,
      x: 416,
      y: 490,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.rtwul?.totalAmount,
      x: 416,
      y: 421,
    }),
    ...getSplittedLargeValuePositions({
      page: pages[1],
      value: data?.totalAmount,
      x: 325,
      y: 372,
    }),
    {
      page: pages[1],
      value: data.locality,
      x: 84,
      y: 254,
    },
    {
      page: pages[1],
      value: formattedDate,
      x: 182,
      y: 254,
    },
    {
      page: pages[1],
      value: `${data.firstName} ${data.lastName}`,
      x: 327,
      y: 290,
    },
  ];

  elements
    .filter((p): p is PageData => p != null)
    .forEach(({ page, value, x, y, size }) =>
      page.drawText(value, {
        x,
        y,
        size: size ?? 11,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      })
    );

  if (b64signature) {
    const arrayBuffer = getArrayBufferFromB64(b64signature);

    const pngImage = await pdfDoc.embedPng(arrayBuffer);

    pages[1].drawImage(pngImage, { height: 50, width: 125, x: 325, y: 235 });
  }

  return await pdfDoc.saveAsBase64();
};
