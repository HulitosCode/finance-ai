import { db } from "../_lib/prisma";
import { Button } from "../_components/ui/button";
import { DataTable } from "../_components/ui/data-table";
import { transactioncolumns } from "./_columns";

const TransactionPage = async () => {
  // acessar as transacoes do meu banco de dados
  const transaction = await db.transaction.findMany({});
  return (
    <div className="space-y-6 p-6">
      {/* TITULO E BOTAO*/}
      <div className="flex w-full items-center justify-between">
        <h1>Transacoes</h1>
        <Button>Adicionar transacao</Button>
      </div>
      <DataTable columns={transactioncolumns} data={transaction} />
    </div>
  );
};

export default TransactionPage;
