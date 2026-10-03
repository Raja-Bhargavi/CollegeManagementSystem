import ManagementModulePage from "./ManagementModulePage";

function ManagementPayments() {
    return (
        <ManagementModulePage
            title="Payments"
            description="View payment transactions and institutional payment records."
            endpoint="/payments"
        />
    );
}

export default ManagementPayments;