import ManagementModulePage from "./ManagementModulePage";

function ManagementFees() {
    return (
        <ManagementModulePage
            title="Fees"
            description="View student fee records and institutional fee information."
            endpoint="/fees"
        />
    );
}

export default ManagementFees;