import ManagementModulePage from "./ManagementModulePage";

function ManagementStaff() {
    return (
        <ManagementModulePage
            title="Staff"
            description="View staff information and administrative records."
            endpoint="/staff"
        />
    );
}

export default ManagementStaff;