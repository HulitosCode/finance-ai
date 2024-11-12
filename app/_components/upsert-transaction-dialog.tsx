import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { MoneyInput } from "./money-input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import {
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_CATEGORY_OPTIONS,
} from "../_constants/transactions";

import { DatePicker } from "./ui/date-picker";
import { DialogClose } from "@radix-ui/react-dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionCategory, TransactionPaymentMethod, TransactionType } from "@prisma/client";
import { upsertTransaction } from "../_actions/add-transaction";


interface UpsertTransactionDialogProps {
    isOpen: boolean
    defaultValues?: FormSchema
    transactionId?: string
    setIsOpen: (isOpen: boolean) => void
}

const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "O nome e obrigatorio.",
    }),
    amount: z
      .number({
        required_error: "O valor e obrigatorio",
      })
      .positive({
        message: " O valor e obrigatorio",
      }),
    type: z.nativeEnum(TransactionType, {
      required_error: "O tipo e obrigatorio.",
    }),
    category: z.nativeEnum(TransactionCategory, {
      required_error: "A categoria e obrigatorio.",
    }),
    paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
      required_error: "O metodo de pagamento e obrigatorio.",
    }),
    date: z.date({
      required_error: "A data e obrigatorio.",
    }),
  });
  
  type FormSchema = z.infer<typeof formSchema>;

const UpsertTransactionDialog = ({
    isOpen, 
    setIsOpen,
    defaultValues,
    transactionId,
}: UpsertTransactionDialogProps) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues ?? {
          amount: 0,
          category: TransactionCategory.OTHER,
          date: new Date(),
          name: "",
          paymentMethod: TransactionPaymentMethod.CASH,
          type: TransactionType.EXPENSE,
        },
      });

    const onSubmit = async (data: FormSchema) => {
        try {
          await upsertTransaction({...data,id: transactionId});
          setIsOpen(false);
          form.reset();
        } catch (error) {
          console.error(error);
        }
    };      

    const isUpdate = Boolean(transactionId)
      
    return (
        <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Atualizar' : "Criar"} transacao</DialogTitle>
          <DialogDescription>Insira as informacoes abaixo</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="Digite o valor"
                      value={field.value}
                      onValueChange={({
                        floatValue,
                      }: {
                        floatValue?: number;
                      }) => field.onChange(floatValue)}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleciona o tipo de transacao" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleciona a categoria..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metodo de pagamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleciona um metodo de pagamento..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant={"outline"}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">{isUpdate ? 'Atualizar' : "Adicionar"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    )
}

export default UpsertTransactionDialog