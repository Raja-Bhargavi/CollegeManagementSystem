import ManagementModulePage from "./ManagementModulePage";

function ManagementFaculty() {
    return (
        <ManagementModulePage
            title="Faculty"
            description="View faculty information and institutional teaching records."
            endpoint="/faculty"
        />
    );
}

export default ManagementFaculty;