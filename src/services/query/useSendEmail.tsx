import { useContext, useMemo } from "react";
import { useMutation } from "react-query";
import { AuthContext } from "../../context/AuthProvider";
import { useTranslation } from "react-i18next";
import { UserSettings } from "./useUserConfig";
import { getMonthName } from "@/utils/date";

const BOUNDARY = "boundary";

const createEmail = ({
  attachment,
  subject,
  message,
  filename,
  recipient,
}: {
  attachment: string;
  subject: string;
  message: string;
  filename: string;
  recipient: string;
}): string => `Content-Type: multipart/mixed; boundary=${BOUNDARY}
MIME-Version: 1.0
to: ${recipient}
subject: ${subject}

--${BOUNDARY}
Content-Type: text/plain; charset="UTF-8"
MIME-Version: 1.0

${message}

--${BOUNDARY}
Content-Type: application/pdf
MIME-Version: 1.0
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="${filename}"

${attachment}

--${BOUNDARY}--`;

async function sendEmail({
  accessToken,
  b64PDF,
  subject,
  message,
  filename,
  recipient,
}: {
  accessToken: string;
  b64PDF: string;
  subject: string;
  message: string;
  filename: string;
  recipient: string;
}) {
  const response = await fetch(
    "https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=multipart",
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `message/rfc822; boundary=${BOUNDARY}`,
      },
      body: createEmail({
        attachment: b64PDF,
        subject,
        message,
        filename,
        recipient,
      }),
    }
  );
  return response.json();
}

export const useSendEmail = ({
  userSettings,
  periods,
}: {
  userSettings: UserSettings;
  periods: string[];
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { token } = useContext(AuthContext);
  const recipient =
    import.meta.env.MODE === "production"
      ? "CPIC.TAXDIV@minfin.fed.be"
      : "ju.collet@gmail.com";

  const years = periods.map((period) => period.split("/")[0]);
  const months = periods.map((period) =>
    getMonthName({
      monthIndex: parseInt(period.split("/")[1]) - 1,
      locale: language,
    })
  );
  const monthsShort = periods
    .map((period) =>
      getMonthName({
        monthIndex: parseInt(period.split("/")[1]) - 1,
        locale: language,
        format: "short",
      })
    )
    .map((month) => month.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  const isSameYear = periods.every(
    (period) => period.split("/")[0] === years[0]
  );

  const period = useMemo(() => {
    if (years.length === 1) {
      return `${months[0]} ${years[0]}`;
    }

    return t("common.periods_two", {
      first: `${months[0]}${isSameYear ? "" : ` ${years[0]}`}`,
      second: `${months[1]} ${years[1]}`,
    });
  }, []);

  const filenamePeriod = useMemo(() => {
    if (years.length === 1) {
      return `${monthsShort[0]}_${years[0]}`;
    }

    return `${monthsShort[0]}-${years[0]}_${monthsShort[1]}-${years[1]}`;
  }, []);

  const message = t("declaration.submit.email.message", {
    period,
    name: `${userSettings.firstName} ${userSettings.lastName}`,
  });

  const subject = t("declaration.submit.email.subject", {
    period,
  })
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const filename = t("declaration.submit.email.filename", {
    lastname: userSettings.lastName,
    firstname: userSettings.firstName,
    period: filenamePeriod.replace(/\./g, ""),
  }).toUpperCase();
  return {
    message,
    subject,
    filename,
    recipient,
    ...useMutation({
      mutationFn: ({ b64PDF }: { b64PDF: string }) =>
        sendEmail({
          accessToken: token ?? "",
          b64PDF,
          message,
          subject,
          filename,
          recipient,
        }),
    }),
  };
};
