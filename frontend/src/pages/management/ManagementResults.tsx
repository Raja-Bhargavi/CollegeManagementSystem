import ManagementModulePage from "./ManagementModulePage";

function ManagementResults() {
    return (
        <ManagementModulePage
            title="Results"
            description="View student examination results and academic performance records."
            endpoint="/results"
        />
    );
}

export default ManagementResults;