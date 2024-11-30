import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useStoreGoogleDriveAppFile } from "@/services/query/useStoreGoogleDriveAppFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectValue } from "@radix-ui/react-select";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  street: z.string().optional(),
  streetNo: z.string().optional(),
  zipCode: z.string().optional(),
  locality: z.string().optional(),
  niss: z.string().optional(),
  language: z.string().optional(),
});

export const SettingsForm = ({
  onSubmit,
  defaultValues,
  fileId,
}: {
  defaultValues: z.infer<typeof formSchema>;
  fileId?: string;
  onSubmit: ReturnType<typeof useStoreGoogleDriveAppFile>["mutateAsync"];
}) => {
  const {
    t,
    i18n: { changeLanguage },
  } = useTranslation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const _onSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit({ data: JSON.stringify(values), fileId });
    toast({
      title: t("settings.save.success.title"),
      description: t("settings.save.success.description"),
      className:
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
    });
  };

  const fields = useMemo<
    {
      name: keyof z.infer<typeof formSchema>;
      label: string;
      placeholder: string;
    }[]
  >(
    () => [
      {
        name: "firstName",
        label: t("settings.form.labels.firstName"),
        placeholder: "Steve",
      },
      {
        name: "lastName",
        label: t("settings.form.labels.lastName"),
        placeholder: "Jobs",
      },
      {
        name: "street",
        label: t("settings.form.labels.street"),
        placeholder: "Rue de la forêt",
      },
      {
        name: "streetNo",
        label: t("settings.form.labels.number"),
        placeholder: "1",
      },
      {
        name: "zipCode",
        label: t("settings.form.labels.postalCode"),
        placeholder: "1000",
      },
      {
        name: "locality",
        label: t("settings.form.labels.locality"),
        placeholder: "Brussels",
      },
      {
        name: "niss",
        label: t("settings.form.labels.niss"),
        placeholder: "80.01.01-213-10",
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col flex-1 p-px">
      <Form {...form}>
        <form
          id="settings"
          onSubmit={form.handleSubmit(_onSubmit)}
          className="flex-1 space-y-4 md:space-y-8 md:columns-2 lg:columns-3"
        >
          {fields.map(({ name, label, placeholder }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="break-inside-avoid">
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.form.labels.language")}</FormLabel>
                <Select
                  onValueChange={(nextValue) => {
                    changeLanguage(nextValue);
                    field.onChange(nextValue);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fr">{t("common.french")}</SelectItem>
                    <SelectItem value="nl">{t("common.dutch")}</SelectItem>
                    <SelectItem value="en">{t("common.english")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
