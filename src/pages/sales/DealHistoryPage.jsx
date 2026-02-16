import SalesLayout from "../../layouts/SalesLayout";
import DealHistory from "../../components/tables/DealHistory";
import PageHeader from "../../components/common/PageHeader";

const DealHistoryPage = () => {
  return (
    <SalesLayout>
      <div className="space-y-10">
        <PageHeader
          heading="Deal History"
          subtitle="View a complete archive of all your past deals and their outcomes."
        />
        <DealHistory />
      </div>
    </SalesLayout>
  );
};

export default DealHistoryPage;
