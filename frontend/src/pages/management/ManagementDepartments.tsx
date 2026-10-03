import ManagementModulePage from "./ManagementModulePage";

function ManagementDepartments() {
    return (
        <ManagementModulePage
            title="Departments"
            description="View academic departments and their institutional information."
            endpoint="/departments"
        />
    );
}

export default ManagementDepartments;